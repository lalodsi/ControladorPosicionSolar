import React from "react"
import TopBar from "./sections/topbar"
import "./styles.css"
import "./variables.css"
import MainContent from "./sections/mainContent"

const App: React.FC = () => {
    const pruebaBoton = () => {
        console.log("Hola");
    }

    return (
        <React.Fragment>
            <TopBar />
            <MainContent />
        </React.Fragment>
    )
}

export default App