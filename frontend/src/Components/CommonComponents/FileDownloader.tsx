import file_icon from "../../resources/file_icon.png";
import React from "react";
import ReadOnlyTextInput from "./ReadOnlyTextInput";
import Style from "./FileIcon.module.css";


type Props = {
    fileName: string,
    fileContent: string,
    bg: string
}


export default function FileDownloader(props: Props) {
    return (
        <>
        <div className="d-flex flex-wrap justify-content-center text-break">
            <a
                className={`w-100 ${props.bg} d-flex justify-content-center pb-1`}
                style={{
                    cursor: "pointer"
                }}
                href={props.fileContent}
                download={props.fileName}
            >
                <img
                    src={file_icon}
                    height="45px"
                    width="45px"
                    className={"rounded-2 p-1 d-flex" + props.bg == 'bg-light' ? Style.img: Style.imgDark}
                    alt="File picker icon"
                />
            </a>
            <ReadOnlyTextInput
                value={props.fileName}
                className="bg-light"
            />
        </div>
        </>
    )
}