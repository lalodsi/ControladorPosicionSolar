#include "sensor.hpp"
#include "math.h"
#include "motor.h"

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
  
  // testProject();
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
    if(entrada.equals("probar")){
      testProject();
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
  while (true){
    waitForSerial();
    entrada = Serial.readString();
    if (entrada.equals("salir"))
      break;
    int n = entrada.indexOf(","); // Separador para el valor de X y de Y
    String rotacionTexto = entrada.substring(0, n);
    String elevacionTexto = entrada.substring(n + 1);
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
    // Serial.println("La entrada es " + x + "," + y);
  }
  
}

void testProject(){
  Serial.println("{\"accion\":\"test\",\"message\":\"successful\"}");
}