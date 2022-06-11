#include <LiquidCrystal.h>

class Pantalla{
	private:
		int rs = 12, en = 11, d4 = -5, d5 = 4, d6 = 3, d7 = 2;
		LiquidCrystal displayLCD;
	public:
		Pantalla(){
            rs = 12, en = 11, d4 = -5, d5 = 4, d6 = 3, d7 = 2;
            displayLCD = new LiquidCrystal(rs, en, d4, d5, d6, d7);
			displayLCD.begin(20,4);
		}

		// PantallaPrincipal(){
		// }
		
		void PintarDisplay(){
			displayLCD.setCursor(0,0);
			displayLCD.print("-----Bienvenido-----");
			displayLCD.setCursor(0,1);
			displayLCD.print("Fecha: 0/00/0");
			displayLCD.setCursor(0,2);
			displayLCD.print("Hora: 00:00");
			displayLCD.setCursor(0,3);
			displayLCD.print("> Menu");
		}
}