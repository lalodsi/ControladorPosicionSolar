/////////////////////////////////////////////
//       Solar Positioning Controler       //
//                   for                   //
//        Solar Radiation Application      //
//                                         //
//               Jan 01, 2023              //
//                                         //
//   Filename: arduino.ino                       //
//                                         //
//   Luis Eduardo Rodríguez Ramírez        //
//   lrodriguezr1302@alumno.ipn.mx         //
//                                         //
//   Instituto Politécnico Nacional        //
/////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
//
//   ABOUT
//
//   This code is the main point of the project and was created to work with the app
//   "Solar Positioning Controler UI", a desktop app that works with this project
//
///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
//
//   NOTICE
//   Copyright (C) 2008-2011 Alliance for Sustainable Energy, LLC, All Rights Reserved
//
///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
// Revised 08-JAN-2023 Luis Rodríguez
//         Comments and info about the project
///////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////
// Input and Output ports
///////////////////////////////////////////////////////////////////////////////////////////////
// Entradas analogicas
  #define PIN_ANALOG_LIGHT_SENSOR_1   A0
  #define PIN_ANALOG_LIGHT_SENSOR_2   A1
  #define PIN_ANALOG_LIGHT_SENSOR_3   A2
  #define PIN_ANALOG_LIGHT_SENSOR_4   A3
  #define PIN_ANALOG_LIGHT_SENSOR_5   A6
// Motores
  #define PIN_MOTOR_ELEVATION_DIR     3
  #define PIN_MOTOR_ELEVATION_STEP    2
  #define PIN_MOTOR_AZIMUT_DIR        5
  #define PIN_MOTOR_AZIMUT_STEP       4
// Encoder Mecánico
  #define PIN_ENCODER_DT              9
  #define PIN_ENCODER_CLK             8
  #define PIN_ENCODER_SWITCH          10
// Demux
  #define PIN_DEMUX_SELECT_0          6
  #define PIN_DEMUX_SELECT_1          7
  #define PIN_DEMUX_ANALOG            A7
  #define PIN_DEMUX_VOLTAJE_PANEL       101
  #define PIN_DEMUX_VOLTAJE_CIRCUITO    102
  #define PIN_DEMUX_CORRIENTE_PANEL     103
  #define PIN_DEMUX_CORRIENTE_CIRCUITO  104
///////////////////////////////////////////////////////////////////////////////////////////////


#include "./sensor.hpp"
#include <math.h>
#include "./MovimientoMotor/motor.h"
#include "anova/anova.h"
#include <LiquidCrystal_I2C.h> // To been installed in Arduino
#include "./display/MenuLCD.h"
#include "./spa/spa.c"

// Tamaño de los arreglos a recibir
  #define ANOVA_DATA_SIZE         5
// Cantidad de sensores a medir
  #define SENSORS                 5
// Variable que contendrá los datos a guardar
double datos[ANOVA_DATA_SIZE][ANOVA_DATA_SIZE] = {
        { 0, 0, 0, 0, 0},
        { 0, 0, 0, 0, 0},
        { 0, 0, 0, 0, 0},
        { 0, 0, 0, 0, 0},
        { 0, 0, 0, 0, 0},
    };
// Permite tener guardado el index de los datos de los sensores
int dataMeasurementIndex = 0;
// Posición del panel
double posAzimut = 0.0f;
double posIncidence = 0.0f;

// Declaración de sensores externos
sensor sensor1(PIN_ANALOG_LIGHT_SENSOR_1);
sensor sensor2(PIN_ANALOG_LIGHT_SENSOR_2);
sensor sensor3(PIN_ANALOG_LIGHT_SENSOR_3);
sensor sensor4(PIN_ANALOG_LIGHT_SENSOR_4);
sensor sensor5(PIN_ANALOG_LIGHT_SENSOR_5);

double temporalSensor1Data = 0;
double temporalSensor2Data = 0;
double temporalSensor3Data = 0;
double temporalSensor4Data = 0;
double temporalSensor5Data = 0;
double temporalSensorPanelCurrent = 0;
double temporalSensorPanelVoltaje = 0;
double temporalSensorCircuitCurrent = 0;
double temporalSensorCircuitVoltaje = 0;


