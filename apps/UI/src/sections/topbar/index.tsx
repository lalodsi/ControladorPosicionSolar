import * as React from 'react';
import "./styles.css"

function TopBar() {
    const handleCloseApp = () => {
        // @ts-ignore
        electronAPI.closeApp()
    }
    const handleMinimizeApp = () => {
        // @ts-ignore
        electronAPI.minimizeApp()
    }

    return ( 
        <div className="topBar">
            <div className='titleBar'>
                {/* <img src="" alt="" /> */}
                <div className='title'>
                    Tesis
                </div>
            </div>
            <div className='titleBarBtns'>
                <button id="minimizeBtn" onClick={handleMinimizeApp} className="topBtn minimizeBtn"></button>
                <button id="closeBtn" onClick={handleCloseApp} className="topBtn closeBtn"></button>
            </div>
        </div>
     );
}

export default TopBar;
