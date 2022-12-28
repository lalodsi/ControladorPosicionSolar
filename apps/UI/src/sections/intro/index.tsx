import React from 'react';
import { createPortal } from 'react-dom';
import Modal from '../../components/core/modal';
import ConnectionMenu from '../../components/principal/connectionMenu';
import "./styles.css"
import Container, { ContainerType } from '../../components/core/container';
import Button, { buttonTypes } from '../../components/core/button';
import Text, { TextType } from '../../components/core/text';

type IntroductionProps = {}

const container = document.getElementById("modal") ?? document.createElement("div")
const Introduction: React.FC<IntroductionProps> = (props) => {

    const [introSectionsButton, setIntroSectionsButton] = React.useState<"Creditos" | "Volver al menu">("Creditos")

    const handleChangeSection = () => {
        setIntroSectionsButton(
            introSectionsButton === "Creditos" ? "Volver al menu" : "Creditos"
        )
    }
    return (
        <Modal>
            <Container type={"section"}>
                {
                    introSectionsButton === "Creditos" ? (
                        <React.Fragment>
                            <ConnectionMenu />
                            <hr />
                        </React.Fragment>
                    ) : (
                        <div className="Introduction-contenedor">
                            <section className="subsection" >
                                <Text content='Sistema controlador de posición de dos grado de libertad para la orientación de paneles fotovoltaicos' type={TextType.header} />
                                <Text content='Trabajo terminal para obtener el titulo de Ingeniero en Mecatrónica' type={TextType.subheader} />
                                <Text type={TextType.subheader} content="Creadores" />
                                <ul className="info">
                                        <li>Luis Eduardo Rodríguez Ramírez</li>
                                        <li>Néstor Alberto Ruiz Méndez</li>
                                        <li>Cesar Alexis Romero Domínguez</li>
                                </ul>
                                <Text type={TextType.subheader} content="Asesores" />
                                <ul className="info">
                                    <li>M. en C. Alvaro Gordillo Sol</li>
                                    <li>Ing. Erick Lopez Alarcón</li>
                                </ul>
                        </section>
                        </div>
                    )
                }
                <Button text={introSectionsButton} handleClick={handleChangeSection} className={buttonTypes.commonButton} />
            </Container>
        </Modal>
    );
}

export default Introduction;