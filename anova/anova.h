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
double Promedio(double *data, int size){
    double suma = 0;
    for (int i = 0; i < size; i++)
        suma += data[i];
    return suma / size;
}

/**
 * @brief Calcula un arreglo que contiene los promedios de cada fila de una matriz dada
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
double* Promedios(double **data, int i, int j){
    double *resultado;
    resultado = malloc( i * sizeof(int) );
    for (int index = 0; index < i; index++)
        resultado[index] = Promedio(data[index], j);
    return resultado;
}

/**
 * @brief Calcula la varianza de un arreglo de datos dado.
 * Recibe como parámetro el apuntador al arreglo de datos, el tamaño del arreglo y el promedio 
 * de este mismo arreglo
 * 
 * @param datos array del cual se obtendrá el valor de la varianza
 * @param size Tamaño del array
 * @return double 
 */
double Varianza(double *datos, int size){
    const int GRADOS_DE_LIBERTAD = size - 1;
    double promedio = Promedio(datos, size);
    double sumaAlCuadrado = 0;
    // Calcular las sumas al cuadrado
    for (int i = 0; i < size; i++)
        sumaAlCuadrado += pow(datos[i] - promedio, 2);
    
    double varianza = sumaAlCuadrado / GRADOS_DE_LIBERTAD;
    return varianza;
}

/**
 * @brief Obtiene el conjunto de varianzas para las filas de un arreglo bidimensional
 * 
 * @param datos matriz bidimencional que se estará evaluando
 * @param size Tamaño de la matriz N x N (Debe ser cuadrada para que la función sea correcta)
 * @return double* 
 * Ejemplo, se tiene la siguiente matriz de 5 X 5:
 * int **datos = {  7	12	14	19	 7
 *                  7	17	18	25	10
 *                 15	12	18	22	11
 *                 11	18	19	19	15
 *                  9	18	19	23	11 }
 * Al aplicar la función en la matriz traspuesta de **datos, la función dará el 
 * resultado siguiente:
 * int *resultado = { 11.2	9.8	4.3	6.8	8.2 }
 * Lo cual es el equivalente a obtener la varianza de cada matriz
 */
double* Varianzas(double **datos, int size){
    double *conjuntoVarianzas;
    // Reservando memoria
    conjuntoVarianzas = malloc( size * sizeof(double) );
    for (int i = 0; i < size; i++)
        conjuntoVarianzas[i] = Varianza(datos[i], size);
    return conjuntoVarianzas;
}

/**
 * @brief Calcula el valor de S2PE de un arreglo bidimensional de datos. 
 * > Es importante saber que se tomarán las filas de datos y no las columnas, si se desea conocer las columnas, enviar la matriz traspuesta a esta función para que trabaje correctamente
 * 
 * @param datos matriz de datos a la que se le desea obtener el valor de  S2PE
 * @param size tamaño de la matriz N x N
 * @return double resultado
 */
double S2PE(double **datos, int size){
    double *varianzas = Varianzas(datos, size);
    return Promedio(varianzas, size);
}

/**
 * @brief Calcula el valor del S2Factor de un arreglo bidimensional de datos
 * 
 * @param datos arreglo bidimensional dinámico
 * @param size tamaño del arreglo N x N
 * @return double resultado
 */
double S2Factor(double **datos, int size){
    // Calcular promedios
    double *promedios = Promedios(datos, size, size);
    double promedioTotal = Promedio(promedios, size);
    // Diferencia al cuadrado
    double diff_to_square = 0;
    for (int i = 0; i < size; i++)
        diff_to_square += pow(promedios[i] - promedioTotal, 2);
    double gdl = (double)size - 1;
    return diff_to_square * size / gdl;
}

/**
 * @brief Calcula el valor F de un arreglo de datos bidimensional
 * 
 * @param datos arreglo bidimensional
 * @param size tamaño del arreglo
 * @return double resultado de la operación
 */
double F_Value(double **datos, int size){
    double s2pe_value = S2PE(datos, size);
    double s2factor_value = S2Factor(datos, size);
    return s2factor_value / s2pe_value;
}