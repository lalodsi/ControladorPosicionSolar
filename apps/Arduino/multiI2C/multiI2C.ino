#include <LiquidCrystal_I2C.h>
#include "MenuLCD.h"
#include <Wire.h>
#include <RTClib.h>

#define ENCODER_DT 6
#define ENCODER_CLK 7
#define BOTON 8

RTC_DS3231 rtc;

void setup(){
	lcd.init();                      // initialize the lcd 
  	lcd.backlight();

    Serial.begin(9600);
  if (! rtc.begin()){
    Serial.println("Modulo RTC no encontrado");
    while(1);
  }

}

void loop(){
	delay(1000);

	Pintar(
		"Probando el I2C",
		"Esta pantalla debe",
		"funcionar con el",
		"reloj",
		0, 3
	);

    Serial.print(rtc.now().day());
    Serial.print("/");
    Serial.print(rtc.now().month());
    Serial.print("/");
    Serial.print(rtc.now().year());
    Serial.print(" ");
    Serial.print(rtc.now().hour());
    Serial.print(":");
    Serial.print(rtc.now().minute());
    Serial.print(":");
    Serial.println(rtc.now().second());


}