// Temporal variable to save data from serial port
String serial_info;

////////////////////////
// Time constants
////////////////////////

// Default time between each loop function iteration
#define TIME_MONITORING 50
// Time delay to take a measurement considerin loops of 50ms
// Example: If you want to take a second, you have to use a value of 1000ms / 50ms  = 20
#define TIME_TO_MEASURE 20
// Counter that has as a limit the TIME_TO_MEASURE
int monitoringCounter = 0;
// Time delay between each measurement considering loops of 50ms
// 50ms x 1 for testing
// 15s = 1500ms = 50ms x 20 for real data measurement
// In monitoring mode you have to add the TIME_TO_MEASURE
#define TIME_FOR_MEASUREMENT 1
// Counter to define the time between each measugement made by the hardware
int DataMeasureCounter = 0;       // Contador para el algoritmo SPL


//////////////////////////
// Display LCD
//////////////////////////

// Variables para el encoder mecánico
bool edoBoton = false;
// Nivel del LCD que estará mostrando, prevNivel ayuda a registrar un cambio de nivel
int nivel = 0;
int prevNivel = 0;
// Contador para saber la posicion del encoder según su número
unsigned int contadorEncoder = 0;


// Inicializar algoritmo SPA
spa_data spa;
int spa_result;

void setup() {

  // Check spa.h file to know how to change each variable
  spa.year          = 2023;
  spa.month         = 7;
  spa.day           = 17;
  spa.hour          = 14;
  spa.minute        = 0;
  spa.second        = 0;
  spa.timezone      = -6.0;
  spa.delta_ut1     = 0;
  spa.delta_t       = 67;
  spa.longitude     = -100.2841667;
  spa.latitude      = 20.54138889;
  spa.elevation     = 2000.0;
  spa.pressure      = 1019;
  // Temperatura media anual
  // Querétaro: https://cuentame.inegi.org.mx/monografias/informacion/queret/territorio/clima.aspx
  spa.temperature   = 18;
  spa.slope         = 0;
  spa.azm_rotation  = 5;
  spa.atmos_refract = 0.5667;
  spa.function      = SPA_ALL;

  spa_result = spa_calculate(&spa);

  posAzimut = spa.azimuth;
  posIncidence = spa.incidence;

  // Start the display LCD
  lcd.init();
  lcd.backlight();
  pinMode(PIN_ENCODER_DT, INPUT);
  pinMode(PIN_ENCODER_CLK, INPUT);
  pinMode(PIN_ENCODER_SWITCH, INPUT);
  // Create an interruption in order to use the encoder
  attachInterrupt(digitalPinToInterrupt(PIN_ENCODER_DT), readEncoder,RISING);

  // Motores de movimiento, pruebas
  pinMode(PIN_MOTOR_ELEVATION_DIR, OUTPUT);
  pinMode(PIN_MOTOR_ELEVATION_STEP, OUTPUT);
  pinMode(PIN_MOTOR_AZIMUT_DIR, OUTPUT);
  pinMode(PIN_MOTOR_AZIMUT_STEP, OUTPUT);

  // initialize serial communications at 9600 bps:
  Serial.begin(9600);
  Serial.setTimeout(100);

  // Matriz dinámica para el manejo de informacion
  // datos = (double **) malloc( ANOVA_DATA_SIZE * sizeof(double));
  // for (int i = 0; i < ANOVA_DATA_SIZE; i++)
  //   datos[i] = (double *) malloc(ANOVA_DATA_SIZE * sizeof(double));
}

