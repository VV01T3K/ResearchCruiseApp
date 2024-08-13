import {useContext} from "react";
import {FormContext} from "../FormPage/Wrappers/FormTemplate";
import {FieldError, FieldErrorsImpl, Merge} from "react-hook-form";

type Props = {
    fieldName: string,
    className?: string
}


export default function ErrorMessageIfPresent (props: Props) {
    const formContext = useContext(FormContext)
    const fieldError:FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined  = formContext!.formState?.errors[props.fieldName]

    return(
            <p className={`m-1 text-center text-danger ${props.className ?? ""}`}>
                {fieldError?.message as string}
            </p>
        )
}