import {useContext, useState} from 'react';
import CruiseApplicationsList from '../../../CruiseApplicationsPage/CruiseApplicationsList/CruiseApplicationsList';
import {FieldValues} from 'react-hook-form';
import FieldWrapper from '../../../FormPage/Inputs/FieldWrapper';
import {FormContext} from '@contexts/FormContext';
import {FieldContext} from '@contexts/FieldContext';
import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import UserBasedAccess from '../../../../../route/UserBasedAccess';
import {CruiseApplicationListMode,} from 'CruiseApplicationListMode';
import {extendedUseLocation} from '@hooks/extendedUseLocation';
import {CruiseStatus} from '@enums/CruiseStatus';
import {deleteCruise} from '@api/requests/Delete';
import {useNavigate} from 'react-router-dom';
import {Path} from '../../../../../ToBeMoved/Tools/Path';

export const applicationsSectionFieldNames = {
    applicationsIds: 'cruiseApplicationsIds',
};

const ToggleAddingModeButtons = () => {
    const [applicationsAddingMode, setApplicationsAddingMode] = useState(false);

    const EnableAddingModeButton = () => (
        <a
            className="cruises-button col-12"
            onClick={() => setApplicationsAddingMode(true)}
        >
            Dołącz zgłoszenie
        </a>
    );
    const DisableAddingModeButton = () => (
        <a
            className="cruises-button-outline-dark col-12"
            onClick={() => setApplicationsAddingMode(false)}
        >
            Anuluj dołączanie zgłoszenia
        </a>
    );
    return {
        applicationsAddingMode,
        EnableAddingModeButton,
        DisableAddingModeButton,
    };
};

//temporary -> rerenders need fix
const render = ({ field }: FieldValues) => {
    return (
        <FieldContext.Provider value={field}>
            <X />
        </FieldContext.Provider>
    );
};

const X = () => {
    const {
        applicationsAddingMode,
        EnableAddingModeButton,
        DisableAddingModeButton,
    } = ToggleAddingModeButtons();
    const formContext = useContext(FormContext);
    return (
        <>
            <CruiseApplicationsList mode={CruiseApplicationListMode.Deletion} />
            {!formContext?.readOnly && (
                <>
                    {!applicationsAddingMode && <EnableAddingModeButton />}
                    {applicationsAddingMode && (
                        <>
                            <DisableAddingModeButton />
                            <CruiseApplicationsList
                                className={'mt-3'}
                                mode={CruiseApplicationListMode.Add}
                            />
                        </>
                    )}
                </>
            )}
        </>
    );
};

const AddedApplicationsField = () => {
    const fieldProps = {
        fieldName: applicationsSectionFieldNames.applicationsIds,
        render: render,
        rules: {},
    };

    return <FieldWrapper className={'w-100'} {...fieldProps} />;
};

const RemoveCruiseField = () => {
    const [remove, setRemove] = useState(false);
    const location = extendedUseLocation();
    const navigate = useNavigate();
    const cruiseId = location?.state?.cruise.id;
    return (
        <>
            {!remove &&
                <div className={'text-decoration-underline'} style={{ cursor: 'pointer' }}
                     onClick={() => setRemove(true)}>
                    Awaryjne usuwanie rejsu
                </div>
            }
            {remove &&
                <>
                    <div className={'m-1'}>Do wszystkich kierowników zgłoszeń i ich zastępców zostanie wysłane
                        powiadomienie o anulowaniu
                        rejsu:
                    </div>
                    <div onClick={() => deleteCruise(cruiseId).then(() => navigate(Path.Cruises))}
                         style={{ cursor: 'pointer' }}
                         className={'text-danger text-decoration-underline'}>
                        Potwierdź
                    </div>
                </>
            }

        </>

    );
};

export const ApplicationsSection = () => {
    const { UserHasShipownerAccess, UserHasAdminAccess, UserHasGuestAccess } = UserBasedAccess();
    const location = extendedUseLocation();

    return SectionWrapper({
        shortTitle: 'Zgłoszenia',
        longTitle:
            UserHasShipownerAccess() || UserHasAdminAccess() || UserHasGuestAccess()
                ? 'Zgłoszenia przypisane do rejsu'
                : 'Moje zgłoszenia przypisane do rejsu',
        children:
            <>
                <AddedApplicationsField />
                {(UserHasShipownerAccess() ||
                        UserHasAdminAccess())
                    && location?.state?.cruise.status === CruiseStatus.Confirmed && <RemoveCruiseField />}
            </>,
    });
};
