import file_icon from "../../../../../resources/file_icon.png";
import React from "react";
import {UseFormReturn} from "react-hook-form";
import {Contract} from "./ContractsInput";
import Style from "../../../../CommonComponents/FileIcon.module.css";
import ReadOnlyTextInput from "../../../../CommonComponents/ReadOnlyTextInput";


type Props = {
    field: { value: string },
    name: string,
    fileFieldName: string,
    row: Contract,
    rowIdx: number,
    form: UseFormReturn
}


export default function FilePicker(props: Props) {
    const handleRemoveScan = () => {
        props.row.scan.name = ""
        props.row.scan.content = ""

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

    return (
        <div className="d-flex flex-wrap justify-content-center text-break">
            <input
                id={`contracts[${props.rowIdx}].fileInput`}
                type="file"
                accept=".pdf"
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
                className="w-100 bg-light d-flex justify-content-center clickable pb-1"
            >
                <img
                    src={file_icon}
                    height="45px"
                    width="45px"
                    className={"rounded-2 p-1 d-flex " + Style.img}
                    alt="File picker icon"
                />
            </label>
            <ReadOnlyTextInput
                className="text-secondary col-12"
                value={props.row.scan.name || "Brak"}
            />
            {props.row.scan.content != "" &&
                <a
                    className="d-flex btn btn-outline-danger col-12 justify-content-center mt-1"
                    style={{ fontSize: "inherit" }}
                    onClick={handleRemoveScan}
                >
                    Usuń skan
                </a>
            }
        </div>
    )
}