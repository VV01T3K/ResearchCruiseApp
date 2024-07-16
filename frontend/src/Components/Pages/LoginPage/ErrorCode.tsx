import {FieldError, FieldErrorsImpl, Merge} from "react-hook-form";


type Props = {
    code: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined,
    className?: string
}


function ErrorCode(props: Props){
    if (props.code)
        return (
            <p className={`m-1 text-center text-danger ${props.className ?? ""}`}>
                {typeof props.code == "string" ? props.code: ""}
            </p>
        )
    else
        return <span />
}


export default ErrorCode