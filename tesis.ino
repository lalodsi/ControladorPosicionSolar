#include "sensor.hpp"

// Declaración de sensores externos
sensor sensor1(A0);
sensor sensor2(A1);
sensor sensor3(A2);
sensor sensor4(A3);
sensor sensor5(A4);

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

  delay(1000);
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