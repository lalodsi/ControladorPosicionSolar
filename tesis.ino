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
  delay(12000);
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
      moverX(diferenciaX);
    }
  }
  
}
void Mover(int *marcha, int *ciclos, int *pasos, int direccion){
  *marcha = *marcha + 1;
  *ciclos = *marcha / 4;
  *pasos = (*marcha - (*ciclos * 4)) + 1;

  if (direccion < 0)
  {
    *pasos = 5 - *pasos;
  }
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
 * @brief Se moverá el motor para la elevación del sistema
 * 
 * @param direccion numero entero que representa la dirección a donde el motor estará moviendose
 */
void moverY(int direccion){

  Mover(&marchaElevacion, &ciclosElevacion, &pasosElevacion, &direccion);
  
  moverMotor(pasosElevacion, 1, 2, 3, 4);
  
}
/**
 * @brief Se moverá el motor para la rotación del sistema
 * 
 */
void moverX(int direccion){
  
  Mover(&marchaRotacion, &ciclosRotacion, &pasosRotacion, &direccion);
  
  moverMotor(pasosRotacion, 5, 6, 7, 8);
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