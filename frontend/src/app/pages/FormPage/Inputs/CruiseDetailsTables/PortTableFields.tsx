import { KeyContext } from '@contexts/KeyContext';
import React from 'react';
import { FDateFieldDayAndHour, FStandardDateField, FTextField } from '@app/pages/FormPage/Inputs/CellFormFields';


export const EntranceDateField = () => {
    return (
        <KeyContext.Provider value={'entranceDate'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Wejście
                </label>
                <FDateFieldDayAndHour className={'w-100'} />
            </div>
        </KeyContext.Provider>
    );
};

export const ExitDateField = () => {
    return (
        <KeyContext.Provider value={'exitDate'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Wyjście
                </label>
                <FDateFieldDayAndHour className={'w-100'} />
            </div>
        </KeyContext.Provider>
    );
};

export const NameField = () => {
    return (
        <KeyContext.Provider value={'name'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Nazwa portu
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

