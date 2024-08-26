import React from "react";
import {CellTools} from "../Pages/FormPage/Inputs/TableParts";
import {FileNameField} from "../Pages/FormPage/Inputs/ContractsTable/FilePicker";
import {ReactComponent as FileIcon}  from "/node_modules/bootstrap-icons/icons/file-earmark-text.svg";


export default function FileDownloader() {
    const {cellValue, cellId} = CellTools()
    const FileField = () => (
        <>
            { cellValue.content &&
            <a className={"file-icon-label"} href={cellValue.content} type={"file"} download={cellValue.name} id={cellId} hidden>
                <FileIcon className={"file-icon"}/>
            </a>
            }
            {!cellValue.content &&
                <FileIcon className={"file-icon"}/>
            }
        </>
    )

    return (
        <div className="file-picker-field">
            <FileField/>
            <FileNameField/>
        </div>
    )
}