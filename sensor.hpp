#include "external.hpp"
/**
 * @brief sensor externo
 * 
 */
class sensor: public external
{
private:
    double value = 0;

public:
    sensor(int pin){
        pins = pin;
    }

    double getData(){
        return analogRead(this->pins);
    };

};
