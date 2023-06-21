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


#include "./sensor.hpp"
#include <math.h>
#include "./MovimientoMotor/motor.h"
#include "anova/anova.h"
#include <LiquidCrystal_I2C.h>
#include "./display/MenuLCD.h"


///////////////////////////////////////////////////////////////////////////////////////////////
// Input and Output ports
///////////////////////////////////////////////////////////////////////////////////////////////
//
// Demux
  #define PIN_DEMUX_DIGITAL_1     6
  #define PIN_DEMUX_DIGITAL_2     7
  #define PIN_DEMUX_ANALOG_2      8
// Entradas analogicas
  #define PIN_ANALOG_LIGHT_SENSOR_1   A0
  #define PIN_ANALOG_LIGHT_SENSOR_2   A1
  #define PIN_ANALOG_LIGHT_SENSOR_3   A2
  #define PIN_ANALOG_LIGHT_SENSOR_4   A3
  #define PIN_ANALOG_LIGHT_SENSOR_5   A6
// Motores
  #define PIN_MOTOR_ELEVATION_DIR     2
  #define PIN_MOTOR_ELEVATION_STEP    3
  #define PIN_MOTOR_AZIMUT_DIR        4
  #define PIN_MOTOR_AZIMUT_STEP       5
// Encoder Mecánico
  #define PIN_ENCODER_DT              9
  #define PIN_ENCODER_CLK             10
  #define PIN_ENCODER_SWITCH          11
//
///////////////////////////////////////////////////////////////////////////////////////////////


// Tamaño de los arreglos a recibir
  #define ANOVA_DATA_SIZE         5
// Cantidad de sensores a medir
  #define SENSORS                 5
// Variable que contendrá los datos a guardar
double **data;
// Posición del panel
double posAzimut = 0.0f;
double posIncidence = 0.0f;

// Declaración de sensores externos
sensor sensor1(A0);
sensor sensor2(A1);
sensor sensor3(A2);
sensor sensor4(A3);
sensor sensor5(A6);

// Temporal variable to save data from serial port
String serial_info;

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

void setup() {

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
  // pinMode(PIN_MOTOR_AZIMUT_DIR, OUTPUT);
  // pinMode(PIN_MOTOR_AZIMUT_STEP, OUTPUT);

  // initialize serial communications at 9600 bps:
  Serial.begin(9600);

  // Matriz dinámica para el manejo de informacion
  data = (double **) malloc( ANOVA_DATA_SIZE * sizeof(double));
  for (int i = 0; i < ANOVA_DATA_SIZE; i++)
    data[i] = (double *) malloc(ANOVA_DATA_SIZE * sizeof(double));
}

void loop() {
  delay(50);

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

  setElevationAngle(5.0, PIN_MOTOR_ELEVATION_DIR, PIN_MOTOR_ELEVATION_STEP, &posAzimut);
  // setElevationAngle(5, PIN_MOTOR_AZIMUT_DIR, PIN_MOTOR_AZIMUT_STEP);
  setElevationAngle(-5.0, PIN_MOTOR_ELEVATION_DIR, PIN_MOTOR_ELEVATION_STEP, &posAzimut);
  // setElevationAngle(-5, PIN_MOTOR_AZIMUT_DIR, PIN_MOTOR_AZIMUT_STEP);

  if (Serial.available())
  {
    serialEvent();
  }
}

/**
 * @brief Lee la información de los sensores y la envía hacia el puerto serie en
 * formato JSON
*/
void modoMonitoreo(){

  while (true)
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
    Serial.print("0");
    Serial.print(",\"voltaje_sal\":");
    Serial.print("0");
    Serial.print(",\"corriente_gen\":");
    Serial.print("0");
    Serial.print(",\"corriente_sal\":");
    Serial.print("0");
    Serial.println("}");

    if (Serial.available())
    {
      serial_info = Serial.readString();
      serial_info.trim();
      if (serial_info.equals("salir"))
      {
        break;
      }
    }

    delay(50);
  }
  
}

