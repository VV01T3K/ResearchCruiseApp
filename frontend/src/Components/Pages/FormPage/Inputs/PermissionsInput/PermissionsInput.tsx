import {
    Control,
    Controller, UseFormReturn,
} from "react-hook-form";
import React from "react";
import {FormValues} from "../Wrappers/FormTemplate";
import InputWrapper from "../InputWrapper";
import FileDownloader from "../../../../CommonComponents/FileDownloader";
import FilePicker from "../ContractsInput/FilePicker";
import PermissionPicker from "./PermissionPicker";

export type Permission = {
    scan: {
        name: string,
        content: string
    }

}

type Props = {
    className?: string,
    label: string,
    name: keyof FormValues,
    required?: any,
    maxLength?: number,
    resize?: string,
    form?: UseFormReturn<FormValues>,
    readonly?: boolean,
    scan: {
        name: string,
        content: string
    }
}


function PermissionsInput(props: Props) {
    const onChange = (e: { target: { value: string; }; }) => {
        if (e.target.value.length < 20) {
            props.form!.setValue(props.name, e.target.value)
        }
        // else if(e.target.value=='')
        //     props.setValue(props.name, "0", {shouldValidate:true})
    }


    return (
        <InputWrapper {...props}>
            <Controller
                name={props.name}
                control={props.form!.control}
                defaultValue={[]}
                render={({field}) =>
                    <div>
                        <textarea className={"h-100"}
                                  {...field}
                                  disabled={props.readonly ?? false}
                                  value={field.value?.toString() ?? ''}
                            // @ts-ignore
                                  style={{resize: props.resize ?? "true"}}

                        />
                        <div>Skan</div>
                        {props.readonly &&
                            <FileDownloader
                                fileName={props.scan?.name}
                                fileContent={props.scan?.content}
                                bg="bg-light"
                            />
                        }
                        {!props.readonly &&
                            <PermissionPicker
                                field={field}
                                name={props.name}
                                fileFieldName="scan"
                                form={props.form!}
                            />
                        }
                    </div>
                }

                rules={{
                    required: props.required ?? "Pole wymagane",
                    maxLength: {
                        value: props.maxLength ?? 200, // Maksymalna długość
                        message: `Za długi tekst, maksymalna długość to ${props.maxLength ?? 200} znaków.`,
                    },
                }}
            />
        </InputWrapper>
    )
}


export default PermissionsInput