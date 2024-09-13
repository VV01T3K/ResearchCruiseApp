import React, {useContext} from "react";
import {CellFormTools, CellTools} from "../Pages/FormPage/Inputs/TableParts";
import {FileNameField} from "../Pages/FormPage/Inputs/ContractsTable/FilePicker";
import {ReactComponent as FileIcon}  from "/node_modules/bootstrap-icons/icons/file-earmark-text.svg";
import {DisplayContext} from "../Pages/FormPage/Inputs/TaskTable/EvaluatedTaskTable";


export default function FFileDownloader() {
    const displayContext = useContext(DisplayContext)
    const {cellValue, cellId} = displayContext ? CellTools() : CellFormTools()
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