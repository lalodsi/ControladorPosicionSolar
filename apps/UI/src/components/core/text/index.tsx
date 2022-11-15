import React from 'react'

export enum TextType {
    title = 'title',
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