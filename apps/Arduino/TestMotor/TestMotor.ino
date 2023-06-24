#include "./motor.h"

const int steppin = 2;
const int dirpin = 3;

void setup(){
    pinMode(steppin, OUTPUT);
    pinMode(dirpin, OUTPUT);

    Serial.begin(9600);
    setElevationAngle(10, dirpin, steppin);
}

void loop(){
    // delay(500);
    // setElevationAngle(-10, dirpin, steppin);
    // delay(500);
}