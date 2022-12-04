import React, { Children } from 'react'
import "./styles.css"

export type ContainerType = "section" | "subsection" | "doubleColumns"

type ContainerProps = {
    children: React.ReactNode,
    type?: ContainerType,
    align?: "center"
    scroll?: boolean
}

const Container = (props: ContainerProps) => {
    const {
        children,
        type = "section",
        align,
        scroll = false
    } = props;

    let classes = ""
    if (align) {
        classes += ` ${align}`
    }
    if (type) {
        classes += ` ${type}`
    }
    if (scroll) {
        classes += ` contenido`
    }

    return (
        <div className={classes}>
            {children}
        </div>
    )
}

export default Container;