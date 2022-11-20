import React from "react"
import TopBar from "./sections/topbar"
import "./styles.css"
import "./variables.css"
import MainContent from "./sections/mainContent"

import { socket, socketContext } from "./context/socket";

socket.on('connect', () => {
    console.log(socket.id);
})

const App: React.FC = () => {
    const pruebaBoton = () => {
        console.log("Hola");
    }

    return (
            <socketContext.Provider value={socket}>
                <TopBar />
                <MainContent />
            </socketContext.Provider>
    )
}

export default App