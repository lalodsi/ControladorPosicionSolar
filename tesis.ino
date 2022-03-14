#include "sensor.hpp"

// Declaración de sensores externos
sensor sensor1(A0);
sensor sensor2(A1);
sensor sensor3(A2);
sensor sensor4(A3);
sensor sensor5(A4);

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(115200);
}

void loop() {
  // map it to the range of the analog out:
  // outputValue = map(sensorValue, 0, 1023, 0, 255);
  // change the analog out value:
  // analogWrite(analogOutPin, outputValue);

  // print the results to the Serial Monitor:
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
  delay(100);
}
