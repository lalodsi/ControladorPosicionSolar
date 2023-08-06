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
// #include <Wire.h>
#include <RTClib.h>

// Tamaño de los arreglos a recibir
  #define ANOVA_DATA_SIZE         5
// Cantidad de sensores a medir
  #define SENSORS                 5
// Variable que contendrá los datos a guardar
double datos[ANOVA_DATA_SIZE][ANOVA_DATA_SIZE] = {
        {0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0},
        {0, 0, 0, 0, 0},
};
// Permite tener guardado el index de los datos de los sensores
int dataMeasurementIndex = 0;
// Posición del panel
double posAzimut = 0.0f;
// Incidence angle, θ, is the angle between the sun’s rays and the normal on a surface
// https://www.sciencedirect.com/topics/engineering/solar-incidence-angle
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

// Check if the data array was fullfilled
bool isDataReady = false;

// Algorithm
// for SPA is 1
// for SPL is 2
// for Mixed is 3
int algorithmToUse = 3;


// Temporal variable to save data from serial port
String serial_info;

////////////////////////
// Time constants
////////////////////////

// Counter of delays of 50ms that the loop function takes.
int programCounter = 1;
// Default time between each loop function iteration
#define DEFAULT_PROGRAM_DELAY 50
// Time delay to take a measurement in seconds
#define TIME_TO_MEASURE_IN_MONITORING 0.1
// Time delay between each measurement in seconds
#define TIME_TO_MEASUREMENT 1
// Time delay to get data again from SPA algorithm
// It's defined to 300s = 5 minutes
#define TIME_TO_RECALCULATE_SPA 60
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

//////////////////////////
// Display LCD
//////////////////////////

// Inicializando el modulo de reloj
RTC_DS3231 clockModule;

// Inicializar algoritmo SPA
spa_data spa;
int spa_result;

void setup() {

  // Check spa.h file to know how to change each variable
  spa.year          = 2023;
  spa.month         = 7;
  spa.day           = 22;
  spa.hour          = 15;
  spa.minute        = 30;
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

  // Start the display LCD
  lcd.init();
  lcd.backlight();
  pinMode(PIN_ENCODER_DT, INPUT);
  pinMode(PIN_ENCODER_CLK, INPUT);
  pinMode(PIN_ENCODER_SWITCH, INPUT);
  // Create an interruption in order to use the encoder
  attachInterrupt(digitalPinToInterrupt(PIN_ENCODER_DT), readEncoder,RISING);

  clockModule.begin();
  //

  // clockModule.adjust(DateTime(__DATE__,__TIME__));

  

  // Motores de movimiento, pruebas
  pinMode(PIN_MOTOR_ELEVATION_DIR, OUTPUT);
  pinMode(PIN_MOTOR_ELEVATION_STEP, OUTPUT);
  pinMode(PIN_MOTOR_AZIMUT_DIR, OUTPUT);
  pinMode(PIN_MOTOR_AZIMUT_STEP, OUTPUT);

  // initialize serial communications at 9600 bps:
  Serial.begin(9600);
  Serial.setTimeout(100);

  spa_result = spa_calculate(&spa);

  posAzimut = spa.azimuth;
  posIncidence = spa.incidence;

  Serial.print("Starting Arduino");
  // Matriz dinámica para el manejo de informacion
  // datos = (double **) malloc( ANOVA_DATA_SIZE * sizeof(double));
  // for (int i = 0; i < ANOVA_DATA_SIZE; i++)
  //   datos[i] = (double *) malloc(ANOVA_DATA_SIZE * sizeof(double));
}

void loop() {
  spa_calculate(&spa);

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

  if (waitUntil(TIME_TO_MEASUREMENT)){
    select_Algorithm();

    Serial.print("{\"accion\":\"SPA_Testing\",");
    Serial.print("\"state\": {");
    Serial.print("\"azimutCurrent\":\"");
    Serial.print(posAzimut);
    Serial.print("\",");
    Serial.print("\"elevationCurrent\":\"");
    Serial.print(posIncidence);
    Serial.print("\",");
    Serial.print("\"azimutSPA\":\"");
    Serial.print(spa.azimuth);
    Serial.print("\",");
    Serial.print("\"incidenceSPA\":\"");
    Serial.print(spa.incidence);
    Serial.print("\"}");
    Serial.println("}");
  }

  if (waitUntil(TIME_TO_RECALCULATE_SPA))
  {
    Serial.println("Recalculating SPA with clock");
    //  .adjust(DateTime(__DATE__,__TIME__));
    // Updating Time
    spa.year = clockModule.now().year();
    spa.month = clockModule.now().month();
    spa.day = clockModule.now().day();
    spa.hour = clockModule.now().hour();
    spa.minute = clockModule.now().minute();
    spa.second = clockModule.now().second();
    // Mostrando Reloj
    Serial.println("\tActualizando Reloj");
    Serial.print("\t\tFecha: ");
    Serial.print(clockModule.now().year());
    Serial.print("-");
    Serial.print(clockModule.now().month());
    Serial.print("-");
    Serial.println(clockModule.now().day());
    Serial.print("\t\tHora: ");
    Serial.print(clockModule.now().hour());
    Serial.print("-");
    Serial.print(clockModule.now().minute());
    Serial.print("-");
    Serial.println(clockModule.now().second());
    // Recalculate SPA
    SPA_Algorithm();
  }


  // For arduino nano 33 ble
  if (Serial.available())
  {
    serialEvent();
  }
  delay(DEFAULT_PROGRAM_DELAY);
  programCounter++;
}

