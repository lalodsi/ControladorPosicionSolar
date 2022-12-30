import React from 'react'
import "./styles.css";
import clsx from "clsx";

type PopupProps = {
    message: string,
    type: "alert" | "error" | "success",
    time: number
}

const Popup: React.FC<PopupProps> = (props) => {
    const {
        type,
        message,
        time = 2000
    } = props;

    const [phase, setPhase] = React.useState("start");

    React.useEffect(() => {
        setTimeout(() => {
            console.log("Destroy this");
        }, time)
        setTimeout(() => {
            setPhase("");
        }, time/4)
        setTimeout(() => {
            setPhase("end");
        }, time*3/4)
    }, []);

    const rootClass = clsx(
        [
            "PopupContainer",
            type,
            phase
        ],
    )
    return (
        <div className={rootClass}>
            {message}
        </div>
    )
}

export default Popup;