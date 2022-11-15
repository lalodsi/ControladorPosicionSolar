import React from "react"
import TopBar from "./sections/topbar"
import "./styles.css"
import "./variables.css"
import MainContent from "./sections/mainContent"
import ConnectionMenu from "./components/principal/connectionMenu"

import { socket, socketContext } from "./context/socket";

const App: React.FC = () => {
    const pruebaBoton = () => {
        console.log("Hola");
    }

    return (
            <socketContext.Provider value={socket}>
                <TopBar />
                <MainContent>
                    <ConnectionMenu esperando={false} conectado={false} />
                </MainContent>
            </socketContext.Provider>
    )
}

export default App