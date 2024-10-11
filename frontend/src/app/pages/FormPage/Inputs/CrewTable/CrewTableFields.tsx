import { FStandardDateField, FTextField } from '@app/pages/FormPage/Inputs/CellFormFields';
import { KeyContext } from '@contexts/KeyContext';


export const TitleField = () => {
    return (
        <KeyContext.Provider value={'title'}>
            <div className={'task-field-input'}>
                <label>
                    Tytuł (nauk., zawod.)
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const NamesField = () => {
    return (
        <KeyContext.Provider value={'names'}>
            <div className={'task-field-input col-md-6'}>
                <label>
                    Imiona
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const SurnameField = () => {
    return (
        <KeyContext.Provider value={'surname'}>
            <div className={'task-field-input col-md-6'}>
                <label>
                    Nazwisko
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const BirthPlaceField = () => {
    return (
        <KeyContext.Provider value={'birthPlace'}>
            <div className={'task-field-input col-md-6'}>
                <label>
                    Miejsce urodzenia
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const BirthDateField = () => {
    return (
        <KeyContext.Provider value={'birthDate'}>
            <div className={'task-field-input col-md-6'}>
                <label>
                    Data urodzenia
                </label>
                <FStandardDateField />
            </div>
        </KeyContext.Provider>
    );
};

export const IDField = () => {
    return (
        <KeyContext.Provider value={'ID'}>
            <div className={'task-field-input col-md-6'}>
                <label>
                    Numer ID dokumentu
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const ExpiryDateField = () => {
    return (
        <KeyContext.Provider value={'expiryDate'}>
            <div className={'task-field-input col-md-6'}>
                <label>
                    Data ważności dokumentu
                </label>
                <FStandardDateField />
            </div>
        </KeyContext.Provider>
    );
};

export const InstitutionField = () => {
    return (
        <KeyContext.Provider value={'institution'}>
            <div className={'task-field-input'}>
                <label className={'table-field-input-label'}>
                    Instytucja
                </label>
                <FTextField />
            </div>
        </KeyContext.Provider>
    );
};

export const PersonalDataColumn = () => (
    <div className={'w-100 d-flex flex-row flex-wrap'}>
        <TitleField />
        <NamesField />
        <SurnameField />
        <BirthPlaceField />
        <BirthDateField />
        <IDField />
        <ExpiryDateField />
    </div>
);
