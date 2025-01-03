type Props = {
  required?: any
  className?: string
}

export const DummyTag = (props: Props) => {
  return <div className={props.className}></div>
}
