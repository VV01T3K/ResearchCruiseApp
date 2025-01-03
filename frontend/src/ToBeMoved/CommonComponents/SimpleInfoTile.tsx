import React from "react"

type Props = {
  title: string
  children?:
    | React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>[]
    | React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>
}

export default function SimpleInfoTile(props: Props) {
  return (
    <div className={`col-md-6 col-12 p-2`}>
      <div className={"field-common h-100 d-flex flex-column justify-content-center"}>
        <div className="d-flex col-12 justify-content-center mb-2">
          <b>{props.title}:</b>
        </div>
        <div className={"d-flex flex-row flex-wrap justify-content-center align-items-center"}>
          {props.children}
        </div>
      </div>
    </div>
  )
}
