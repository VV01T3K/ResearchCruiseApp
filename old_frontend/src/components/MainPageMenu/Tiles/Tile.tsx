import React from "react"

type Props = {
  children?: React.ReactElement
}

function Tile(props: Props) {
  return <div className={"tiles-common"}>{props.children}</div>
}

export default Tile
