/**
      LIBRERIA MOTOR
  Esta librería maneja todas las variables, constantes, funciones y lógica relacionados con
  el control de los motores a pasos. Su objetivo es separar el código de los motores a pasos
  del código restante, de esta manera evitaremos modificar variables, comportamientos y valores
  de otras librerías

  Reglas:
  El uso de esta librería será dentro de la función `Loop()` de arduino, de modo que la lógica
  realizada aquí deberá de ejecutarse en cada iteración del ciclo principal
  - NO UTILIZAR LA FUNCION DELAY CON RETARDOS MAYORES A .1 SEGUNDOS O DENTRO DE CICLOS WHILE
  - PREFERENTEMENTE EVITAR UTILIZAR CICLOS WHILE
  - UTILIZAR SÓLO LAS SALIDAS DIGITALES QUE TENGAN QUE VER CON LOS MOTORES A PASOS
  - NO ENVIAR MENSAJES POR EL PUERTO SERIAL


*/

// Variables para el movimiento del motor a pasos
  int marchaRotacion = 0;
  int marchaElevacion = 0;
  int ciclosRotacion = 0;
  int ciclosElevacion = 0;
  int pasosRotacion = 0;
  int pasosElevacion = 0;

void Mover(int *marcha, int *ciclos, int *pasos, int direccion){
  *marcha = *marcha + 1;
  *ciclos = *marcha / 4;
  *pasos = (*marcha - (*ciclos * 4)) + 1;

  if (direccion < 0)
  {
    *pasos = 5 - *pasos;
  }
}
void moverMotor(int pasos, int input1, int input2, int input3, int input4){
  switch (pasos)
  {
  case 1:
    digitalWrite(input1, HIGH);
    digitalWrite(input2, LOW);
    digitalWrite(input3, HIGH);
    digitalWrite(input4, LOW);
    break;
  
  case 2:
    digitalWrite(input1, LOW);
    digitalWrite(input2, HIGH);
    digitalWrite(input3, HIGH);
    digitalWrite(input4, LOW);
    break;
  
  case 3:
    digitalWrite(input1, LOW);
    digitalWrite(input2, HIGH);
    digitalWrite(input3, LOW);
    digitalWrite(input4, HIGH);
    break;
  
  case 4:
    digitalWrite(input1, HIGH);
    digitalWrite(input2, LOW);
    digitalWrite(input3, LOW);
    digitalWrite(input4, HIGH);
    break;
  
  default:
    digitalWrite(input1, LOW);
    digitalWrite(input2, LOW);
    digitalWrite(input3, LOW);
    digitalWrite(input4, LOW);
    break;
  }
}
/**
 * @brief Se moverá el motor para la elevación del sistema
 * 
 * @param direccion numero entero que representa la dirección a donde el motor estará moviendose
 */
void moverY(int direccion){

  Mover(&marchaElevacion, &ciclosElevacion, &pasosElevacion, direccion);
  
  moverMotor(pasosElevacion, 2, 3, 4, 5);
  
}
/**
 * @brief Se moverá el motor para la rotación del sistema
 * 
 */
void moverX(int direccion){
  
  Mover(&marchaRotacion, &ciclosRotacion, &pasosRotacion, direccion);
  
  // moverMotor(pasosRotacion, 5, 6, 7, 8);
}
