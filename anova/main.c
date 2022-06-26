#include "anova.h"
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char const *argv[])
{
    int **datos;
    int N = 5;

    // Reservando espacio dinámico
    datos = malloc( N * sizeof(int *) );
    for (int i = 0; i < N; i++)
        datos[i] = malloc( N * sizeof(int) );
    // Asignando valores
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            *(datos[j] + i) = i;
    
    // Imprimiendo valores
    for (int i = 0; i < N; i++){
        for (int j = 0; j < N; j++)
            printf("%d ", datos[i][j]);
        printf("\n");
    }

    printf("Calculando promedios de promedios: \n");

    int *resultado = PromedioConjuntos(datos, N, N);

    for (int i = 0; i < N; i++)
        printf("%d ", resultado[i]);
    

    // int *promediar;
    // int N = 6;

    // promediar = malloc( N * sizeof(int) );
    // // Asignando Valores
    // for (int i = 0; i < N; i++)
    //     promediar[i] = i;
    
    // printf("Contenido del array:\n");
    // for (int i = 0; i < N; i++)
    // printf("%d, ", promediar[i]);
    // printf("\n");
    
    return 0;
}
