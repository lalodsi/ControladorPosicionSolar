#include "anova.h"
// #include "testAnova.h"

// Entradas analogicas
    #define PIN_ANALOG_LIGHT_SENSOR_1   A0
    #define PIN_ANALOG_LIGHT_SENSOR_2   A1
    #define PIN_ANALOG_LIGHT_SENSOR_3   A2
    #define PIN_ANALOG_LIGHT_SENSOR_4   A3
    #define PIN_ANALOG_LIGHT_SENSOR_5   A6

// Tamaño de los arreglos a recibir
    #define ANOVA_DATA_SIZE         5
// Cantidad de sensores a medir
    #define SENSORS                 5
// Variable que contendrá los datos a guardar
    double **data;
    double datos[ANOVA_DATA_SIZE][ANOVA_DATA_SIZE] = {
        { 7,  12, 14, 19, 7},
        { 7,  17, 18, 25, 10},
        { 15, 12, 18, 22, 11},
        { 11, 18, 19, 19, 15},
        { 9,  18, 19, 23, 11},
    };




void setup()
{
    // Matriz dinámica para el manejo de informacion
    data = (double **) malloc( ANOVA_DATA_SIZE * sizeof(double));
    for (int i = 0; i < ANOVA_DATA_SIZE; i++)
    data[i] = (double *) malloc(ANOVA_DATA_SIZE * sizeof(double));

    Serial.begin(9600);
    Serial.println("Iniciando Software");

}

void loop(){
    const float umbral = 30; // Sirve de referencia para la comparación
    const int delay_time = 100;
    // Comienza proceso de recolección de datos
    // for (int i = 0; i < ANOVA_DATA_SIZE; i++)
    // {
    //     datos[i][0] = (double)analogRead(PIN_ANALOG_LIGHT_SENSOR_1);
    //     datos[i][1] = (double)analogRead(PIN_ANALOG_LIGHT_SENSOR_2);
    //     datos[i][2] = (double)analogRead(PIN_ANALOG_LIGHT_SENSOR_3);
    //     datos[i][3] = (double)analogRead(PIN_ANALOG_LIGHT_SENSOR_4);
    //     datos[i][4] = (double)analogRead(PIN_ANALOG_LIGHT_SENSOR_5);

    //     delay(delay_time); // Tiempo de espera antes de la siguiente etapa de medicion
    //     digitalWrite(LED_BUILTIN, HIGH);
    //     delay(delay_time);
    //     digitalWrite(LED_BUILTIN, LOW);
    // }
    delay(delay_time * 10);
    // Print Matrix
    Serial.print("Mediciones\n");
    for (int i = 0; i < ANOVA_DATA_SIZE; i++)
    {
        for (int j = 0; j < ANOVA_DATA_SIZE; j++)
        {
            Serial.print(datos[i][j]);
            Serial.print(" \t");
        }
        Serial.print(" \n");
    }
    Serial.print(" \n");

    // Transpuesta

    double aux = 0;

    for (int i = 0; i < ANOVA_DATA_SIZE; i++){
        for (int j = 0; j < ANOVA_DATA_SIZE; j++){
            if (j > i)
            {
                aux = datos[i][j];
                datos[i][j] = datos[j][i];
                datos[j][i] = aux;
            }
        }
    }
    
    // Promedios
    double *valor_promedios;
    valor_promedios = (double *) malloc( ANOVA_DATA_SIZE * sizeof(double) );
    valor_promedios = Promedios(datos, ANOVA_DATA_SIZE, ANOVA_DATA_SIZE);

    Serial.print("Promedios: \n");
    for (int i = 0; i < 5; i++)
    {
        Serial.print(valor_promedios[i]);
        Serial.print(" \t");
    }
    Serial.print(" \n");
    // double test = anovaTest2(datos);

    // Varianzas
    double *valor_varianzas;
    valor_varianzas = (double *) malloc( ANOVA_DATA_SIZE * sizeof(double) );
    valor_varianzas = Varianzas(datos, ANOVA_DATA_SIZE);

    Serial.print("Varianzas: \n");
    for (int i = 0; i < 5; i++)
    {
        Serial.print(valor_varianzas[i]);
        Serial.print(" \t");
    }
    Serial.print(" \n");

    // S2PE
    Serial.print("Valor de S2PE\n");
    double s2pe_value = S2PE(datos, ANOVA_DATA_SIZE);
    Serial.print(s2pe_value);
    Serial.print("\n");

    // S2PE
    Serial.print("Valor de S2 factor\n");
    double S2Factor_value = S2Factor(datos, ANOVA_DATA_SIZE);
    Serial.print(S2Factor_value);
    Serial.print("\n");

    // Valor F
    Serial.print("Valor F\n");
    double F_value = F_Value(datos, ANOVA_DATA_SIZE);
    Serial.print(F_value);
    Serial.print("\n");

    // Regresar transpuesta
    for (int i = 0; i < ANOVA_DATA_SIZE; i++){
        for (int j = 0; j < ANOVA_DATA_SIZE; j++){
            if (j > i)
            {
                aux = datos[i][j];
                datos[i][j] = datos[j][i];
                datos[j][i] = aux;
            }
        }
    }


    // printMatrix(datos, ANOVA_DATA_SIZE);
    Serial.print("\n\n");


    // Analisis ANOVA

    // bool result = ANOVA_test(data, ANOVA_DATA_SIZE);
    // Serial.print("Resultado: ");
    // Serial.println(result);
}

void printMatrix(double **data,int size){
    // Imprimiendo valores
    for (int i = 0; i < size; i++){
        for (int j = 0; j < size; j++){
            Serial.print(data[i][j]);
            Serial.print(" \t");
        }
        Serial.print("\n");
    }
}