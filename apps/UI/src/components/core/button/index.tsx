import * as React from 'react';
import "./styles.css"
import "../../../variables.css"

export enum buttonTypes {
    commonButton = "boton",
    connectButton = "botonArduino conectar",
    disconnectButton = "botonArduino desconectar",
    contentButton = "botonContenido",
    serialButton = "boton botonSendSerial"
}

interface IButtonProps {
    text: string,
    className: buttonTypes,
    handleClick: () => void
}

const Button: React.FunctionComponent<IButtonProps> = (props) => {
    const {
        text,
        className,
        handleClick
    } = props;

    const classes = className? className : buttonTypes.commonButton;

    return (
        <button onClick={handleClick} className={classes}>{text}</button>
    );
};

export default Button;
