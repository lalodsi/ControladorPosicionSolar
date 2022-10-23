#include <LiquidCrystal_I2C.h>
#include "MenuLCD.h"

#define ENCODER_DT 6
#define ENCODER_CLK 7
#define BOTON 8


// Variables para el encoder mecánico
bool edoBoton = false;


// Nivel del LCD que estará mostrando, prevNivel ayuda a registrar un cambio de nivel
int nivel = 0;
int prevNivel = 0;

// Contador para saber la posicion del encoder según su número
unsigned int contadorEncoder = 0;

// int numero = 0;

void setup(){
	lcd.init();                      // initialize the lcd 
  	lcd.backlight();
	pinMode(ENCODER_DT, INPUT);
	pinMode(ENCODER_CLK, INPUT);
	pinMode(BOTON, INPUT);

	Serial.begin(9600);

	attachInterrupt(digitalPinToInterrupt(ENCODER_DT),leerEncoder,RISING);
}

void loop(){
	delay(4);

	// Delay del boton
	if(debounce(BOTON)){
		DISPLAY_PAINTED = false;
		edoBoton = true;
		// contadorEncoder = 1;
  	}
	else edoBoton = false;

	if (prevNivel != nivel)
	{
		DISPLAY_PAINTED = false;
		prevNivel = nivel;
	}
	

	switch (nivel)
	{
		case 0:
			interfazMenuHome(&edoBoton, &nivel);
			break;
		case 1:
			interfazMenuPrincipal(&edoBoton, &nivel, &contadorEncoder);
			break;
		case 2:
			interfazCalibrar(&edoBoton, &nivel);
			break;
		case 3:
			interfazLecturas(&edoBoton, &nivel);
			break;
	}
}

//Función para la lectura del encoder, funciona sólo en interrupciones
void leerEncoder(){
	int b = digitalRead(ENCODER_CLK);
	if(b > 0){
		contadorEncoder++;
	}
	else{
		contadorEncoder--;
	}
	// Actualizar el display
	DISPLAY_PAINTED = false;
}

//Función anti-rebote
bool debounce(byte input){
	bool state = false;
	if(! digitalRead(input)){
		delay(200);
		while(! digitalRead(input));
		delay(200);
		state = true;
	}      
	return state;   
}