void loop() {

  // Evalúa si el botón del encoder fue presionado y seteará la bandera para pintar el LCD
  if(debounce(PIN_ENCODER_SWITCH)){
		DISPLAY_PAINTED = false;
		edoBoton = true;
		// contadorEncoder = 1;
  	}
  else edoBoton = false;

  // Evalua si hay un cambio en la interfaz y seteará la bandera para pintar el LCD
  if (prevNivel != nivel)
	{
		DISPLAY_PAINTED = false;
		prevNivel = nivel;
	}

  switch (nivel)
	{
		case 0:
			interfazMenuHome(&edoBoton, &nivel);
			break;
		case 1:
			interfazMenuPrincipal(&edoBoton, &nivel, &contadorEncoder);
			break;
		case 2:
			interfazCalibrar(&edoBoton, &nivel);
			break;
		case 3:
			interfazLecturas(&edoBoton, &nivel);
			break;
	}

  // Algoritmo Mixto
  getSensorsData();
  spa_result = spa_calculate(&spa);

  transpose(datos);
  bool ANOVAresult = ANOVA_test(datos, ANOVA_DATA_SIZE);
  transpose(datos);

  if (dataMeasurementIndex >= ANOVA_DATA_SIZE){
    if (sensor3.getData() > 30)
    {
      float diffAzimut = abs(spa.azimuth - posAzimut);
      float diffIncidence = abs(spa.incidence - posIncidence);
      // Applying SPL
      if (diffAzimut < 15 || diffIncidence < 15)
      {
        SPL_Algorithm(false);
      }
    }
    else{
      // Using SPA results
      setAzimutAngle((float)(spa.azimuth), PIN_MOTOR_AZIMUT_DIR, PIN_MOTOR_AZIMUT_STEP, &posAzimut);
      setElevationAngle((float)(spa.incidence), PIN_MOTOR_ELEVATION_DIR, PIN_MOTOR_ELEVATION_STEP, &posIncidence);
    }

    dataMeasurementIndex = 0;
  }

  // For arduino nano 33 ble
  if (Serial.available())
  {
    serialEvent();
  }
  delay(TIME_MONITORING);
}

/**
 * @brief Lee la información de los sensores y la envía hacia el puerto serie en
 * formato JSON
*/
void modoMonitoreo(){

  while (true)
  {
    if (monitoringCounter % TIME_TO_MEASURE == 0)
    {
      Serial.print("{");
      Serial.print("\"accion\":\"monitoreo\",");
      Serial.print("\"sensor1\":");
      Serial.print(sensor1.getData());
      Serial.print(",\"sensor2\":");
      Serial.print(sensor2.getData());
      Serial.print(",\"sensor3\":");
      Serial.print(sensor3.getData());
      Serial.print(",\"sensor4\":");
      Serial.print(sensor4.getData());
      Serial.print(",\"sensor5\":");
      Serial.print(sensor5.getData());
      Serial.print(",\"voltaje_gen\":");
      Serial.print(sensor::getDemuxData(PIN_DEMUX_VOLTAJE_PANEL));
      Serial.print(",\"voltaje_sal\":");
      Serial.print(sensor::getDemuxData(PIN_DEMUX_VOLTAJE_CIRCUITO));
      Serial.print(",\"corriente_gen\":");
      Serial.print(sensor::getDemuxData(PIN_DEMUX_CORRIENTE_PANEL));
      Serial.print(",\"corriente_sal\":");
      Serial.print(sensor::getDemuxData(PIN_DEMUX_CORRIENTE_CIRCUITO));
      Serial.print(",\"pos_azimut\":");
      Serial.print(posAzimut);
      Serial.print(",\"pos_elevation\":");
      Serial.print(posIncidence);
      Serial.print(",\"spa_azimut\":");
      Serial.print(spa.azimuth);
      Serial.print(",\"spa_elevation\":");
      Serial.print(spa.incidence);
      Serial.println("}");
    }

    monitoringCounter++;
    if (Serial.available())
    {
      serial_info = Serial.readString();
      serial_info.trim();
      if (serial_info.equals("salir"))
      {
        break;
      }
    }
    SPL_Algorithm(false);
    delay(TIME_MONITORING);
  }
}

