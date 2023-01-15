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

/**
 * Relación de la caja de engranes del motor de elevacion
 * Valor: 1/15
*/
#define RELATION_GEAR_BOX 0.06666666

/**
 * Relación del engrane para el movimiento de elevación
 * Valor: 1/20
*/
#define RELATION_ELEVATION_GEARS 0.05

/**
 * Relación del engrane para el movimiento de elevación
 * Valor: 1/19
*/
#define RELATION_AZIMUTH_GEARS 0.05263

// Cantidad de ms que se espera antes de dar otro paso en el motor
#define ELEVATION_MOTOR_DELAY 1300

// Cantidad de ms que se espera antes de dar otro paso en el motor
#define AZIMUTH_MOTOR_DELAY 50000

/**
 * Obtiene los pasos necesarios para moverse a un determinado ángulo
*/
long int getStepsTo(float grades, float gearRelation){//, float gradoElev){
  long int steps = ceil((grades) / (1.8 * gearRelation));
  if (steps < 0) steps *= (- 1) ;
  return steps;
}

/**
 * Realiza los pasos que necesita el motor con su respectiva velocidad (delay)
*/
void setMotorSteps(long int steps, int stepPin, unsigned int delay){
  for(int i = 0; i < steps; i++){
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(delay);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(delay);
  }
}

/**
 * Define la dirección en la cual se moverá el motor
*/
void setMotorDirection(float angle, int dirPin){
  if (angle < 0){
      digitalWrite(dirPin, LOW);
    }
    else{
      digitalWrite(dirPin, HIGH);
    }
}

/**
 * Establece el ángulo en el que se moverá el motor a pasos de elevación
*/
void setElevationAngle(float angle, int dirPin, int stepsPin) {
  long int stepsNeeded = getStepsTo(angle, RELATION_GEAR_BOX * RELATION_ELEVATION_GEARS);
  setMotorDirection(angle, dirPin);
  setMotorSteps(stepsNeeded, stepsPin, ELEVATION_MOTOR_DELAY);
};

/**
 * Establece el ángulo en el que se moverá el motor a pasos de rotación
*/
void setAzimutAngle(float angle, int dirPin, int stepsPin) {
  long int stepsNeeded = getStepsTo(angle, RELATION_AZIMUTH_GEARS);
  setMotorDirection(stepsNeeded, dirPin);
  setMotorSteps(stepsNeeded, stepsPin, AZIMUTH_MOTOR_DELAY);
};

