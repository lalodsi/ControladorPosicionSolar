/**
      LIBRERIA MOTOR
  Esta librería maneja todas las variables, constantes, funciones y lógica relacionados con
  el control de los motores a pasos. Su objetivo es separar el código de los motores a pasos
  del código restante, de esta manera evitaremos modificar variables, comportamientos y valores
  de otras librerías.
  Esta librería realiza las operaciones necesarias tomando en cuenta los engranes del diseño
  original para ofrecer un movimiento exacto.

  Reglas:
  El uso de esta librería mantendrá totalmente ocupado el ciclo principal (loop) del arduino,
  por lo que es importante considerar que mientras un motor se esté moviendo, el arduino estará 
  ocupado y no podrá realizar alguna otra función.
  - NO UTILIZAR LA FUNCION DELAY CON RETARDOS MAYORES A .1 SEGUNDOS O DENTRO DE CICLOS WHILE
  - UTILIZAR SÓLO LAS SALIDAS DIGITALES QUE TENGAN QUE VER CON LOS MOTORES A PASOS


*/

/**
 * Relación de la caja de engranes del motor de elevacion
 * Valor: 1/30
*/
#define RELATION_GEAR_BOX 0.03333

/**
 * Relación del engrane para el movimiento de elevación
 * Valor: 1/20
*/
#define RELATION_ELEVATION_GEARS 0.05

/**
 * Relación del engrane para el movimiento de elevación
 * Valor: 1/19 * 15/39
*/
#define RELATION_AZIMUTH_CHAIN 0.020243

// Cantidad de ms que se espera antes de dar otro paso en el motor
#define ELEVATION_MOTOR_DELAY 1300

// Cantidad de ms que se espera antes de dar otro paso en el motor
#define AZIMUTH_MOTOR_DELAY 1300

/**
 * Obtiene los pasos necesarios para moverse a un determinado ángulo
*/
long int getStepsTo(float grades, float gearRelation){//, float gradoElev){
  long int steps = ceil((grades) / (1.8 * gearRelation));
  return steps;
}

/**
 * Obtiene los pasos necesarios para moverse a un determinado ángulo tomando como base
 * una posición inicial
*/
long int getStepsFromTo(float current, float next, float gearRelation){
  long int nextPosition = getStepsTo(next, gearRelation) - getStepsTo(current, gearRelation);
  if (nextPosition < 0)
  {
    return -nextPosition;
  }
  return nextPosition;
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
void setElevationAngle(float angle, int dirPin, int stepsPin, double* currentAngle) {
  double diff = angle - *currentAngle;
  long int stepsNeeded = getStepsFromTo(*currentAngle, angle, RELATION_GEAR_BOX * RELATION_ELEVATION_GEARS);
  setMotorDirection(-diff, dirPin);
  setMotorSteps(stepsNeeded, stepsPin, ELEVATION_MOTOR_DELAY);
  *currentAngle = angle;
};

/**
 * Establece el ángulo en el que se moverá el motor a pasos de rotación
*/
void setAzimutAngle(float angle, int dirPin, int stepsPin, double* currentAngle) {
  double diff = angle - *currentAngle;
  long int stepsNeeded = getStepsFromTo(*currentAngle, angle, RELATION_AZIMUTH_CHAIN);
  setMotorDirection(diff, dirPin);
  setMotorSteps(stepsNeeded, stepsPin, AZIMUTH_MOTOR_DELAY);
  *currentAngle = angle;
};

