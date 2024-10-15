import {
    FBoolField,
    FDateFieldDayAndHour,
    FStandardDateField,
    FTextField,
} from '@app/pages/FormPage/Inputs/CellFormFields';
import { KeyContext } from '@contexts/KeyContext';

export const NameField = () => {
    return (
        <KeyContext.Provider value={'name'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Dzień
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const InsuranceField = () => {
    return (
        <KeyContext.Provider value={'insurance'}>
            <div className={'task-field-input'}>
                <label>
                    Czy uzyskano
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const PermissionField = () => {
    return (
        <KeyContext.Provider value={'permission'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Nazwa zadania
                </label>
                <FBoolField />
            </div>
        </KeyContext.Provider>
    );
};

export const StartDateField = () => {
    return (
        <KeyContext.Provider value={'startDate'}>
            <div className={'task-field-input col-md-6'}>
                <label>
                    Początek
                </label>
                <FDateFieldDayAndHour />
            </div>
        </KeyContext.Provider>
    );
};

export const EndDateField = () => {
    return (
        <KeyContext.Provider value={'endDate'}>
            <div className={'task-field-input col-md-6'}>
                <label>
                    Koniec
                </label>

                <FDateFieldDayAndHour />
            </div>
        </KeyContext.Provider>
    );
};

export const InsuranceColumn = () => (
    <div className={'w-100 d-flex flex-row flex-wrap'}>
        <InsuranceField />
        <StartDateField />
        <EndDateField />
    </div>
);