/**
 * Make the mixed Algorithm
*/
void Mixed_Algorithm(){

  if (isDataReady){
  // Serial.println("Printing matrix");
  // for (int i = 0; i < 5; i++){
  //   for (int j = 0; j < 5; j++){
  //     Serial.print(datos[i][j]);
  //     Serial.print("\t");
  //   }
  //   Serial.print("\n");
  // }
  transpose(datos);
  bool ANOVAresult = ANOVA_test(datos, ANOVA_DATA_SIZE);
  transpose(datos);
    if (ANOVAresult)
    {

      // Serial.print("Anova Aceptado, se utilizará el SPL");
      float diffAzimut = abs(spa.azimuth - posAzimut);
      float diffIncidence = abs(spa.incidence - posIncidence);
      // Applying SPL
      if (diffAzimut < 15 || diffIncidence < 15)
      {
        // Serial.print(" con una diferencia de ");
        // Serial.print(" azimut: ");
        // Serial.print(diffAzimut);
        // Serial.print(" incidence: ");
        // Serial.println(diffIncidence);
        SPL_Algorithm(false, false);
      }
      else{
        // Serial.println(" pero no hay diferencia en los sensores, se conservarán los valores originales");
      }
    }
    else{
      // Serial.println("\nAnova Rechazado, se utilizará el SPA");
      // Using SPA results
      setAzimutAngle((float)(spa.azimuth), PIN_MOTOR_AZIMUT_DIR, PIN_MOTOR_AZIMUT_STEP, &posAzimut);
      setElevationAngle((float)(spa.incidence), PIN_MOTOR_ELEVATION_DIR, PIN_MOTOR_ELEVATION_STEP, &posIncidence);
    }

    dataMeasurementIndex = 0;
  }
}

/**
 * Check if the defined time has elapsed
*/
bool waitUntil(double delayTime){
  return (programCounter % (int)(20.0 * delayTime) == 0);
}
/**
 * @brief Lee la información de los sensores y la envía hacia el puerto serie en
 * formato JSON
*/
void modoMonitoreo(){
  while (true)
  {
    if (waitUntil(TIME_TO_MEASURE_IN_MONITORING))
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

    programCounter++;
    if (Serial.available())
    {
      programCounter = 0;
      serial_info = Serial.readString();
      serial_info.trim();
      if (serial_info.equals("salir"))
      {
        isDataReady = false;
        break;
      }
    }

    isDataReady = getSensorsData();

    Mixed_Algorithm();

    // SPL_Algorithm(false);
    delay(DEFAULT_PROGRAM_DELAY);
  }
}

void SPL_Algorithm(bool showData, bool includeANOVA) {
  const float umbral = 0; // Sirve de referencia para la comparación
  bool result = false;
  if (includeANOVA)
  {
    transpose(datos);
    // ANOVA analisis, getting only the result
    result = ANOVA_test(datos, ANOVA_DATA_SIZE);
    transpose(datos);
  }

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

  if (result || includeANOVA)
  {
    result = false;
    double diferenciaY = sensor5.getData() - sensor1.getData();
    double diferenciaX = sensor2.getData() - sensor4.getData();
    // Serial.print("Diferencia en Y: ");
    // Serial.print(diferenciaY);
    // Serial.print(" diferencia en X: ");
    // Serial.println(diferenciaX);

    if (sensor3.getData() > umbral)
    {
      if ( abs(diferenciaY) > umbral ) {
        if (diferenciaY > 0)
        {
          setElevationAngle((float)(posIncidence - 1), PIN_MOTOR_ELEVATION_DIR, PIN_MOTOR_ELEVATION_STEP, &posIncidence);
        }
        else {
          setElevationAngle((float)(posIncidence + 1), PIN_MOTOR_ELEVATION_DIR, PIN_MOTOR_ELEVATION_STEP, &posIncidence);
        }
      }

      if ( abs(diferenciaX) > umbral ) {
        if (diferenciaX > 0)
        {
          setAzimutAngle((float)(posAzimut + 2), PIN_MOTOR_AZIMUT_DIR, PIN_MOTOR_AZIMUT_STEP, &posAzimut);
        }
        else {
          setAzimutAngle((float)(posAzimut - 2), PIN_MOTOR_AZIMUT_DIR, PIN_MOTOR_AZIMUT_STEP, &posAzimut);
        }
      }
    }
  }

  DataMeasureCounter++;
}

int SPA_Algorithm(){
  // Using the algorithm
  return spa_calculate(&spa);
}

