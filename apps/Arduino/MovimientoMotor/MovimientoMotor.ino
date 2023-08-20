//#include Position.hpp;
#define DEBUG(a) Serial.println(a);
//------------Movimiento motor----------
const int steppin = 3;
const int dirpin = 2;
// const unsigned int dlay = 1300; //1250
const unsigned int dlay = 1300; //1250

//-------------Pasos a dar--------------
float pasos = 0.0;
long int pasos_enteros = 0;

//-----------Relacion--------------
const float relacionCajaengranes = 0.06666666; //------->1/15
const float relacionEngranesElevacion = 0.05; //-------> 1/20
const float relacionEngranesAzimut = 0.3; //------->12/40
float transvalores(float gradoElevacion);
long int transvaloresenteros(float gradosElevacion);

void setup() {
  pinMode(steppin, OUTPUT);
  pinMode(dirpin, OUTPUT);
  //temporal solo para pruebas
  Serial.begin(9600);
  Serial.setTimeout(50);
}

void loop() {
  if (Serial.available() > 0) {
    float gradosElevacion = Serial.parseFloat(SKIP_ALL, '\n');
    //DEBUG(gradosElevacion);
    transvalores(gradosElevacion);
    transvaloresenteros(pasos);
    Serial.print("Los pasos que debe de dar para ");
    Serial.print(gradosElevacion);
    Serial.print(" son: ");
    Serial.println(pasos);
    Serial.print("Los pasos enteros que debe de dar para ");
    Serial.print(gradosElevacion);
    Serial.print(" son: ");
    Serial.println(pasos_enteros);
    Serial.println("Acabo la conversión");
    // if (pasos_enteros < 0){
    //   pasos_enteros = (pasos_enteros * (- 1) + 1);
    //   digitalWrite(dirpin, LOW);
    //   Serial.println(pasos_enteros);
    // }
    // else{
    //   digitalWrite(dirpin, HIGH);
    // }
    
    // for(int x = 0; x < pasos_enteros; x++){
    //   digitalWrite(steppin, HIGH);
    //   delayMicroseconds(dlay);
    //   digitalWrite(steppin, LOW);
    //   delayMicroseconds(dlay);
    // }
  }  
    digitalWrite(steppin, HIGH);
    delayMicroseconds(dlay);
    digitalWrite(steppin, LOW);
    delayMicroseconds(dlay);
}

float transvalores(float gradoElevacion1){//, float gradoElev){
  pasos = (gradoElevacion1) / (1.8 * relacionCajaengranes * relacionEngranesElevacion);
  return pasos;
}

long int transvaloresenteros(float pasos1){
  pasos_enteros = ceil(pasos1);
}

