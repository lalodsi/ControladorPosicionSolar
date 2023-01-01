#include "motor.h"

const int pin1 = 2;
const int pin2 = 3;
const int pin3 = 4;
const int pin4 = 5;

void setup(){
    pinMode(pin1, OUTPUT);
    pinMode(pin2, OUTPUT);
    pinMode(pin3, OUTPUT);
    pinMode(pin4, OUTPUT);
}
void loop(){

    moverY(1);

    delay(30);
}