#include "spa.c"
#include "SPATime.h"
  
int resultado;


// Inicializar algoritmo
spa_data spa;

void setup() {
  // Puerto serie
  Serial.begin(9600);
  
  spa.year          = 2022;
  spa.month         = 3;
  spa.day           = 13;
  spa.hour          = 13;
  spa.minute        = 00;
  spa.second        = 00;
  
  spa.timezone      = -5.0;
  spa.delta_ut1     = 0;
  spa.delta_t       = 67;
  spa.longitude     = -99.21278;
  spa.latitude      = 19.37861;
  spa.elevation     = 2330.0;
  spa.pressure      = 580;
  spa.temperature   = 11;
  spa.slope         = 0;
  spa.azm_rotation  = 208;
  spa.atmos_refract = 0.5667;
  spa.function      = SPA_ALL;

  resultado = spa_calculate(&spa);

  if(resultado == 0){
  }
}

void loop() {

  updateSolarTrackerTime(&spa);
  resultado = spa_calculate(&spa);

  delay(1000);
}

