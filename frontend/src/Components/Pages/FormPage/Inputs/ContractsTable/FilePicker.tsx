import React from "react";
import {CellTools} from "../TableParts";
import {ReactComponent as FileIcon}  from "/node_modules/bootstrap-icons/icons/file-earmark-text.svg";

const defaultFileValue = {name:"", content:""}

export const FileNameField = () => {
    const {cellValue} = CellTools()

    return(
        <label className={" w-100"}> {cellValue.name || "Brak"} </label>
    )
}

export const FileIconLabel = () => {
    const {cellId} = CellTools()

    return(
        <label htmlFor={cellId} className="file-icon-label">
            <FileIcon className={"file-icon"}/>
        </label>
    )
}

const SetFile = () => {
    const {setCellValue, field} = CellTools()
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        var scan = defaultFileValue
        if (e.target.files && e.target.files.length) {
            const reader = new FileReader()
            const fileName = e.target.files[0].name
            reader.onloadend = () => {
                if (e.target.files) {
                    const fileContent = reader.result!.toString();
                    scan = {name: fileName, content: fileContent}
                    setCellValue(scan)
                    field.onBlur()
                }
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }
}

const FileField = () => {
    const {cellId} = CellTools()

    const setFile = SetFile()
    return(
        <input  id={cellId} type="file" accept=".pdf" hidden onChange={setFile}/>
    )
}



export default function FilePicker() {
    const {cellValue, setCellValue, field} = CellTools()
    const handleRemoveScan = () => {
        setCellValue(defaultFileValue)
        field.onBlur()
    }



    const RemoveFileButton = () => (
        <>
            {cellValue.content != "" &&
                <a className="remove-file-button" onClick={handleRemoveScan}>
                    Usuń skan
                </a>
            }
        </>
    )

    return (
        <div className="file-picker-field">
            <FileField/>
            <FileIconLabel/>
            <FileNameField/>
            <RemoveFileButton/>
        </div>
    )
}