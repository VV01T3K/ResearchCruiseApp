import {
    FBoolField,
    FDateFieldEnd,
    FDateFieldStart,
    FFloatField,
    FIntField,
    FStandardDateField,
    FTextField,
} from '../CellFormFields';

export const AuthorField = () => (
    <div className={'task-field-input col-md-4'}>
        <label>Autor</label>
        <FTextField />
    </div>
);


export const TitleField = () =>
    (
        <div className={'task-field-input col-md-8'}>
            <label>Tytuł</label>
            <FTextField />
        </div>
    );

export const MagazineField = () => {
    return (
        <div className={'task-field-input col-md-8'}>
            <label>
                Czasopismo
            </label>
            <FTextField />
        </div>
    );
};

export const PublicationDraftTitleField = () =>
    (
        <div className={'task-field-input col-md-8'}>
            <label>Roboczy tytuł publikacji</label>
            <FTextField />
        </div>
    );

export const FinancingApprovedField = () =>
    (
        <div className={'task-field-input col-md-5'}>
            <label>Otrzymano decyzję o finansowaniu</label>
            <FBoolField />
        </div>
    );

export const ProjectDraftTitleField = () =>
    (
        <div className={'task-field-input col-md-8'}>
            <label>Roboczy tytuł projektu</label>
            <FTextField />
        </div>
    );

export const InstitutionField = () =>
    (
        <div className={'task-field-input col-md-7 '}>
            <label>Instytucja, do której składany</label>
            <FTextField />
        </div>
    );

export const DateField = () =>
    (
        <div className={'task-field-input col-md-4'}>
            <label>Przewidywany termin składania</label>
            <FStandardDateField />
        </div>
    );

export const StartDateField = () =>
    (
        <>
            <label className="p-2 pb-0 align-items-center d-flex col-md-2"> <span>Ramy czasowe:</span></label>
            <div className={'task-field-input col-md-3'}>
                <label>Od</label>
                <FDateFieldStart className={'w-100'} />
            </div>
        </>
    );

export const EndDateField = () =>
    (
        <div className={'task-field-input col-md-3 '}>
            <label>Do</label>
            <FDateFieldEnd className={'w-100'} />
        </div>
    );

export const FinancingAmountField = () =>
    (
        <div className={'task-field-input col-md-4 '}>
            <label>Kwota finansowania (zł)</label>
            <FFloatField />
        </div>
    );

export const MinisterialPointsField = () =>
    (
        <div className={'task-field-input col-md-4 '}>
            <label>Przewidywane punkty ministerialne</label>
            <FIntField />
        </div>
    );


export const SecuredAmountField = () =>
    (
        <div className={'task-field-input col-md-4 '}>
            <label>Środki zabezpieczone na realizację rejsu (zł)</label>
            <FFloatField />
        </div>
    );


export const TaskDescriptionField = () =>
    (
        <div className={'task-field-input'}>
            <label>
                Opis zadania
            </label>
            <FTextField />
        </div>
    );

export const DidacticsDescriptionField = () =>
    (
        <div className={'task-field-input'}>
            <label>
                Opis zajęcia dydaktycznego
            </label>
            <FTextField />
        </div>
    );
