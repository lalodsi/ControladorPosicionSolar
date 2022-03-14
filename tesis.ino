#include "sensor.hpp"



// These constants won't change. They're used to give names to the pins used:
const int analog1 = A0;  // Analog input pin that the potentiometer is attached to
const int analog2 = A1;  // Analog input pin that the potentiometer is attached to
const int analog3 = A2;  // Analog input pin that the potentiometer is attached to
const int analog4 = A3;  // Analog input pin that the potentiometer is attached to
const int analog5 = A4;  // Analog input pin that the potentiometer is attached to

int sensor1 = 0;        // value read from the pot
int sensor2 = 0;        // value read from the pot
int sensor3 = 0;        // value read from the pot
int sensor4 = 0;        // value read from the pot
int sensor5 = 0;        // value read from the pot
int outputValue = 0;        // value output to the PWM (analog out)

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(115200);
}

void loop() {
  // read the analog in value:
  sensor1 = analogRead(analog1);
  sensor2 = analogRead(analog2);
  sensor3 = analogRead(analog3);
  sensor4 = analogRead(analog4);
  sensor5 = analogRead(analog5);
  // map it to the range of the analog out:
  // outputValue = map(sensorValue, 0, 1023, 0, 255);
  // change the analog out value:
  // analogWrite(analogOutPin, outputValue);

  // print the results to the Serial Monitor:
  Serial.print("sensor1 = ");
  Serial.print(sensor1);
  Serial.print(",sensor2 = ");
  Serial.print(sensor2);
  Serial.print(",sensor3 = ");
  Serial.print(sensor3);
  Serial.print(",sensor4 = ");
  Serial.print(sensor4);
  Serial.print(",sensor5 = ");
  Serial.println(sensor5);
  delay(100);
}
