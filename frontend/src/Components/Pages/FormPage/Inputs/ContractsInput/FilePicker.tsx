import file_icon from "../../../../../resources/file_icon.png";
import React from "react";
import {UseFormReturn} from "react-hook-form";
import {Contract} from "./ContractsInput";
import Style from "../../../../CommonComponents/FileIcon.module.css";


type Props = {
    field: {value:string},
    name: string,
    fileFieldName: string,
    row: Contract,
    rowIdx: number,
    form: UseFormReturn
}


export default function FilePicker(props: Props) {
    return (
        <div className="d-flex flex-wrap justify-content-center text-break">
            <input
                id={`contracts[${props.rowIdx}].fileInput`}
                type="file"
                hidden
                onChange={e => {
                    if (e.target.files && e.target.files.length) {
                        const reader = new FileReader()
                        const fileName = e.target.files[0].name
                        reader.onloadend = () => {
                            if (e.target.files) {
                                const fileContent = reader.result!.toString();

                                props.row.scan.name = fileName
                                props.row.scan.content = fileContent

                                props.form!.setValue(
                                    props.name,
                                    props.field.value,
                                    {
                                        shouldTouch: true,
                                        shouldValidate: true,
                                        shouldDirty: true
                                    }
                                )
                            }
                        }
                        reader.readAsDataURL(e.target.files[0])
                    }
                }}
            />
            <label
                htmlFor={`${props.name}[${props.rowIdx}].fileInput`}
                className="w-100 bg-light d-flex justify-content-center clickable"
            >
                <img
                    src={file_icon}
                    height="45px"
                    width="45px"
                    className={"rounded-2 p-1 d-flex " + Style.img}
                    alt="File picker icon"
                />
            </label>
            <div className="text-secondary">
                {props.row.scan.name || "Brak"}
            </div>
        </div>
    )
}