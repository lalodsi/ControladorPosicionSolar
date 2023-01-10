/**
 * @brief clase que se encarga de realizar una lectura analógica
 * 
 */
class sensor // : public external
{
private:
  int pins = 0;
    // double value = 0;

public:
    sensor(int pin){
        pins = pin;
    }

    double getData(){
        return analogRead(this->pins);
    };

};
