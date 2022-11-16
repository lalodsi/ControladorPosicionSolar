import React from 'react'
import "./styles.css"

type LoadingProps = {}

const Loading = (props: LoadingProps) => {
  return (
    <div className="lds-ripple">
        <div></div>
        <div></div>
    </div>
  )
}

export default Loading;