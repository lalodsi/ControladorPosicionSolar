#include <LiquidCrystal.h>

const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
const int encoder_dt = 6, encoder_clk = 7;

int numero = 0;

void setup(){
	pinMode(encoder_dt, INPUT);
	pinMode(encoder_clk, INPUT);

	lcd.begin(20,4);
	// PantallaPrincipal(0,3);
	 PantallaMenu(0,1);
	
}

void loop(){
	if ( digitalRead(encoder_dt) == LOW )
	{
		delay(5);
		if ( digitalRead(encoder_clk) == HIGH )
		{
			numero++;
		}
		else
		{
			numero--;
		}
	}
	delay(100);
	
	lcd.setCursor(9, 2);
	lcd.print(numero);

}

void Pintar(String line1, String line2, String line3, String line4,int col,int row){
	lcd.setCursor(0,0);
	lcd.print(line1);
	lcd.setCursor(0,1);
	lcd.print(line2);
	lcd.setCursor(0,2);
	lcd.print(line3);
	lcd.setCursor(0,3);
	lcd.print(line4);

	while (true)
	 {
	 	lcd.setCursor(col,row);
	 	lcd.print(">");
	 	delay(500);
	 	lcd.setCursor(col,row);
	 	lcd.print(" ");
	 	delay(500);
	 }
	
}
void PantallaPrincipal(int col, int row){
	Pintar(
		"-----Bienvenido-----",
		"Fecha: 0/00/0",
		"Hora: 00:00",
		"  Menu",
		col, row
	);
}
void PantallaMenu(int col, int row){
	Pintar(
		"Menu",
		" Calibrar",
		" Lecturas",
		" Regresar",
		col, row
	);
}

