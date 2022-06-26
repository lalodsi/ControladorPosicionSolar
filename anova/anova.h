#include <stdio.h>
#include <stdlib.h>
#include <math.h>

/**
 * @brief Calcula el promedio de un arreglo de números
 * 
 * @param data arreglo de números
 * @param size tamaño del arreglo
 * @return double: promedio de los elementos contenidos en el arreglo
 */
double Promedio(int *data, int size){
    double suma = 0;
    for (int i = 0; i < size; i++)
        suma += data[i];
    return suma / size;
}

/**
 * @brief Calcula un arreglo que contiene los promedios de cada columna de una matriz dada
 * 
 * @param data matriz de valores a calcular
 * @param i Columnas
 * @param j Filas
 * @return int* apuntador a la matriz devuelta
 * Ejemplo, se tiene la siguiente matriz de 5 X 5:
 * int **datos = { 0 1 2 3 4
 *                 0 1 2 3 4
 *                 0 1 2 3 4
 *                 0 1 2 3 4
 *                 0 1 2 3 4 }
 * La función dará el resultado siguiente:
 * int *resultado = { 2 2 2 2 2 }
 */
int* PromedioConjuntos(int **data, int i, int j){
    int *promedios;
    promedios = malloc( i * sizeof(int) );
    for (int index = 0; index < i; index++)
        promedios[index] = Promedio(data[index], j);
    return promedios;
}

// Documentar
void Varianza(int *datos, int size, double X_prom){
    double sumaAlCuadrado = 0;
    for (int i = 0; i < size; i++)
        sumaAlCuadrado = pow(datos[i] - X_prom, 2);
    double 
    
}

void aritmetica(){
    int arreglo[] = { 1, 2, 3, 4, 5 };

    size_t n = (&arreglo)[1] - arreglo;

    printf("%d\n", (&arreglo)[1]);
    printf("%d\n", (&arreglo));
    printf("%d\n", (arreglo));
    printf("%d\n", (&arreglo)[1] - arreglo);
    printf("%d", n);
}