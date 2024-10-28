import {

    FTextField,
} from '@app/pages/FormPage/Inputs/CellFormFields';
import { KeyContext } from '@contexts/KeyContext';

export const MaterialField = () => {
    return (
        <KeyContext.Provider value={'material'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Rodzaj próbki
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const AmountField = () => {
    return (
        <KeyContext.Provider value={'amount'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Ilość / liczba
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const AnalysisField = () => {
    return (
        <KeyContext.Provider value={'analysis'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Analiza na zebranym materiale
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const GoingPublicField = () => {
    return (
        <KeyContext.Provider value={'goingPublic'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Upublicznienie danych
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};



