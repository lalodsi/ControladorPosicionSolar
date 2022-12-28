import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import "./styles.css";

type ModalProps = {
    children: ReactNode
}

const container = document.getElementById("modal") ?? document.createElement("div")
const Modal: React.FC<ModalProps> = (props) => {
    const {
        children,
    } = props;

    return createPortal(
        <div className="ModalBackground">
            {children}
        </div>,
        container
    );
}

export default Modal;