import React from "react"
import TopBar from "./sections/topbar"
import "./styles.css"
import "./variables.css"
import MainContent from "./sections/mainContent"
import Introduction from "./sections/intro";
import { Provider } from "react-redux"
import { store } from "./redux/store"

const App: React.FC = () => {

    return (
        <Provider store={store} >
            <TopBar />
            <MainContent />
            <Introduction />
        </Provider>
    )
}

export default App