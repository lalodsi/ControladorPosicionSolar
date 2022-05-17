#include "sensor.hpp"
#include "math.h"

// Declaración de sensores externos
sensor sensor1(A0);
sensor sensor2(A1);
sensor sensor3(A2);
sensor sensor4(A3);
sensor sensor5(A4);

// Variables para el movimiento del motor a pasos
  int marchaRotacion = 0;
  int marchaElevacion = 0;
  int ciclosRotacion = 0;
  int ciclosElevacion = 0;
  int pasosRotacion = 0;
  int pasosElevacion = 0;

String entrada;

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(115200);
}

void loop() {
  // SPL_algorithm();
  // moverY(1);

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
    SPL_algorithm();
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
      moverX();
    }
  }
  
}

void moverY(int direccion){
  marchaElevacion++;
  ciclosElevacion = marchaElevacion / 4;
  pasosElevacion = (marchaElevacion - (ciclosElevacion * 4)) + 1;

  if (direccion < 0)
  {
    pasosElevacion = 5 - pasosElevacion;
  }
  
  moverMotor(pasosElevacion, 1, 2, 3, 4);
  
}
void moverX(){
  marchaRotacion++;
  ciclosRotacion = marchaRotacion / 4;
  pasosRotacion = (marchaRotacion - (ciclosRotacion * 4)) + 1;

  if (direccion < 0)
  {
    pasosRotacion = 5 - pasosRotacion;
  }

  moverMotor(pasosRotacion, 5, 6, 7, 8);
}

void moverMotor(int pasos, int input1, int input2, int input3, int input4){
  switch (pasos)
  {
  case 1:
    digitalWrite(input1, HIGH);
    digitalWrite(input2, LOW);
    digitalWrite(input3, LOW);
    digitalWrite(input4, HIGH);
    break;
  
  case 2:
    digitalWrite(input1, HIGH);
    digitalWrite(input2, LOW);
    digitalWrite(input3, HIGH);
    digitalWrite(input4, LOW);
    break;
  
  case 3:
    digitalWrite(input1, LOW);
    digitalWrite(input2, HIGH);
    digitalWrite(input3, HIGH);
    digitalWrite(input4, LOW);
    break;
  
  case 4:
    digitalWrite(input1, LOW);
    digitalWrite(input2, HIGH);
    digitalWrite(input3, LOW);
    digitalWrite(input4, HIGH);
    break;
  
  default:
    digitalWrite(input1, LOW);
    digitalWrite(input2, LOW);
    digitalWrite(input3, LOW);
    digitalWrite(input4, LOW);
    break;
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