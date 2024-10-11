import React, { useContext } from 'react';
import { CellFormTools, CellTools } from '../TableParts';
import { ReactComponent as FileIcon } from '/node_modules/bootstrap-icons/icons/file-earmark-text.svg';
import { DisplayContext } from '../TaskTable/EvaluatedTaskTable';

const defaultFileValue = { name: '', content: '' };

export const FileNameField = () => {
    const displayContext = useContext(DisplayContext);
    const { cellValue } = displayContext ? CellTools() : CellFormTools();

    return (
        <label className={' w-100'}> {cellValue?.name || 'Brak'} </label>
    );
};

export const FileIconLabel = () => {
    const displayContext = useContext(DisplayContext);
    const { cellId } = displayContext ? CellTools() : CellFormTools();

    return (
        <label htmlFor={cellId} className="file-icon-label">
            <FileIcon className={'file-icon'} />
        </label>
    );
};

const SetFile = () => {
    const { setCellValue, field } = CellFormTools();
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        let scan = defaultFileValue;
        if (e.target.files && e.target.files.length) {
            const reader = new FileReader();
            const fileName = e.target.files![0].name;
            reader.onloadend = () => {
                if (e.target.files) {
                    const fileContent = reader.result!.toString();
                    scan = { name: fileName, content: fileContent };
                    setCellValue(scan);
                    field?.onBlur();
                }
            };
            reader.readAsDataURL(e.target.files![0]);
        }
    };
};

const FileField = () => {
    const displayContext = useContext(DisplayContext);
    const { cellId } = displayContext ? CellTools() : CellFormTools();

    const setFile = SetFile();
    return (
        <input id={cellId} type="file" accept=".pdf" hidden onChange={setFile} />
    );
};


export default function FilePicker() {
    const { cellValue, setCellValue, field } = CellFormTools();
    const handleRemoveScan = () => {
        setCellValue(defaultFileValue);
        field?.onBlur();
    };


    const RemoveFileButton = () => (
        <>
            {cellValue?.content != '' &&
                <a className="remove-file-button" onClick={handleRemoveScan}>
                    Usuń skan
                </a>
            }
        </>
    );

    return (
        <div className="file-picker-field">
            <FileField />
            <FileIconLabel />
            <FileNameField />
            <RemoveFileButton />
        </div>
    );
}