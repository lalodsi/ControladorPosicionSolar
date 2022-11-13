import * as React from 'react';
import "./styles.css"

export enum buttonTypes {
    NavigationButton = "boton",
    processButton = "ArduinoBoton"
}

interface IButtonProps {
    text: string,
    className: buttonTypes,
    // handleClick: (event: React.MouseEventHandler<HTMLButtonElement>) => void
    handleClick: () => void
    // handleClick: React.MouseEventHandler<HTMLButtonElement>
}

const Button: React.FunctionComponent<IButtonProps> = (props) => {
    const {
        text,
        className,
        handleClick
    } = props;

    const classes = className? className : buttonTypes.NavigationButton;

    return (
        <button onClick={handleClick} className={classes}>{text}</button>
    );
};

export default Button;
