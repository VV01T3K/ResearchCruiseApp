type Props = {
  message?: string
  className?: string
}

function SuccessMessage(props: Props) {
  if (props.message) {
    return (
      <p className={`m-1 text-center text-success ${props.className ?? ""}`}>
        {props.message ?? ""}
      </p>
    )
  } else {
    return <span />
  }
}

export default SuccessMessage
