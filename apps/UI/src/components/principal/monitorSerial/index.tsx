import React, { ReactNode } from 'react'
import Text, { TextType } from '../../core/text';

type MonitorSerialProps = {
    open: boolean,
    handleClose: () => void
}

const MonitorSerial: React.FC<MonitorSerialProps> = (props) => {
    const {
        open = false,
        handleClose
    } = props;


    const [monitorSerialText, setMonitorSerialText] = React.useState("");
    const [serialContainer, setSerialContainer] = React.useState<string[]>([])

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setMonitorSerialText(event.target.value);
    }
    const handleSend = () => {
        setMonitorSerialText("");
        setSerialContainer([...serialContainer].concat("> " + monitorSerialText))
    }
    const monitorSerialHandleClick: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.code === "Enter" && monitorSerialText) {
            handleSend()
        }
    }


    React.useEffect(() => {
        if (open) {
            setRootClassName("monitorSerial")
        }
        else{
            setRootClassName("monitorSerial abajo")
        }
    }, [open])
    const [rootClassName, setRootClassName] = React.useState("");

    return (
        <div className={rootClassName}>
            <button onClick={handleClose} className="cerrarSerial"></button>
            <Text type={TextType.header} content='Monitor Serial' />
            <div className="contenedorSerial" id="contenedorSerial">
                {
                    serialContainer.map(El => <Text content={El} type={TextType.normal} />)
                }
            </div>
            <div className="sendMonitorSerial">
                <input
                    className="inputMonitorSerial"
                    id="monitorSerialEnviarTexto"
                    type="text"
                    value={monitorSerialText}
                    placeholder="Escribe algo para enviar"
                    onChange={handleChange}
                    onKeyDown={monitorSerialHandleClick} />
                <button
                    className="boton botonSendSerial"
                    id="monitorSerialEnviar"
                    onClick={handleSend}
                >Enviar</button>
            </div>
        </div>
    )
}

export default MonitorSerial;