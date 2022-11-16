import React from 'react'
import "./styles.css"

export enum LoadingTypes {
  waiting = "waiting",
  requesting = "requesting"
}

interface LoadingProps {
  type: LoadingTypes
}

const Loading: React.FC<LoadingProps> = (props) => {
  const {
    type
  } = props

  return (
      type === LoadingTypes.waiting ?
      (
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      )
      :
      (
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )
  )
}

export default Loading;