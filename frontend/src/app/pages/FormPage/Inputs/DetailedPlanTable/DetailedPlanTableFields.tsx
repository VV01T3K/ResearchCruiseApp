import {KeyContext} from '@contexts/KeyContext';
import {FIntField, FTextField} from '@app/pages/FormPage/Inputs/CellFormFields';

export const DayField = () => {
    return (
        <KeyContext.Provider value={'number'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Dzień
                </label>
                <FIntField />
            </div>
        </KeyContext.Provider>
    );
};

export const HoursField = () => {
    return (
        <KeyContext.Provider value={'hours'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Liczba godzin
                </label>
                <FIntField />
            </div>
        </KeyContext.Provider>
    );
};

export const TaskNameField = () => {
    return (
        <KeyContext.Provider value={'taskName'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Nazwa zadania
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const RegionField = () => {
    return (
        <KeyContext.Provider value={'region'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Rejon zadania
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const PositionField = () => {
    return (
        <KeyContext.Provider value={'position'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Pozycja
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const NotesField = () => {
    return (
        <KeyContext.Provider value={'comment'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Uwagi
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

