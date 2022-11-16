import * as React from 'react';
import ConnectionMenu from '../../components/principal/connectionMenu';
import "./styles.css"

interface IMainContentProps {
}

const MainContent: React.FunctionComponent<IMainContentProps> = (props) => {

    return (
        <div className='mainContent'>
            <ConnectionMenu esperando={false} conectado={false} />
        </div>
    );
};

export default MainContent;
