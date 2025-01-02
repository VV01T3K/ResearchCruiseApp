import { FileNameField } from '@app/pages/FormPage/Inputs/ContractsTable/FilePicker';
import { CellFormTools, CellTools, } from '@app/pages/FormPage/Inputs/TableParts';
import { DisplayContext } from '@app/pages/FormPage/Inputs/TaskTable/EvaluatedTaskTable';
import { useContext } from 'react';
import FileIcon from 'bootstrap-icons/icons/file-earmark-text.svg?react';

export default function FFileDownloader() {
    const displayContext = useContext(DisplayContext);
    const { cellValue, cellId } = displayContext ? CellTools() : CellFormTools();
    const FileField = () => (
        <>
            {cellValue.content && (
                <a
                    className={'file-icon-label'}
                    href={cellValue.content}
                    type={'file'}
                    download={cellValue.name}
                    id={cellId}
                    hidden
                >
                    <FileIcon className={'file-icon'} />
                </a>
            )}
            {!cellValue.content && <FileIcon className={'file-icon'} />}
        </>
    );

    return (
        <div className="file-picker-field">
            <FileField />
            <FileNameField />
        </div>
    );
}
