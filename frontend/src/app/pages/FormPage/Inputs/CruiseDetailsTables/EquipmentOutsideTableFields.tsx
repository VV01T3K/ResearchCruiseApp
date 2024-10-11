import { KeyContext } from '@contexts/KeyContext';
import React from 'react';
import { FDateFieldDayAndHour, FStandardDateField, FTextField } from '@app/pages/FormPage/Inputs/CellFormFields';


export const StartDateField = () => {
    return (
        <KeyContext.Provider value={'startDate'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Od
                </label>
                <FDateFieldDayAndHour />
            </div>
        </KeyContext.Provider>
    );
};

export const EndDateField = () => {
    return (
        <KeyContext.Provider value={'endDate'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Do
                </label>
                <FDateFieldDayAndHour />
            </div>
        </KeyContext.Provider>
    );
};

export const NameField = () => {
    return (
        <KeyContext.Provider value={'name'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Nazwa sprzętu
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

