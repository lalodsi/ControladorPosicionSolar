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

long int setAngle(float gradeElevation, float gearRelation){//, float gradoElev){
  return ceil((gradeElevation) / (1.8 * gearRelation));
}

void moveMotor(int pin, unsigned int delay, long int steps){
  for(int i = 0; i < steps; i++){
    digitalWrite(pin, HIGH);
    delayMicroseconds(delay);
    digitalWrite(pin, LOW);
    delayMicroseconds(delay);
  }
}


// long int transvaloresenteros(float pasos1){
//   pasos_enteros = ceil(pasos1);
// }

