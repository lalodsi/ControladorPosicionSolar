// SIN UTILIZAR
#include "external.hpp"

class PC: public external
{
private:
    void receive(string data){
        //
    }

public:
    void init(int baudRate = 115200){
        Serial.begin(baudRate);
        pins = 0;
    }

    /**
     * Envia información a la computadora
     */
    void send(){
        // 
    }
};