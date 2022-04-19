#include "sensor.hpp"
#include "math.h"

// Declaración de sensores externos
sensor sensor1(A0);
sensor sensor2(A1);
sensor sensor3(A2);
sensor sensor4(A3);
sensor sensor5(A4);

// Variables para el movimiento
  int marcha = 0;
  int pasos = 1;

String entrada;

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(115200);
}

void loop() {
  
  // enviarSensores();

  if (Serial.available())
  {
    entrada = Serial.readString();
    Serial.print(entrada);

    if (entrada.equals("calibrar"))
    {
      calibrar();
    }
    if(entrada.equals("controlar")){
      controlar();
    } 
  }

  // SPL_algorithm();
  enviarSensores();

  delay(100);
}

void enviarSensores(){
  Serial.print("sensor1 = ");
  Serial.print(sensor1.getData());
  Serial.print(",sensor2 = ");
  Serial.print(sensor2.getData());
  Serial.print(",sensor3 = ");
  Serial.print(sensor3.getData());
  Serial.print(",sensor4 = ");
  Serial.print(sensor4.getData());
  Serial.print(",sensor5 = ");
  Serial.println(sensor5.getData());


  // Serial.print(sensor1.getData());
  // Serial.print(", ");
  // Serial.print(sensor2.getData());
  // Serial.print(", ");
  // Serial.print(sensor3.getData());
  // Serial.print(", ");
  // Serial.print(sensor4.getData());
  // Serial.print(", ");
  // Serial.println(sensor5.getData());
  
}

void SPL_algorithm(){
  // int sensor1 = sensor1.getData();
  // int sensor2 = sensor2.getData();
  // int sensor3 = sensor3.getData();
  // int sensor4 = sensor4.getData();
  // int sensor5 = sensor5.getData();

  const float umbral = 0.01; // Sirve de referencia para la comparación


  // if (sensor1 > umbral)
  // {
  //   if ( abs(sensor2 - sensor4) > umbral ){
  //     moverY();
  //   }

  //   if ( abs(sensor3 - sensor5) > umbral ){
  //     moverX();
  //   }
  // }
  
}

void moverY(int velocidad){
  

  marcha++;

  if (marcha > velocidad){
    pasos++;
  }
  

  switch (pasos)
  {
  case 1:
    digitalWrite(1, HIGH);
    digitalWrite(2, LOW);
    digitalWrite(3, LOW);
    digitalWrite(4, LOW);
    break;
  
  case 2:
    digitalWrite(1, LOW);
    digitalWrite(2, HIGH);
    digitalWrite(3, LOW);
    digitalWrite(4, LOW);
    break;
  
  case 3:
    digitalWrite(1, LOW);
    digitalWrite(2, LOW);
    digitalWrite(3, HIGH);
    digitalWrite(4, LOW);
    break;
  
  case 4:
    digitalWrite(1, LOW);
    digitalWrite(2, LOW);
    digitalWrite(3, LOW);
    digitalWrite(4, HIGH);
    break;
  
  default:
    digitalWrite(1, LOW);
    digitalWrite(2, LOW);
    digitalWrite(3, LOW);
    digitalWrite(4, LOW);
    break;
  }
}
void moverX(){
  // 
}


void calibrar(){
  // Señal de entrada
  Serial.println("ok");
  // Calibrar
  while (true){
    if (Serial.available()){
      entrada = Serial.readString();
    }
      if (entrada.equals("salir"))
      {
        break;
      }
      

    Serial.println("Calibracion");
  }
}

void controlar(){
  // Señal de entrada
  Serial.println("ok");
  // Controlar
    Serial.println("Ciclo de control");
  // while (true){
  // }
  
}