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
	}
	
	DISPLAY_PAINTED = true;
}
void PintarYBarrer(){
	// TODO: Crear una funcion que recorrar 4 strings consecutivos de un array de string
	//  	o matriz de caracteres desde el valor i hasta i + 4, los valores de i se modificarán
	//		con el movimiento de un encoder mecánico
}

/**
 * @brief Dibujo de las pantallas a mostrar en las interfaces
 */

/**
 * @brief Dibujo de la pantalla home
 * 
 * @param col columna en la cual estará posicionado el cursor
 * @param row fila en la cual estará posicionado el cursor
 */
void PantallaHome(int col, int row){
	Pintar(
		"-----Bienvenido-----",
		"Fecha: 0/00/0",
		"Hora: 00:00",
		"  Menu",
		col, row
	);
}

/**
 * @brief Dibujo de la pantalla menu principal
 * 
 * @param col columna en la cual estará posicionado el cursor
 * @param row fila en la cual estará posicionado el cursor
 */
void PantallaMenu(int col, int row){
	Pintar(
		"Menu",
		" Calibrar",
		" Lecturas",
		" Regresar",
		col, row
	);
}

/**
 * @brief Dibujo de la pantalla lecturas
 * 
 * @param col columna en la cual estará posicionado el cursor
 * @param row fila en la cual estará posicionado el cursor
 */
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

/**
 * @brief Dibujo de la pantalla de calibración
 * 
 * @param col columna en la cual estará posicionado el cursor
 * @param row fila en la cual estará posicionado el cursor
 */
void PantallaCalibrar(int col, int row){
	char menu[7][20] = {
		"Calibrar",
		" Ajustar Fecha",
		" Regresar",
		"                   ",
		0,0
	};

	Pintar(
		"-----Calibrar-----",
		"00:00",
		"00:00",
		"000000",
		col, row
	);
}

/**
 * Interfaces y navegación entre ellas
 * Al correr una interfaz, se tendrá opciones de navegación
 * Estas interfaces tendrán los siguientes parámetros en común:
 * @param boton será un apuntador que indica a la interfaz cuando el boton del encoder
 * 		mecánico ha sido presionado, si su valor es true se modificará el valor "nivel"
 * 		lo cual hará un cambio de pantalla
 * @param nivel apuntador a la variable que indica la pantalla a ejecutar en cada iteración
 * 		dentro del loop
 */

/**
 * @brief interfaz home, donde se muestra la pantalla home y se controla la navegación del
 * 		usuario modificando las variables en las direcciones boton y nivel.
 * 		El usuario sólo se moverá hacia el menú principal al presionar el encoder
 * 
 * @param boton apuntador al switch del encoder mecánico
 * @param nivel apuntador a la variable nivel, indica la pantalla a ejecutar 
 */
void interfazMenuHome(bool *boton,int *nivel) {
	// Mostrar la pantalla
	PantallaHome(0,3);

	if (*boton)
	{
		*nivel = 1; // Cambiar a la interfaz "Menu Principal"
		*boton = false; // Reiniciar el boton
	}
}

/**
 * @brief interfaz menu principal, donde se muestra la pantalla menu principal 
 * 		y se controla la navegación del usuario modificando las variables en las 
 * 		direcciones boton y nivel.
 * 		El usuario podrá navegar entre el menú y seleccionar las opciones para cambio
 * 		de interfaz
 * 
 * @param boton apuntador al switch del encoder mecánico
 * @param nivel apuntador a la variable nivel, indica la pantalla a ejecutar 
 * @param contadorEncoder registra el movimiento del encoder y lo traduce a posiciones de
 * 		navegación dentro del menú principal
 */
void interfazMenuPrincipal(bool *boton, int *nivel, unsigned int *contadorEncoder){
	// Limitar al valor del encoder a ciertos valores
	limitar(contadorEncoder, 1, 3);

	// Muestra el menú modificando la posición del cursor
	PantallaMenu(0, *contadorEncoder);

    if (*boton)
    {
		switch (*contadorEncoder)
		{
		case (1):
			*nivel = 2; // Ir a la interfaz "calibrar"
			break;
		case (2):
			*nivel = 3; // Ir a la interfaz "lecturas"
			break;
		case (3):
			*nivel = 0; // Regresar a la interfaz "Home"
			break;
		}
		*boton = false;
		*contadorEncoder = 1;
    }
}

/**
 * @brief Interfaz calibrar donde se podrá cambiar los valores internos del sistema
 * 
 * @param boton apuntador al switch del encoder mecánico
 * @param nivel apuntador a la variable nivel, indica la pantalla a ejecutar 
 */
void interfazCalibrar(bool *boton, int *nivel){
	PantallaCalibrar(0,0);

	if (*boton)
	{
		*nivel = 1; // Cambiar a la interfaz "Menu Principal"
		*boton = false; // Reiniciar el boton
	}
}

/**
 * @brief Interfaz lecturas donde se muestra el valor de los sensores del sistema
 * 
 * @param boton apuntador al switch del encoder mecánico
 * @param nivel apuntador a la variable nivel, indica la pantalla a ejecutar 
 */
void interfazLecturas(bool *boton, int *nivel){
	PantallaLecturas(0,0);

	if (*boton)
	{
		*nivel = 1; // Cambiar a la interfaz "Menu Principal"
		*boton = false; // Reiniciar el boton
	}
}