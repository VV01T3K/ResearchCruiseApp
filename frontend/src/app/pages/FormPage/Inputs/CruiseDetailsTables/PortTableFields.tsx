import { KeyContext } from '@contexts/KeyContext';
import React from 'react';
import { FStandardDateField, FTextField } from '@app/pages/FormPage/Inputs/CellFormFields';


export const EntranceDateField = () => {
    return (
        <KeyContext.Provider value={'entranceDate'}>
            <div className={'task-field-input'}>
                <label>
                    Wejście
                </label>
                <FStandardDateField />
            </div>
        </KeyContext.Provider>
    );
};

export const ExitDateField = () => {
    return (
        <KeyContext.Provider value={'exitDate'}>
            <div className={'task-field-input col-md-6'}>
                <label>
                    Wyjście
                </label>
                <FStandardDateField />
            </div>
        </KeyContext.Provider>
    );
};

export const NameField = () => {
    return (
        <KeyContext.Provider value={'name'}>
            <div className={'task-field-input col-md-6'}>
                <label>
                    Nazwa
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

