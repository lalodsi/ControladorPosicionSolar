// #include <stdio.h>
// #include <stdlib.h>
// #include <math.h>

/**
 * @brief Valor tabulado de la distribución F del área 0.05 a la derecha
 * Si cambia el tamaño de los arreglos de entrada, modificar este valor: http://uaaan.mx/~jmelbos/tablas/distf.pdf
 */
#define F_CRITICA 2.866081402
#define ARRAY_SIZE 5

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
double* Promedios(double data[5][5], int i, int j){
    double *resultado;
    resultado = (double *) malloc( i * sizeof(double) );
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
double* Varianzas(double datos[5][5], int size){
    double *conjuntoVarianzas;
    // Reservando memoria
    conjuntoVarianzas = (double *) malloc( size * sizeof(double) );
    for (int i = 0; i < size; i++)
        conjuntoVarianzas[i] = Varianza(datos[i], size);
    // free(conjuntoVarianzas);
    return conjuntoVarianzas;
}

/**
 * @brief Calcula el valor de la varianza debida al error puramente aleatorio, (S2PE)
 *  de un arreglo bidimensional de datos. También es conocida como varianza dentro de las
 *  muestras.
 * Es importante saber que se tomarán las filas de datos y no las columnas, si se desea conocer las columnas, enviar la matriz traspuesta a esta función para que trabaje correctamente
 * 
 * @param datos matriz de datos a la que se le desea obtener el valor de  S2PE
 * @param size tamaño de la matriz N x N
 * @return double resultado
 */
double S2PE(double datos[5][5], int size){
    double *varianzas;
    // varianzas = (double *) malloc( size * sizeof(double) );
    varianzas = Varianzas(datos, size);
    double promedioVarianzas = Promedio(varianzas, size);
    free(varianzas);
    return promedioVarianzas;
}

/**
 * @brief Calcula el valor de la varianza debida al factor (S2Factor) de un arreglo
 *  bidimensional de datos, también es conocida como varianza entre muestras.
 * 
 * @param datos arreglo bidimensional dinámico
 * @param size tamaño del arreglo N x N
 * @return double resultado
 */
double S2Factor(double datos[5][5], int size){
    // Calcular promedios
    double *promedios = Promedios(datos, size, size);
    // promedios = (double *) malloc( size * sizeof(double) );
    promedios = Promedios(datos, size, size);
    double promedioTotal = Promedio(promedios, size);
    // Diferencia al cuadrado
    double diff_to_square = 0;
    for (int i = 0; i < size; i++)
        diff_to_square += pow(promedios[i] - promedioTotal, 2);
    double gdl = (double)size - 1;
    free(promedios);
    return diff_to_square * size / gdl;
}

/**
 * @brief Calcula el valor F de un arreglo de datos bidimensional
 * 
 * @param datos arreglo bidimensional
 * @param size tamaño del arreglo
 * @return double resultado de la operación
 */
double F_Value(double datos[5][5], int size){
    double s2pe_value = S2PE(datos, size);
    double s2factor_value = S2Factor(datos, size);
    return s2factor_value / s2pe_value;
}

double anovaTest2(double data[5][5]){
    // double *varianzas = Varianzas(data, 5);
    // double S2PE_value = Promedio(varianzas, 5);

    // double promedios = Promedios(data);
    // double promedioGeneral = Promedio(promedios);
    // double diff_to_square = 0;
    // for (int i = 0; i < 5; i++)
    //     diff_to_square += pow(promedios[i] - promedioGeneral, 2);
    // double gdl = (double)5 - 1;
    // double s2factor_value = diff_to_square * size / gdl;
    // return s2factor_value / S2PE_value;
    return 0;
}

/**
 * @brief Realiza el análisis de varianzas y determina si existe al menos una media diferente a las demás.
 * @test Revisar que su funcionamiento sea el adecuado, probar con datos reales de los sensores.
 * @attention El resultado de salida no es el definitivo. El test ANOVA determina **si EXISTE una media
 * diferente a las demás** , sin embargo, dentro de esta función no está implementado un método para
 * conocer cual media es la diferente.
 * 
 * @param datos arreglo bidimensional
 * @param size tamaño del arreglo
 * @return bool devuelve un true si la media es diferente o false si no lo es.
 * 
*/
bool ANOVA_test(double datos[5][5], int size){
    double f_test = F_Value(datos, size);
    return (f_test > F_CRITICA);
}

/**
 * @brief Realiza el test de la genuina diferencia de Tukey
 * 
 */
void TukeyTest() {
    // Todo
}

// void QValue(double *first, double *second, size) {
//     double Xp = Promedio(first, size);
//     double Xq = Promedio(second, size);
// }