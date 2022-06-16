#include <LiquidCrystal_I2C.h>

// Variables para el display
const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal_I2C lcd(0x27,20,4);  // set the LCD address to 0x27 for a 16 chars and 2 line display


// Bandera para pintar una sola vez 
bool DISPLAY_PAINTED = false;

void limitar(unsigned int *variable,int min,int max){
	if (*variable > max) *variable = min;
	if (*variable < min) *variable = max;
}
void Pintar(String line1, String line2, String line3, String line4,int col,int row){
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
void PantallaHome(int col, int row){
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
		0,0
	);
}
void PantallaCalibrar(int col, int row){
	char menu[7][20] = {
		"Calibrar",
		" Ajustar Fecha",
		" Regresar",
		"                   ",
		0,0
	};
}
void menuHome(bool *boton,int *nivel) {
	PantallaHome(0,3);
	// Cambiar de pantalla aumentando nivel
	if (*boton)
	{
		*nivel++;
		*boton = false;
	}
}
void Lecturas(){
	PantallaLecturas(0,0);
}
void Calibrar(){
	PantallaCalibrar(0,0);
}
void MenuPrincipal(int edoBoton,unsigned int contadorEncoder, int *nivel){
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
			*nivel = 0;
			break;
		}
    }
}