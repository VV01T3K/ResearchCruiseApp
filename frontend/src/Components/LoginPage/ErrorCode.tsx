import {FieldError, FieldErrorsImpl, Merge} from "react-hook-form";


type Props = {
    code: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
}


function ErrorCode(props: Props){
    return (
        <p className="m-1 text-center text-danger" style={{fontSize: "12px"}}>
            {typeof props.code == "string" ? props.code: ""}
        </p>
    )
}


export default ErrorCode