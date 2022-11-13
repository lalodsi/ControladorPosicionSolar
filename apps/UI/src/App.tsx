import React from "react"
import Button from "./components/core/button"
import TopBar from "./sections/topbar"
import "./styles.css"
import { buttonTypes } from "./components/core/button"
import MainContent from "./sections/mainContent"

const App: React.FC = () => {
    const pruebaBoton = () => {
        console.log("Hola");
    }

    return (
        <React.Fragment>
            <TopBar />
            <MainContent>
                Hola
                <Button text="Boton 1" handleClick={pruebaBoton} className={buttonTypes.NavigationButton} />
            </MainContent>
        </React.Fragment>
    )
}

export default App