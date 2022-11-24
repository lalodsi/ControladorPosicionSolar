import React from 'react'
import "./styles.css"

export enum ComponentViewerTypes{
  dark = "centerElementsDark",
  light = "centerElementsLight"
}

type ComponentViewerProps = {
    children: React.ReactNode,
    type?: ComponentViewerTypes
}

const ComponentViewer: React.FC<ComponentViewerProps> = (props) => {
  const {
      children,
      type = ComponentViewerTypes.dark
  } = props;

  const classes = `centerElements ${type}`

  return (
    <div className={classes} >
      {children}
    </div>
  )
}

export default ComponentViewer