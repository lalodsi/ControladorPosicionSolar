import * as React from 'react';
import ConnectionMenu from '../../components/principal/connectionMenu';
import NavigationSection from '../../components/principal/navigationSection';
import "./styles.css"

interface IMainContentProps {
}

const MainContent: React.FunctionComponent<IMainContentProps> = (props) => {

    return (
        <div className='mainContent'>
            <div className="mainSection"></div>
            <div className="secondarySection">
                <NavigationSection />
                <ConnectionMenu />
            </div>
        </div>
    );
};

export default MainContent;
