import React from 'react';
import { createPortal } from 'react-dom';
import Modal from '../../components/core/modal';
import "./styles.css"

type IntroductionProps = {}

const container = document.getElementById("modal") ?? document.createElement("div")
const Introduction: React.FC<IntroductionProps> = (props) => {
    return (
        <Modal>
            <div className="Introduction-contenedor">
                Hola este es un modal
            </div>
        </Modal>
    );
}

export default Introduction;