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
    // Serial.print(entrada);

    // Control de flujo
    if (entrada.equals("calibrar")){
      calibrar();
    }
    if(entrada.equals("controlar")){
      controlar();
    } 
    if(entrada.equals("monitorear")){
      enviarSensores();
    } 
    Serial.flush();
  }

  // SPL_algorithm();
  delay(100);
}

void enviarSensores(){

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
      entrada = Serial.readString();
      if (entrada.equals("salir"))
      {
        break;
      }
      
    }

    delay(100);
  }
  
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

void calibrar(){
  Serial.println("{\"accion\":\"mensaje\",\"message\":\"Calibracion activada\"}");
  waitForSerial();

  entrada = Serial.readString();
    // Serial.print(entrada);
    if (entrada.equals("position")){
      waitForSerial();
      entrada = Serial.readString();
      Serial.println("{\"accion\":\"mensaje\",\"message\":\"Arduino cambio la posicion\"}");
    }
    if (entrada.equals("date")){
      waitForSerial();
      entrada = Serial.readString();
      // Actualizar la info en el modulo de reloj
      Serial.println("{\"accion\":\"mensaje\",\"message\":\"Arduino cambio la fecha y hora\"}");
    }
    if (entrada.equals("orientation")){
      waitForSerial();
      entrada = Serial.readString();
      Serial.println("{\"accion\":\"mensaje\",\"message\":\"Arduino cambio la orientacion\"}");
    }

  Serial.flush();
    // if (entrada.equals("salir"))
    // {
    //   break;
    // }
    

  // Serial.println("Calibracion");
}

void controlar(){
  // Señal de entrada
  Serial.println("ok");
  // Controlar
    Serial.println("Ciclo de control");
  // while (true){
  // }
  
}