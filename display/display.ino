#include <LiquidCrystal_I2C.h>
// #include "MenuLCD.h"

#define ENCODER_DT 6
#define ENCODER_CLK 7
#define BOTON 8

// Variables para el display
const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display
// LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
// Variables para el encoder mecánico
bool edoBoton = false;
int contadorBoton = 0;
int nivel = 0;
unsigned int contadorEncoder = 0;

// Bandera para pintar una sola vez 
bool DISPLAY_PAINTED = false;

int numero = 0;

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
		Home();
		break;
	case 1:
		MenuPrincipal();
		break;
	case 2:
		PantallaLecturas(0,1);
		PantallaCalibrar(0,1);
		break;
	
	default:
		Home();
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


// Funciones para el display

void Pintar(String line1, String line2, String line3, String line4,int col,int row, bool cursor){
	if (!DISPLAY_PAINTED)
	{
		lcd.clear();

		lcd.setCursor(0,0);
		lcd.print(line1);
		lcd.setCursor(0,1);
		lcd.print(line2);
		lcd.setCursor(0,2);
		lcd.print(line3);
		lcd.setCursor(0,3);
		lcd.print(line4);

		lcd.setCursor(col,row);
		lcd.print(">");
		// while (cursor)
		//  {
		//  	delay(500);
		//  	lcd.setCursor(col,row);
		//  	lcd.print(" ");
		//  	delay(500);
		//  }
	}
	
	DISPLAY_PAINTED = true;
}
void PintarYBarrer(){
	// TODO: Crear una funcion que recorrar 4 strings consecutivos de un array de string
	//  	o matriz de caracteres desde el valor i hasta i + 4, los valores de i se modificarán
	//		con el movimiento de un encoder mecánico
}
void Home() {
	PantallaHome(0,3);
	// Cambiar de pantalla aumentando nivel
	if (edoBoton)
	{
		nivel++;
		edoBoton = false;
	}
}

void MenuPrincipal(){
	// if (contadorEncoder > 3) contadorEncoder = 1;
	// if (contadorEncoder < 1) contadorEncoder = 3;
	limitar(&contadorEncoder, 1, 3);

	PantallaMenu(0, contadorEncoder);

    if (edoBoton)
    {
		switch (contadorEncoder)
		{
		case (1):
			Calibrar();
			break;
		
		case (2):
			Lecturas();
			break;

		case (3):
			nivel = 0;
			break;
		}
    }
}

void limitar(unsigned int *variable,int min,int max){
	if (*variable > max) *variable = min;
	if (*variable < min) *variable = max;
}

void PantallaHome(int col, int row){
	Pintar(
		"-----Bienvenido-----",
		"Fecha: 0/00/0",
		"Hora: 00:00",
		"  Menu",
		col, row, false
	);
}
void PantallaMenu(int col, int row){
	Pintar(
		"Menu",
		" Calibrar",
		" Lecturas",
		" Regresar",
		col, row, true
	);
}
void PantallaLecturas(int col, int row){
	char menu[7][20] = {
		"Lecturas",
		"Sensor 1: ",
		"Sensor 2: ",
		"Sensor 3: ",
		"Sensor 4: ",
		"Sensor 5: ",
		"<- Regresar",
	};

	Pintar(
		"Lecturas",
		"Sensor 1: ",
		"Sensor 2: ",
		"Sensor 3: ",
		0,0,false
	);
}
void PantallaCalibrar(int col, int row){
	char menu[7][20] = {
		"Calibrar",
		" Ajustar Fecha",
		" Regresar",
		"                   ",
		0,0,false
	};
}

void Lecturas(){
	PantallaLecturas(0,0);
}

void Calibrar(){
	PantallaCalibrar(0,0);
}

