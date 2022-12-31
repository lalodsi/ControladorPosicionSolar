#include <stdio.h>

/**
 * @brief Imprime una matriz
 * 
 * @param data Matriz
 * @param size Tamaño de la matriz
 */
void printMatrix(double **data,int size){
    // Imprimiendo valores
    for (int i = 0; i < size; i++){
        for (int j = 0; j < size; j++)
            printf("%0.1f \t", data[i][j]);
        printf("\n");
    }
}

/**
 * @brief Imprime un arreglo
 * 
 * @param data arreglo
 * @param size tamaño del arreglo
 */
void printArray(double *data,int size){
    // Imprimiendo valores
    for (int i = 0; i < size; i++){
        printf("%0.1f \t", data[i]);
    }
    printf("\n");
}

/**
 * @brief Convierte una matriz de N x N dada a su respectiva transpuesta
 * 
 * @param data matriz original
 * @param N dimenciones de la matriz N x N
 * @return int** resultado de trasponer la matriz original
 */
void traspuesta(double **data,int N){
    double aux = 0;

    for (int i = 0; i < N; i++){
        for (int j = 0; j < N; j++){
            if (j > i)
            {
                aux = data[i][j];
                data[i][j] = data[j][i];
                data[j][i] = aux;
            }
        }
    }
}