void SPL_Algorithm() {
  const float umbral = 30; // Sirve de referencia para la comparación
  const int delay_time = 500;

  // Comienza proceso de recolección de datos
  for (int i = 0; i < ANOVA_DATA_SIZE; i++)
  {
    *data[i,0] = analogRead(A0);
    *data[i,1] = analogRead(A1);
    *data[i,2] = analogRead(A2);
    *data[i,3] = analogRead(A3);
    *data[i,4] = analogRead(A4);
    delay(delay_time); // Tiempo de espera antes de la siguiente etapa de medicion
    digitalWrite(LED_BUILTIN, HIGH);
    delay(delay_time);
    digitalWrite(LED_BUILTIN, LOW);
  }

  //Comienza impresión de los datos graficados
  Serial.print("{");
  for (int i = 0; i < SENSORS; i++)
  {
    if (i == 0) {
      Serial.print("\"sensor");
      Serial.print((i+1));
    }
    else {
      Serial.print(",\"sensor");
      Serial.print(i+1);
    }
      Serial.print("\": [");
    for (int j = 0; j < ANOVA_DATA_SIZE; j++)
    {
      if (j == 0) Serial.print(*data[j,i]);
      else {
        Serial.print(",");
        Serial.print(*data[j,i]);
      }
    }
    Serial.print("]");
  }
  Serial.print("}\n");

  // Analisis ANOVA
  bool result = ANOVA_test(data, ANOVA_DATA_SIZE);
  Serial.print("{");
  Serial.print("\"result\":");
  if (result) Serial.print("true");
  else Serial.print("false");
  Serial.print("}\n");

  int diferenciaY = sensor2.getData() - sensor4.getData();
  int diferenciaX = sensor3.getData() - sensor5.getData();

  if (sensor1.getData() > umbral)
  {
    if ( abs(diferenciaY) > umbral ) {
      //moverY(diferenciaY);
    }

    if ( abs(diferenciaX) > umbral ) {
      //moverX(diferenciaX);
    }
  }

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
  waitForSerial();

  serial_info = Serial.readString();
  if (serial_info.equals("position")){
    waitForSerial();
    serial_info = Serial.readString();
    Serial.println("{\"accion\":\"mensaje\",\"message\":\"Arduino cambio la posicion\"}");
  }
  if (serial_info.equals("date")){
    waitForSerial();
    serial_info = Serial.readString();
    // Actualizar la info en el modulo de reloj
    Serial.println("{\"accion\":\"mensaje\",\"message\":\"Arduino cambio la fecha y hora\"}");
  }
  if (serial_info.equals("orientation")){
    waitForSerial();
    serial_info = Serial.readString();
    Serial.println("{\"accion\":\"mensaje\",\"message\":\"Arduino cambio la orientacion\"}");
  }

  Serial.flush();
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
    setAzimutAngle(elevacion, PIN_MOTOR_ELEVATION_DIR, PIN_MOTOR_ELEVATION_STEP, &posIncidence);
    setAzimutAngle(rotacion, PIN_MOTOR_AZIMUT_DIR, PIN_MOTOR_AZIMUT_STEP, &posAzimut);
    delay(100);
    Serial.println("Posicion actual: " + String(posIncidence) + ", valor de elevacion: " + elevacionTexto + ", " + String(elevacion,4));
    Serial.println("Posicion actual: " + String(posAzimut) + ", valor de rotacion: " + rotacionTexto + ", " + String(rotacion,4));
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
  if(serial_info.equals("anova")){
    SPL_Algorithm();
  }

  Serial.flush();

  // MenuPrincipal
  Serial.print("{");
  Serial.print("\"accion\":\"changeMenu\",");
  Serial.print("\"menu\":\"home\"");
  Serial.println("}");

  // digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(50);                       // wait for a second
  // digitalWrite(LED_BUILTIN, LOW);
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
		delay(200);
		while(! digitalRead(input));
		delay(200);
		state = true;
	}      
	return state;   
}