void SPL_Algorithm(bool showData) {
  const float umbral = 30; // Sirve de referencia para la comparación
  // Comienza proceso de recolección de datos
  // if (DataMeasureCounter % TIME_FOR_MEASUREMENT == 0)
  // {
  //   datos[dataMeasurementIndex][0] = temporalSensor1Data;
  //   datos[dataMeasurementIndex][1] = temporalSensor2Data;
  //   datos[dataMeasurementIndex][2] = temporalSensor3Data;
  //   datos[dataMeasurementIndex][3] = temporalSensor4Data;
  //   datos[dataMeasurementIndex][4] = temporalSensor5Data;
  //   dataMeasurementIndex++;
  //   if (dataMeasurementIndex >= ANOVA_DATA_SIZE) dataMeasurementIndex = 0;
  // }

  transpose(datos);

  // ANOVA analisis, getting only the result
  bool result = ANOVA_test(datos, ANOVA_DATA_SIZE);

  transpose(datos);

  // Comienza impresión de los datos graficados
  if (showData)
  {
    Serial.print("{");
    Serial.print("\"accion\":\"anova\",");
    // for (int i = 0; i < SENSORS; i++)
    // {
    //   if (i == 0) {
    //     Serial.print("\"sensor");
    //     Serial.print((i+1));
    //   }
    //   else {
    //     Serial.print(",\"sensor");
    //     Serial.print(i+1);
    //   }
    //     Serial.print("\": [");
    //   for (int j = 0; j < ANOVA_DATA_SIZE; j++)
    //   {
    //     if (j == 0) Serial.print(datos[j][i]);
    //     else {
    //       Serial.print(",");
    //       Serial.print(datos[j][i]);
    //     }
    //   }
    //   Serial.print("]");
    // }
    // Serial.print(",");
    // Serial.print("\"S2PE\":");
    // Serial.print(s2pe_value);
    // Serial.print(",");
    // Serial.print("\"S2_factor\":");
    // Serial.print(S2Factor_value);
    // Serial.print(",");
    // Serial.print("\"AnovaValue\":");
    // Serial.print(valorF);
    // Serial.print(",");
    Serial.print("\"AnovaResult\":");
    if (result) Serial.print("true");
    else Serial.print("false");
    Serial.println("}");
  }

  if (result)
  {
    int diferenciaY = sensor5.getData() - sensor1.getData();
    int diferenciaX = sensor2.getData() - sensor4.getData();

    if (sensor3.getData() > umbral)
    {
      if ( abs(diferenciaY) > umbral ) {
        if (diferenciaY > 0)
        {
          setElevationAngle((float)(posIncidence - 0.5), PIN_MOTOR_ELEVATION_DIR, PIN_MOTOR_ELEVATION_STEP, &posIncidence);
        }
        else {
          setElevationAngle((float)(posIncidence + 0.5), PIN_MOTOR_ELEVATION_DIR, PIN_MOTOR_ELEVATION_STEP, &posIncidence);
        }
      }

      if ( abs(diferenciaX) > umbral ) {
        if (diferenciaX > 0)
        {
          setAzimutAngle((float)(posAzimut + 1), PIN_MOTOR_AZIMUT_DIR, PIN_MOTOR_AZIMUT_STEP, &posAzimut);
        }
        else {
          setAzimutAngle((float)(posAzimut - 1), PIN_MOTOR_AZIMUT_DIR, PIN_MOTOR_AZIMUT_STEP, &posAzimut);
        }
      }
    }
  }

  DataMeasureCounter++;
}

void SPA_Algorithm(){
  // Defining the algorithm
  if (ANOVA_test(datos, ANOVA_DATA_SIZE))
  {
    spa_result = spa_calculate(&spa);
  }
}

