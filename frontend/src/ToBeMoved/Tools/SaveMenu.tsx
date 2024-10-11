import { fileName, handleDownload, handleSave } from './FormButtonsHandlers';
import React, { useContext, useState } from 'react';
import { ReactComponent as DownloadIcon } from '/node_modules/bootstrap-icons/icons/download.svg';
import { ReactComponent as CancelIcon } from '/node_modules/bootstrap-icons/icons/x-lg.svg';
import { FormContext } from '@contexts/FormContext';
import { FormContextFields } from '@app/pages/FormPage/Wrappers/FormTemplate';


const formDownloadProps = (formContext: FormContextFields) => {
    return { download: fileName(formContext?.type!), href: handleDownload(formContext?.getValues()!) };
};

export const DownloadButtonDefault = () => {
    const formContext = useContext(FormContext);
    return (
        <a {...formDownloadProps(formContext!)} className="form-page-option-button-default"> Pobierz </a>
    );
};

export const ResendButton = () => {
    const formContext = useContext(FormContext);
    return (
        <div onClick={() => formContext!.setReadOnly(false)} className="form-page-option-button-default"> Kopiuj</div>
    );
};

export function SaveMenu() {
    const [savingStated, setSavingStarted] = useState(false);

    const CancelButton = () => (
        <div className={'form-page-option-note-button-small'} onClick={() => setSavingStarted(false)}>
            <CancelIcon />
        </div>
    );

    const DownloadButton = () => {
        const formContext = useContext(FormContext);
        return (
            <a className={'form-page-option-note-button-small'} {...formDownloadProps(formContext!)}>
                <DownloadIcon />
            </a>
        );
    };
    const SaveButton = () => {
        const onClickAction = () => setSavingStarted(true);
        return (
            <button onClick={onClickAction} className="form-page-option-button-default"> Zapisz </button>
        );
    };

    const NoteInput = () => (
        <input placeholder={'Notatka'} className={'form-page-option-note-input'} type={'text'} />
    );
    const ConfirmSaveButton = () => {
        const formContext = useContext(FormContext);
        return (
            <div onClick={() => handleSave(formContext!)}
                 className="form-page-option-note-button-large"> Potwierdź </div>
        );
    };

    return {
        menu: () => (
            <>
                <NoteInput />
                <ConfirmSaveButton />
                <DownloadButton />
                <CancelButton />
            </>
        ),
        saveButton: SaveButton,
        enabled: savingStated,

    };

}