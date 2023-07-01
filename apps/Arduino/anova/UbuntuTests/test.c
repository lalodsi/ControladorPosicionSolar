#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <stdbool.h>
#include "../anova.h"
#include "../testAnova.h"

#ifndef ARRAY_SIZE
    ARRAY_SIZE 5
#endif



int main(int argc, char const *argv[])
{
    // Inicialización de datos
    double datos[ARRAY_SIZE][ARRAY_SIZE] = {
        {7, 7, 15, 11, 9},
        {12, 17, 12, 18, 18},
        {14, 18, 18, 19, 19},
        {19, 25, 22, 19, 23},
        {7, 10, 11, 15, 11}
    };

    // Asignación dinámica de memoria
    // double **datos;
    // datos = (double **) malloc( ARRAY_SIZE * sizeof(double) );
    // for (int i = 0; i < ARRAY_SIZE; i++) datos[i] = (double *) malloc(ARRAY_SIZE * sizeof(double));

    // for (int i = 0; i < ARRAY_SIZE; i++)
    // {
    //     for (int j = 0; j < ARRAY_SIZE; j++)
    //     {
    //         datos[i,j] = datosAColocar[i,j];
    //     }
    // }
    //traspuesta(datos, ARRAY_SIZE);

    printf("Arreglo original \n");
    // printMatrix(datos, ARRAY_SIZE);

    //traspuesta(datos, ARRAY_SIZE);


    printf("Reservando memoria y liberando \n");
    while (true)
    {
        double **memoria;
        memoria = (double **) malloc( 100 * sizeof(double) );
        free(memoria);
    }
        double *promedios;
        promedios = Promedios(datos, ARRAY_SIZE, ARRAY_SIZE);
        printf("Promedio de cada tabla \n");
        printArray(promedios, ARRAY_SIZE);

        // double *varianzas;
        double *varianzas;
        varianzas = Varianzas(datos, ARRAY_SIZE);
        printf("Varianza de cada tabla \n");
        printArray(varianzas, ARRAY_SIZE);

        double valorS2PE = S2PE(datos, ARRAY_SIZE);
        printf("Valor de S2PE: %0.01f \n", valorS2PE);

        double valorS2Factor = S2Factor(datos, ARRAY_SIZE);
        printf("Valor de S2 Factor: %0.01f \n", valorS2Factor);

        double valorF = F_Value(datos, ARRAY_SIZE);
        printf("Valor F: %0.01f \n", valorF);

        bool es_diferente = ANOVA_test(datos, ARRAY_SIZE);
        // free(promedios);
        // free(varianzas);
        if (es_diferente) printf("Hay al menos una media diferente");
        else printf("No hay medias diferentes, se rechaza el tests");
    

    return 0;
}
