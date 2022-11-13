import * as React from 'react';
import "./styles.css"

interface IMainContentProps {
    children: React.ReactNode
}

const MainContent: React.FunctionComponent<IMainContentProps> = (props) => {
    const {
        children
    } = props;
    return (
        <div className='mainContent'>{children}</div>
    );
};

export default MainContent;
