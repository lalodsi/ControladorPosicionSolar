#include <LiquidCrystal_I2C.h>
#include "MenuLCD.h"

#define ENCODER_DT 6
#define ENCODER_CLK 7
#define BOTON 8


// Variables para el encoder mecánico
bool edoBoton = false;

int contadorBoton = 0;

int nivel = 0;

unsigned int contadorEncoder = 0;

// int numero = 0;

void setup(){
	lcd.init();                      // initialize the lcd 
  	lcd.backlight();
	pinMode(ENCODER_DT, INPUT);
	pinMode(ENCODER_CLK, INPUT);
	pinMode(BOTON, INPUT);

	attachInterrupt(digitalPinToInterrupt(ENCODER_DT),leerEncoder,RISING);
}

void loop(){
	delay(4);

	// Delay del boton
	if(debounce(BOTON)){
		DISPLAY_PAINTED = false;
		edoBoton = true;
		contadorEncoder = 1;
		contadorBoton ++;
  	}
	else edoBoton = false;

	switch (nivel)
	{
	case 0:
		menuHome(&edoBoton, &nivel);
		break;
	case 1:
		MenuPrincipal(edoBoton, contadorEncoder, &nivel);
		break;
	case 2:
		PantallaLecturas(0,1);
		PantallaCalibrar(0,1);
		break;
	
	// default:
	// 	menuHome(&edoBoton, &nivel);
	// 	break;
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