import { argTypesEnhancers } from '@storybook/store/dist/ts3.9/inferControls';
import * as React from 'react';
import "./styles.css"

interface TopBarArgs {
    handleClose?: () => void,
    handleMinimize?: () => void
}

const TopBar: React.FC<TopBarArgs> = (props) => {
    const {
        handleClose,
        handleMinimize
    } = props;

    const DefaultCloseApp = () => {
        // @ts-ignore
        electronAPI.closeApp()
    }
    const DefaultMinimizeApp = () => {
        // @ts-ignore
        electronAPI.minimizeApp()
    }

    const handleCloseApp = handleClose? handleClose : DefaultCloseApp;
    const handleMinimizeApp = handleMinimize? handleMinimize : DefaultMinimizeApp;

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
