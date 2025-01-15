import { Context, useContext } from "react"
import SimpleInfoTile from "../ToBeMoved/CommonComponents/SimpleInfoTile"
import ReadOnlyTextInput from "../ToBeMoved/CommonComponents/ReadOnlyTextInput"

export const SimpleInfoContextWrapperTwoFields = <T,>(props: {
  context: Context<T | null>
  title: string
  firstSelector: keyof T
  secondSelector: keyof T
}) => {
  const context = useContext(props.context)
  return (
    <SimpleInfoTile title={props.title}>
      <ReadOnlyTextInput
        value={context ? (context![props.firstSelector] as string) : undefined}
        className={!context ? "bg-secondary" : ""}
      />
      <ReadOnlyTextInput
        value={context ? (context![props.secondSelector] as string) : undefined}
        className={"mt-1 " + !context ? "bg-secondary" : ""}
      />
    </SimpleInfoTile>
  )
}