void getSensorsData(){
  // Proceso de recolección de datos
    temporalSensor1Data = sensor1.getData();
    temporalSensor2Data = sensor2.getData();
    temporalSensor3Data = sensor3.getData();
    temporalSensor4Data = sensor4.getData();
    temporalSensor5Data = sensor5.getData();
    temporalSensorPanelCurrent = sensor::getDemuxData(PIN_DEMUX_CORRIENTE_PANEL);
    temporalSensorPanelVoltaje = sensor::getDemuxData(PIN_DEMUX_VOLTAJE_PANEL);
    temporalSensorCircuitCurrent = sensor::getDemuxData(PIN_DEMUX_CORRIENTE_CIRCUITO);
    temporalSensorCircuitVoltaje = sensor::getDemuxData(PIN_DEMUX_VOLTAJE_CIRCUITO);

  // Guardar 
  if (DataMeasureCounter % TIME_FOR_MEASUREMENT == 0)
  {
    datos[dataMeasurementIndex][0] = temporalSensor1Data;
    datos[dataMeasurementIndex][1] = temporalSensor2Data;
    datos[dataMeasurementIndex][2] = temporalSensor3Data;
    datos[dataMeasurementIndex][3] = temporalSensor4Data;
    datos[dataMeasurementIndex][4] = temporalSensor5Data;
    dataMeasurementIndex++;
    // if (dataMeasurementIndex >= ANOVA_DATA_SIZE) dataMeasurementIndex = 0;
  }

  DataMeasureCounter++;
}
/**
 * @brief Esperará a que haya información en el puerto serie para continuar la ejecución
 * 
 */
void waitForSerial(){
  // Serial.flush();
  while (!Serial.available()){
    // Wait
  }
}

void modoCalibracion(){
  Serial.println("{\"accion\":\"mensaje\",\"message\":\"Calibracion activada\"}");

  while (true)
  {
    waitForSerial();
    serial_info = Serial.readString();
    serial_info.trim();
    if (serial_info.equals("salir"))
      break;

    if (serial_info.equals("position")){
      waitForSerial();
      serial_info = Serial.readString();
      serial_info.trim();

      int n = serial_info.indexOf(",");
      String latitudTexto = serial_info.substring(0, n);
      String longitudTexto = serial_info.substring(n +1);
      // Conversion
      spa.longitude = longitudTexto.toFloat();
      spa.latitude = latitudTexto.toFloat();

      Serial.print("{\"accion\":\"mensaje\",\"message\":\"Arduino cambio la posicion a ");
      Serial.print("latitud: ");
      Serial.print(latitudTexto);
      Serial.print(", longitud: ");
      Serial.print(longitudTexto);
      Serial.println("\"}");
    }
    if (serial_info.equals("date")){
      waitForSerial();
      serial_info = Serial.readString();
      serial_info.trim();
      // Splitting string
      int indexStart = 0;
      int indexEnd = serial_info.indexOf("-");
      String yearText = serial_info.substring(0, indexEnd);
      indexStart = indexEnd + 1;
      indexEnd = serial_info.indexOf("-", indexStart);
      String monthText = serial_info.substring(indexStart, indexEnd);
      indexStart = indexEnd + 1;
      indexEnd = serial_info.indexOf("-", indexStart);
      String dayText = serial_info.substring(indexStart, indexEnd);
      indexStart = indexEnd + 1;
      indexEnd = serial_info.indexOf("-", indexStart);
      String hourText = serial_info.substring(indexStart, indexEnd);
      indexStart = indexEnd + 1;
      indexEnd = serial_info.indexOf("-", indexStart);
      String minutesText = serial_info.substring(indexStart, indexEnd);
      String secondsText = serial_info.substring(indexEnd+1);
      // Converting string
      spa.year = yearText.toInt();
      spa.month = monthText.toInt();
      spa.day = dayText.toInt();
      spa.hour = hourText.toInt();
      spa.minute = minutesText.toInt();
      spa.second = secondsText.toInt();
      // Actualizar la info en el modulo de reloj
      Serial.print("{\"accion\":\"mensaje\",\"message\":\"Arduino cambio la fecha y hora a ");
      Serial.print(yearText);
      Serial.print("-");
      Serial.print(monthText);
      Serial.print("-");
      Serial.print(dayText);
      Serial.print(", ");
      Serial.print(hourText);
      Serial.print(":");
      Serial.print(minutesText);
      Serial.print(":");
      Serial.print(secondsText);
      Serial.println("\"}");
    }
    if (serial_info.equals("orientation")){
      waitForSerial();
      serial_info = Serial.readString();
      serial_info.trim();

      spa.azimuth = serial_info.toFloat();
      Serial.print("{\"accion\":\"mensaje\",\"message\":\"Arduino cambio la orientacion a ");
      Serial.print(serial_info);
      Serial.print(" grados");
      Serial.println("\"}");

      // Asignar Datos
      spa.azm_rotation = serial_info.toFloat();
    }

    Serial.flush();
  }
  

}

