import React from 'react'
import "./styles.css"

type Props = {
    children: React.ReactNode
}

const CenterElements: React.FC<Props> = (props) => {
    const {
        children,
    } = props;

  return (
    <div className='centerElements'>
      {children}
    </div>
  )
}

export default CenterElements