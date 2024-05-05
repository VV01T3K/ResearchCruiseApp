import file_icon from "../../resources/file_icon.png";
import React from "react";
import ReadOnlyTextInput from "./ReadOnlyTextInput";


type Props = {
    fileName: string,
    fileContent: string
}


export default function FileDownloader(props: Props) {
    return (
        <div className="d-flex flex-wrap justify-content-center">
            <a
                className="w-100 bg-light d-flex justify-content-center"
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
                    className="rounded-2 p-1 d-flex"
                    onMouseEnter={e => {
                        const thisImage = e.target as HTMLImageElement
                        thisImage.style.backgroundColor = "#eeeeee"
                    }}
                    onMouseLeave={e => {
                        const thisImage = e.target as HTMLImageElement
                        thisImage.style.backgroundColor = "#f8f8f8"
                    }}
                    alt="File picker icon"
                />
            </a>
            <ReadOnlyTextInput value={props.fileName} />
        </div>
    )
}