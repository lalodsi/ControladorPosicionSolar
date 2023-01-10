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
#include "math.h"
#include "motor.h"

// Declaración de sensores externos
sensor sensor1(A0);
sensor sensor2(A1);
sensor sensor3(A2);
sensor sensor4(A3);
sensor sensor5(A4);

String serial_info;

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(9600);
}

void loop() {
  delay(500);
  Serial.println("Working on loop function");

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

void SPL_algorithm(){
  const float umbral = 30; // Sirve de referencia para la comparación

  int diferenciaY = sensor2.getData() - sensor4.getData();
  int diferenciaX = sensor3.getData() - sensor5.getData();
  
  if (sensor1.getData() > umbral)
  {
    if ( abs(diferenciaY) > umbral ){
      moverY(diferenciaY);
    }

    if ( abs(diferenciaX) > umbral ){
      moverX(diferenciaX);
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
    if (serial_info.equals("salir"))
      break;
    int n = serial_info.indexOf(","); // Separador para el valor de X y de Y
    String rotacionTexto = serial_info.substring(0, n);
    String elevacionTexto = serial_info.substring(n + 1);
    // Movimiento
    int rotacion = rotacionTexto.toInt();
    int elevacion = elevacionTexto.toInt();
    // Si faltan más pasos, realizarlos
    int pasosRestantesRotacion = abs(rotacion - pasosRotacion);
    int pasosRestantesElevacion = abs(elevacion - pasosElevacion);
    while (pasosRestantesElevacion > 0 || pasosRestantesRotacion > 0)
    {
      moverX(rotacion - pasosRotacion);
      moverY(elevacion - pasosElevacion);
    }
    delay(100);
    // Serial.println("La serial_info es " + x + "," + y);
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