void select_Algorithm(){
  Serial.print(" data ");
  isDataReady = getSensorsData();

  // Selecting algorithm
  if (isDataReady)
  {
    Serial.print("\n Selected  ");
    switch (algorithmToUse)
    {
    case 1:
      Serial.println("SPA");
      // Moving to SPA
      SPA_Algorithm();
      setAzimutAngle((float)(spa.azimuth), PIN_MOTOR_AZIMUT_DIR, PIN_MOTOR_AZIMUT_STEP, &posAzimut);
      setElevationAngle((float)(spa.incidence), PIN_MOTOR_ELEVATION_DIR, PIN_MOTOR_ELEVATION_STEP, &posIncidence);
      break;

    case 2:
      Serial.println("SPL");
      SPL_Algorithm(false, true);
      break;

    case 3:
      Serial.println("Mixed");
      Mixed_Algorithm();
      break;

    default:
      break;
    }
    isDataReady = false;
  }
}

/**
 * Get data from all sensors
*/
bool getSensorsData(){
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

  // Save data in an array
    datos[dataMeasurementIndex][0] = temporalSensor1Data;
    datos[dataMeasurementIndex][1] = temporalSensor2Data;
    datos[dataMeasurementIndex][2] = temporalSensor3Data;
    datos[dataMeasurementIndex][3] = temporalSensor4Data;
    datos[dataMeasurementIndex][4] = temporalSensor5Data;
    dataMeasurementIndex++;
    if (dataMeasurementIndex >= ANOVA_DATA_SIZE) {
      dataMeasurementIndex = 0;
      return true;
    };
    return false;
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
    if (serial_info.equals("currentAngle")){
      waitForSerial();
      serial_info = Serial.readString();
      serial_info.trim();

      int n = serial_info.indexOf(",");
      String azimutTexto = serial_info.substring(0, n);
      String elevacionTexto = serial_info.substring(n +1);
      // Conversion
      posAzimut = azimutTexto.toFloat();
      posIncidence = elevacionTexto.toFloat();

      Serial.print("{\"accion\":\"mensaje\",\"message\":\"Arduino cambio la posicion a ");
      Serial.print("azimut: ");
      Serial.print(azimutTexto);
      Serial.print(", elevacion: ");
      Serial.print(elevacionTexto);
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
      Serial.print(spa.year);
      Serial.print("-");
      Serial.print(spa.month);
      Serial.print("-");
      Serial.print(spa.day);
      Serial.print(", ");
      Serial.print(spa.hour);
      Serial.print(":");
      Serial.print(spa.minute);
      Serial.print(":");
      Serial.print(spa.second);
      Serial.println("\"}");

      clockModule.adjust(DateTime(__DATE__,__TIME__));

      switch (monthText.toInt())
      {
      case 1:
        monthText = "Jan";
        break;
      case 2:
        monthText = "Feb";
        break;
      case 3:
        monthText = "Mar";
        break;
      case 4:
        monthText = "Apr";
        break;
      case 5:
        monthText = "May";
        break;
      case 6:
        monthText = "Jun";
        break;
      case 7:
        monthText = "Jul";
        break;
      case 8:
        monthText = "Aug";
        break;
      case 9:
        monthText = "Sep";
        break;
      case 10:
        monthText = "Oct";
        break;
      case 11:
        monthText = "Nov";
        break;
      case 12:
        monthText = "Dec";
        break;
      default:
        break;
      }

      clockModule.adjust(DateTime(__DATE__,__TIME__));
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
    if (serial_info.equals("algorithm"))
    {
      waitForSerial();
      serial_info = Serial.readString();
      serial_info.trim();

      Serial.print("{\"accion\":\"mensaje\",\"message\":\"Arduino cambio el algoritmo a ");

      if (serial_info.equals("fijo"))
      {
        Serial.print("fijo con azimut: ");
        Serial.print(posAzimut);
        Serial.print(" incidencia: ");
        Serial.print(posIncidence);
        Serial.print("");
        algorithmToUse = 0;
      }
      if (serial_info.equals("SPA"))
      {
        Serial.print("SPA");
        algorithmToUse = 1;
      }
      if (serial_info.equals("SPL"))
      {
        Serial.print("SPL");
        algorithmToUse = 2;
      }
      if (serial_info.equals("mixed"))
      {
        Serial.print("Mixto");
        algorithmToUse = 3;
      }
      Serial.println("\"}");
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
    Serial.print("\"azimutNumber\":\"");
    Serial.print(rotacion);
    Serial.print("\",");
    Serial.print("\"incidenceText\":\"");
    Serial.print(elevacionTexto);
    Serial.print("\",");
    Serial.print("\"incidenceNumber\":\"");
    Serial.print(elevacion);
    Serial.print("\",");
    Serial.print("\"posIncidence\":");
    Serial.print(String(posIncidence));
    Serial.print(",");
    Serial.print("\"posAzimut\":");
    Serial.print(String(posAzimut));
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

  Serial.readString();
  Serial.flush();

  // MenuPrincipal
  Serial.print("{");
  Serial.print("\"accion\":\"changeMenu\",");
  Serial.print("\"menu\":\"home\"");
  Serial.println("}");
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