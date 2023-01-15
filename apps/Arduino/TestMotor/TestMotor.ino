#include "./motor.h"

const int steppin = 3;
const int dirpin = 2;

void setup(){
    pinMode(steppin, OUTPUT);
    pinMode(dirpin, OUTPUT);

    Serial.begin(9600);
}

void loop(){
    setElevationAngle(10, dirpin, steppin);
    delay(500);
    setElevationAngle(-10, dirpin, steppin);
    delay(500);
}