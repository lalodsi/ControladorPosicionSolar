#include "spa.c"
  
int resultado;

void setup() {
  
  spa_data spa;

  
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

  Serial.begin(9600);

  resultado = spa_calculate(&spa);
  if(resultado == 0){
//        Serial.println("Epsilon:       %f degrees\n",spa.epsilon);
          Serial.print("Hola");
//        Serial.print("Zenith:        %d degrees\n",spa.zenith);
//        Serial.println("Azimuth:       %.6f degrees\n",spa.azimuth);
//        Serial.println("Incidence:     %.6f degrees\n",spa.incidence);
  }
}

void loop() {
  // put your main code here, to run repeatedly:
//  resultado = spa_calculate(&spa);
  delay(1000);
}
