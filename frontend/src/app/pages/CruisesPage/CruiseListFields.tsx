import { Cruise } from 'Cruise';
import { CruisesTools } from './CruisesList';
import { HandleDeleteCruises } from './CruisesPageMisc';
import userBasedAccess from '../../../ToBeMoved/UserBasedAccess';
import ReadOnlyTextInput from '../../../ToBeMoved/CommonComponents/ReadOnlyTextInput';
import AssignedCruiseApplicationsList from './AssignedCruiseApplicationsList';
import LinkWithState from '../../../components/Navigation/LinkWithState';
import { Path } from '../../../ToBeMoved/Tools/Path';
import { EMPTY_GUID } from '@consts/emptyGuid';

export const TableReadOnlyField = (props: {
    fieldLabel: string;
    fieldKey: keyof Cruise;
}) => {
    const { cruise } = CruisesTools();
    return (
        <div className={'task-field-input'}>
            <label className={'table-field-input-label'}>{props.fieldLabel}</label>
            <ReadOnlyTextInput value={cruise![props.fieldKey] as string} />
        </div>
    );
};

export const TableReadOnlyFieldDate = (props: {
    fieldLabel: string;
    fieldKey: keyof Cruise;
}) => {
    const { cruise } = CruisesTools();
    return (
        <div className={'task-field-input'}>
            <label className={'table-field-input-label'}>{props.fieldLabel}</label>
            <ReadOnlyTextInput
                value={
                    new Date(cruise![props.fieldKey] as string).toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }) as string
                }
            />
        </div>
    );
};

export const Number = () => (
    <TableReadOnlyField fieldLabel={'Numer:'} fieldKey={'number'} />
);

export const StartDate = () => (
    <TableReadOnlyFieldDate
        fieldLabel={'Czas rozpoczęcia:'}
        fieldKey={'startDate'}
    />
);

export const EndDate = () => (
    <TableReadOnlyFieldDate
        fieldLabel={'Czas zakończenia:'}
        fieldKey={'endDate'}
    />
);

export const MainCruiseManagerId = () => {
    const { cruise } = CruisesTools();
    return (
        <div className={'task-field-input'}>
            <label className={'table-field-input-label'}>Kierownik główny:</label>
            {cruise.mainCruiseManagerId == EMPTY_GUID ? (
                <div>Nie przypisano</div>
            ) : (
                <>
                    <ReadOnlyTextInput value={cruise.mainCruiseManagerFirstName} />
                    <ReadOnlyTextInput value={cruise.mainCruiseManagerLastName} />
                </>
            )}
        </div>
    );
};

export const Cruises = () => {
    const { cruise } = CruisesTools();
    return (
        <div className={'task-field-input'}>
            <label className={'table-field-input-label'}>Zgłoszenia:</label>
            <AssignedCruiseApplicationsList
                cruiseApplicationsShortInfo={cruise.cruiseApplicationsShortInfo}
            />
        </div>
    );
};

export const Actions = () => {
    const { cruise } = CruisesTools();
    const handleDeleteCruise = HandleDeleteCruises();
    const { UserHasShipownerAccess, UserHasAdminAccess } = userBasedAccess();
    return (
        <div className="btn-group-vertical">
            <LinkWithState
                className="cruises-button"
                to={Path.CruiseForm}
                label="Szczegóły"
                state={{ cruise: cruise, readOnly: true }}
            />
            {(UserHasShipownerAccess() || UserHasAdminAccess()) && (
                <button
                    className="cruises-button"
                    onClick={() => handleDeleteCruise(cruise.id)}
                >
                    Usuń
                </button>
            )}
        </div>
    );
};
