import React from "react"
import TopBar from "./sections/topbar"
import "./styles.css"
import "./variables.css"
import MainContent from "./sections/mainContent"
import ConnectionMenu from "./components/principal/connectionMenu"

const App: React.FC = () => {
    const pruebaBoton = () => {
        console.log("Hola");
    }

    return (
        <React.Fragment>
            <TopBar />
            <MainContent>
                <ConnectionMenu esperando={false} conectado={false} />
            </MainContent>
        </React.Fragment>
    )
}

export default App