void modoControlManual(){
  while (true){
    waitForSerial();
    serial_info = Serial.readString();
    serial_info.trim();
    if (serial_info.equals("salir"))
      break;
    int n = serial_info.indexOf(","); // Separador para el valor de X y de Y
    String rotacionTexto = serial_info.substring(0, n);
    String elevacionTexto = serial_info.substring(n + 1);
    // Movimiento
    float rotacion = rotacionTexto.toFloat();
    float elevacion = elevacionTexto.toFloat();
    // Si faltan más pasos, realizarlos
    setElevationAngle(elevacion, PIN_MOTOR_ELEVATION_DIR, PIN_MOTOR_ELEVATION_STEP, &posIncidence);
    setAzimutAngle(rotacion, PIN_MOTOR_AZIMUT_DIR, PIN_MOTOR_AZIMUT_STEP, &posAzimut);
    // Mostrar la información al puerto
    Serial.print("{\"accion\":\"controlMotors\",");
    Serial.print("\"state\": {");
    Serial.print("\"azimutText\":\"");
    Serial.print(rotacionTexto);
    Serial.print("\",");
    Serial.print("\"incidenceText\":\"");
    Serial.print(elevacionTexto);
    Serial.print("\",");
    Serial.print("\"posIncidence\":");
    Serial.print(String(posIncidence));
    Serial.print(",");
    Serial.print("\"posAzimut\":");
    Serial.print(String(posIncidence));
    Serial.print("}");
    Serial.println("}");
    // Limpiar la informacion que se haya quedado
    Serial.flush();
  }
  
}

void modoPrueba(){
  Serial.println("{\"accion\":\"test\",\"message\":\"successful\"}");
}

void serialEvent(){
  serial_info = Serial.readString();
  serial_info.trim();
    // Control de flujo
  if(serial_info.equals("calibrar")){
    Serial.print("{");
    Serial.print("\"accion\":\"changeMenu\",");
    Serial.print("\"menu\":\"calibrar\"");
    Serial.println("}");
    modoCalibracion();
  }
  if(serial_info.equals("controlar")){
    Serial.print("{");
    Serial.print("\"accion\":\"changeMenu\",");
    Serial.print("\"menu\":\"controlar\"");
    Serial.println("}");
    modoControlManual();
  } 
  if(serial_info.equals("monitorear")){
    Serial.print("{");
    Serial.print("\"accion\":\"changeMenu\",");
    Serial.print("\"menu\":\"monitorear\"");
    Serial.println("}");
    modoMonitoreo();
  } 
  if(serial_info.equals("probar")){
    modoPrueba();
  }
  if(serial_info.equals("reset")){
    resetearPuntoMedio();
  }
  if(serial_info.equals("anova")){
    SPL_Algorithm(true);
  }

  Serial.readString();
  Serial.flush();

  // MenuPrincipal
  Serial.print("{");
  Serial.print("\"accion\":\"changeMenu\",");
  Serial.print("\"menu\":\"home\"");
  Serial.println("}");
}

void resetearPuntoMedio(){
  // Posición del panel
  posAzimut = 0.0f;
  posIncidence = 0.0f;
}

// Funciones para el uso del Display LCD

// Funcion para leer el encoder, funciona sólo para interrupciones
void readEncoder(){
	int b = digitalRead(PIN_ENCODER_CLK);
	if(b > 0){
		contadorEncoder++;
	}
	else{
		contadorEncoder--;
	}
	// Actualizar el display
	DISPLAY_PAINTED = false;
}

//Función anti-rebote
bool debounce(byte input){
	bool state = false;
	if(! digitalRead(input)){
		delay(20);
		while(! digitalRead(input));
		delay(20);
		state = true;
	}      
	return state;   
}