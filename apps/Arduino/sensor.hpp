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

    static double getDemuxData(pin){
        switch (pin)
        {
        case PIN_DEMUX_VOLTAJE_PANEL:
            digitalWrite(PIN_DEMUX_SELECT_0, LOW);
            digitalWrite(PIN_DEMUX_SELECT_1, LOW);
            delay(0);
            return analogRead(PIN_DEMUX_ANALOG);
            break;

        case PIN_DEMUX_VOLTAJE_CIRCUITO:
            digitalWrite(PIN_DEMUX_SELECT_0, HIGH);
            digitalWrite(PIN_DEMUX_SELECT_1, LOW);
            delay(0);
            return analogRead(PIN_DEMUX_ANALOG);
            break;

        case PIN_DEMUX_CORRIENTE_PANEL:
            digitalWrite(PIN_DEMUX_SELECT_0, LOW);
            digitalWrite(PIN_DEMUX_SELECT_1, HIGH);
            delay(0);
            return analogRead(PIN_DEMUX_ANALOG);
            break;

        case PIN_DEMUX_CORRIENTE_CIRCUITO:
            digitalWrite(PIN_DEMUX_SELECT_0, HIGH);
            digitalWrite(PIN_DEMUX_SELECT_1, HIGH);
            delay(0);
            return analogRead(PIN_DEMUX_ANALOG);
            break;

        default:
            break;
        }
    }

};
