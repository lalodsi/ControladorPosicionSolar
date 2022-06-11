#include <LiquidCrystal.h>
// #include <util/atomic.h>

#define ENCODER_DT 6
#define ENCODER_CLK 7

const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
// Variables para el encoder mecánico
int LastState, State;
//Variable global de posición compartida con la interrupción
volatile int theta = 0;


int numero = 0;

void setup(){
	pinMode(ENCODER_DT, INPUT);
	pinMode(ENCODER_CLK, INPUT);
	LastState = digitalRead(ENCODER_CLK);

	lcd.begin(20,4);
	// PantallaPrincipal(0,3);
	//  PantallaMenu(0,1);
	Pintar(
		"UPIITA",
		"UPIITA",
		"Numero: ______",
		"              ",
		0,0,false
	);

	attachInterrupt(digitalPinToInterrupt(ENCODER_DT),leerEncoder,RISING);
}

void loop(){
	delay(4);

	lcd.setCursor(9, 2);
	lcd.print("____");
	lcd.setCursor(9, 2);
	lcd.print(numero);
}

void Pintar(String line1, String line2, String line3, String line4,int col,int row, bool cursor){
	lcd.setCursor(0,0);
	lcd.print(line1);
	lcd.setCursor(0,1);
	lcd.print(line2);
	lcd.setCursor(0,2);
	lcd.print(line3);
	lcd.setCursor(0,3);
	lcd.print(line4);

	while (cursor)
	 {
	 	lcd.setCursor(col,row);
	 	lcd.print(">");
	 	delay(500);
	 	lcd.setCursor(col,row);
	 	lcd.print(" ");
	 	delay(500);
	 }
	
}
void PintarYBarrer(){
	// TODO: Crear una funcion que recorrar 4 strings consecutivos de un array de string
	//  	o matriz de caracteres desde el valor i hasta i + 4, los valores de i se modificarán
	//		con el movimiento de un encoder mecánico
}
void PantallaPrincipal(int col, int row){
	Pintar(
		"-----Bienvenido-----",
		"Fecha: 0/00/0",
		"Hora: 00:00",
		"  Menu",
		col, row, true
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

	// Pintar(
	// );
}
//Función para la lectura del encoder
void leerEncoder(){
	int b = digitalRead(ENCODER_CLK);
	if(b > 0){
		numero++;
	}
	else{
		numero--;
	}
}