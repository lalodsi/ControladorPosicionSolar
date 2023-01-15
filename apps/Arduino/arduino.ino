/////////////////////////////////////////////
//       Solar Positioning Controler       //
//                   for                   //
//        Solar Radiation Application      //
//                                         //
//               Jan 01, 2023              //
//                                         //
//   Filename: SPA.C                       //
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


#include "sensor.hpp"
#include <math.h>
#include "./MovimientoMotor/motor.h"
#include "anova/anova.h"

// Puertos de entrada y salida

// Demux
#define DEMUX_DIGITAL_PIN_1     6
#define DEMUX_DIGITAL_PIN_2     7
#define DEMUX_ANALOG_PIN_2      8
// Entradas analogicas
#define ANALOG_LIGHT_SENSOR_1   A0
#define ANALOG_LIGHT_SENSOR_2   A1
#define ANALOG_LIGHT_SENSOR_3   A2
#define ANALOG_LIGHT_SENSOR_4   A3
#define ANALOG_LIGHT_SENSOR_5   A6
// Motores
#define MOTOR_ELEVATION_DIR     2
#define MOTOR_ELEVATION_STEP    3
#define MOTOR_AZIMUT_DIR        4
#define MOTOR_AZIMUT_STEP       5
// Encoder Mecánico
#define ENCODER_DT              9
#define ENCODER_CLK             10
#define ENCODER_SWITCH          11

// Tamaño de los arreglos a recibir
#define ANOVA_DATA_SIZE         5
// Cantidad de sensores a medir
#define SENSORS                 5

double **data; // Variable que contendrá los datos a guardar

// Declaración de sensores externos
sensor sensor1(A0);
sensor sensor2(A1);
sensor sensor3(A2);
sensor sensor4(A3);
sensor sensor5(A4);

String serial_info;

void setup() {
  //Motores de movimiento
  pinMode(MOTOR_ELEVATION_DIR, OUTPUT);
  pinMode(MOTOR_ELEVATION_STEP, OUTPUT);
  pinMode(MOTOR_AZIMUT_DIR, OUTPUT);
  pinMode(MOTOR_AZIMUT_STEP, OUTPUT);

  // initialize serial communications at 9600 bps:
  Serial.begin(9600);

  // Matriz dinámica para el manejo de informacion
  data = (double **) malloc( ANOVA_DATA_SIZE * sizeof(double));
  for (int i = 0; i < ANOVA_DATA_SIZE; i++)
    data[i] = (double *) malloc(ANOVA_DATA_SIZE * sizeof(double));
}

void loop() {
  delay(50);

  setElevationAngle(5, MOTOR_ELEVATION_DIR, MOTOR_ELEVATION_STEP);
  setElevationAngle(5, MOTOR_AZIMUT_DIR, MOTOR_AZIMUT_STEP);
  setElevationAngle(-5, MOTOR_ELEVATION_DIR, MOTOR_ELEVATION_STEP);
  setElevationAngle(-5, MOTOR_AZIMUT_DIR, MOTOR_AZIMUT_STEP);

  if (Serial.available())
  {
    serialEvent();
  }
  
}

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

void SPL() {
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
  // while (true){
  //   waitForSerial();
  //   serial_info = Serial.readString();
  //   if (serial_info.equals("salir"))
  //     break;
  //   int n = serial_info.indexOf(","); // Separador para el valor de X y de Y
  //   String rotacionTexto = serial_info.substring(0, n);
  //   String elevacionTexto = serial_info.substring(n + 1);
  //   Movimiento
  //   int rotacion = rotacionTexto.toInt();
  //   int elevacion = elevacionTexto.toInt();
  //   Si faltan más pasos, realizarlos
  //   int pasosRestantesRotacion = abs(rotacion - pasosRotacion);
  //   int pasosRestantesElevacion = abs(elevacion - pasosElevacion);
  //   while (pasosRestantesElevacion > 0 || pasosRestantesRotacion > 0)
  //   {
  //     moverX(rotacion - pasosRotacion);
  //     moverY(elevacion - pasosElevacion);
  //   }
  //   delay(100);
  //   Serial.println("La serial_info es " + x + "," + y);
  // }
  
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
    SPL();
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
