import TextareaAutosize from "react-textarea-autosize"

type Props = {
  value: string | undefined
  className?: string
}

export default function ReadOnlyTextInput(props: Props) {
  return (
    <TextareaAutosize
      className={"field-common m-1 " + props.className}
      value={props.value}
      readOnly
    />
  )
}
