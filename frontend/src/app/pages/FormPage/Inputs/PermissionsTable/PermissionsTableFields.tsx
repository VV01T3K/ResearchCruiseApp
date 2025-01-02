import {FSelectField, FTextField} from '../CellFormFields';
import React from 'react';
import FilePicker from '../ContractsTable/FilePicker';
import {SelectOptions} from '../../Wrappers/ReactSelectWrapper';
import FFileDownloader from '../../../../../ToBeMoved/CommonComponents/FFileDownloader';
import {KeyContext} from '@contexts/KeyContext';

export type OneOrModeReactElements = React.ReactElement;

export const LabelDisplayedOnMd = (props: { label: string }) => (
    <label className={'table-field-input-label'}> {props.label}</label>
);

export const LabelDisplayed = (props: { label: string }) => (
    <label> {props.label}</label>
);

export const FieldLabelWrapper = (props: {
    label: string;
    children: React.ReactNode;
    dMd?: boolean;
}) => (
    <div className={'task-field-input'}>
        {props.dMd ? (
            <LabelDisplayed label={props.label} />
        ) : (
            <LabelDisplayedOnMd label={props.label} />
        )}
        {props.children}
    </div>
);
export const FieldContextWrapper = (props: {
    keySelector: string;
    label: string;
    children: React.ReactNode;
    dMd?: boolean;
}) => (
    <KeyContext.Provider value={props.keySelector}>
        <FieldLabelWrapper label={props.label} dMd={props.dMd}>
            {props.children}
        </FieldLabelWrapper>
    </KeyContext.Provider>
);

export const FTextFieldWrapper = (props: {
    keySelector: string;
    label: string;
}) => (
    <FieldContextWrapper {...props}>
        <FTextField />
    </FieldContextWrapper>
);

export const FilePickerWrapper = (props: {
    keySelector: string;
    label: string;
}) => (
    <FieldContextWrapper {...props}>
        <FilePicker />
    </FieldContextWrapper>
);

export const FFileDownloaderWrapper = (props: {
    keySelector: string;
    label: string;
}) => (
    <FieldContextWrapper {...props}>
        <FFileDownloader />
    </FieldContextWrapper>
);

export const FSelectWrapper = (props: {
    keySelector: string;
    label: string;
    options: SelectOptions;
}) => (
    <FieldContextWrapper {...props}>
        <FSelectField options={props.options} />
    </FieldContextWrapper>
);

export const DescriptionField = () => (
    <FTextFieldWrapper keySelector={'description'} label={'Treść pozwolenia'} />
);

export const ExecutiveField = () => (
    <FTextFieldWrapper
        keySelector={'executive'}
        label={'Organ wydający pozwolenie'}
    />
);

export const UploadField = () => (
    <FilePickerWrapper keySelector={'scan'} label={'Skan pozwolenia'} />
);

export const DownloadField = () => (
    <FFileDownloaderWrapper keySelector={'scan'} label={'Skan umowy'} />
);
