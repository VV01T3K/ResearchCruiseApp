import {FieldError, FieldErrorsImpl, Merge} from "react-hook-form";

function ErrorCode(props: {code:string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined}){

    return (<p className={"m-1 text-center text-danger"} style={{fontSize: "12px"}}>
            { typeof props.code == "string" ? props.code: ""}
        </p>
    )
}
export default ErrorCode