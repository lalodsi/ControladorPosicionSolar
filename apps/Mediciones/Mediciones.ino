//#include <Wire.h>
//#include <RTClib.h>
//RTC_DS3231 rtc;

float Sensibilidad=0.185; //sensibilidad en Voltios/Amperio para sensor de 5A
int c = 0;
float R = 7.7;
void setup() {
  Serial.begin(9600);
//  if (! rtc.begin()){
//    Serial.println("Modulo RTC no econtrado");
//    while(1);
//  }
//  rtc.adjust(DateTime(__DATE__, __TIME__));
}

void loop() {
  c = c + 1;
  float I=get_corriente(200);//obtenemos la corriente promedio de 200 muestras 
  float p = I*I*R;
  Serial.print(I,3); 
  Serial.print(",");
  Serial.print(p,3);
  Serial.print(",");
  Serial.println(c);
  //Serial.print(rtc.now().hour());
  //Serial.print(":");
  //Serial.print(rtc.now().minute());
  //Serial.print(":");
  //Serial.println(rtc.now().second());
  delay(5000);     
}

float get_corriente(int n_muestras)
{
  float voltajeSensor;
  float corriente=0;
  for(int i=0;i<n_muestras;i++)
  {
    voltajeSensor = analogRead(A0) * (5.0 / 1023.0);////lectura del sensor
    corriente=corriente+(voltajeSensor-2.5)/Sensibilidad; //Ecuación  para obtener la corriente
  }
  corriente=corriente/n_muestras;
  return(corriente);
}