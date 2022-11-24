import React from 'react'
import "./styles.css"

export enum TextType {
    info = 'info',
    header = 'header',
    subheader = 'subheader',
    dato = 'dato'
}

type TextProps = {
    content: string,
    type: TextType
}

const Text: React.FC<TextProps> = (props) => {
  const {
      content,
      type
  } = props

  return (
    <p className={type}>{content}</p>
  )
}

export default Text;