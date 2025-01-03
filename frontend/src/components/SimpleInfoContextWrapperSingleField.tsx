import { Context, useContext } from "react"
import SimpleInfoTile from "../ToBeMoved/CommonComponents/SimpleInfoTile"
import ReadOnlyTextInput from "../ToBeMoved/CommonComponents/ReadOnlyTextInput"

export const SimpleInfoContextWrapperSingleField = <T,>(props: {
  context: Context<T | null>
  title: string
  selector: keyof T
}) => {
  const context = useContext(props.context)
  return (
    <SimpleInfoTile title={props.title}>
      <ReadOnlyTextInput value={context![props.selector] as string} />
    </SimpleInfoTile>
  )
}
