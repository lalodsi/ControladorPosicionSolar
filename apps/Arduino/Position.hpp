/** SIN UTILIZAR
 * @brief Clase position, aún no está implementada en el proyecto, pero pretende ser de utilizad para
 * manejar las coordenadas de posición del proyecto.
 * # Posible uso
 *  Crear una instancia de la clase position de la siguiente manera
 *     position panel;
 */
class position
{
public:
    // Constructores
    /**
     * @brief Construct a new position object
     * 
     */
    position(){
        azimutAngle = 0;
        inclinationAngle = 0;
    }
    /**
     * @brief Construct a new position object
     * 
     * @param azimut 
     * @param inclination 
     */
    position(double azimut, double inclination){
        azimutAngle = azimut;
        inclinationAngle = inclination;
    }

    double azimutAngle;
    double inclinationAngle;

    void getAzimutDeg(){

    }
};
