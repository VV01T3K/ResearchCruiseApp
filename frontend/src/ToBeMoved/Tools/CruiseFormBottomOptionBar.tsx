import React, { useContext, useState } from 'react';
import Api from '@api/Api';
import { useNavigate } from 'react-router-dom';
import { Path } from './Path';

import { FormContext } from '@contexts/FormContext';
import UserBasedAccess from '../../route/UserBasedAccess';

import { CruiseStatus } from '@enums/CruiseStatus';
import { cruiseFromLocation } from '@hooks/cruiseFromLocation';

const Handlers = () => {
    const formContext = useContext(FormContext);
    const navigate = useNavigate();
    const cruise = cruiseFromLocation();
    const refresh = RefreshCruiseFormPage();

    const handleAddCruise = () =>
        Api.post(`/api/Cruises`, formContext!.getValues()).then((_) =>
            navigate(Path.Cruises),
        );
    const handleEditCruise = () =>
        cruise &&
        Api.patch(`/api/Cruises/${cruise.id}`, formContext!.getValues())
            .then(() => formContext!.setReadOnly(true))
            .then(refresh);

    return { handleAddCruise, handleEditCruise };
};

const SaveButtonAction = () => {
    const { handleAddCruise, handleEditCruise } = Handlers();
    const formContext = useContext(FormContext);
    const cruise = cruiseFromLocation();

    return formContext?.handleSubmit(cruise ? handleEditCruise : handleAddCruise);
};
export const SaveButton = () => {
    const action = SaveButtonAction();

    return (
        <div onClick={action} className="form-page-option-button w-100">
            Zapisz rejs
        </div>
    );
};

export const ClearFormButton = () => {
    const formContext = useContext(FormContext);
    const cruise = cruiseFromLocation();
    const action = () => formContext!.reset();

    return (
        <div onClick={action} className="form-page-option-button w-100">
            {' '}
            {cruise ? 'Cofnij zmiany' : 'Wyczyść formularz'}{' '}
        </div>
    );
};

export const RefreshCruiseFormPage = () => {
    const navigate = useNavigate();
    const cruise = cruiseFromLocation();

    return () =>
        Api.get(`/api/Cruises/${cruise.id}`).then(
            (response) =>
                response &&
                navigate(Path.CruiseForm, {
                    state: { cruise: response?.data, readOnly: true }, replace: true,
                }),
        );
};

export const ConfirmCruiseButton = () => {
    const [toggleConfirm, setToggleConfirm] = useState(false);
    const formContext = useContext(FormContext);
    const cruise = cruiseFromLocation();
    const refreshCruiseFormPage = RefreshCruiseFormPage();

    const confirmCruise = () =>
        Api.put(`/api/Cruises/${cruise.id}/confirm`, { raw: true })
            .catch(() => {
            })
            .then(refreshCruiseFormPage);
    const Render = () => (
        <>
            {toggleConfirm && (
                <div className={'d-flex flex-column w-100'}>
                    <div className={'w-100 text-danger text-center mt-1'}>
                        Uwaga! Po zatwierdzeniu rejsu nie będzie możliwości edycji!
                    </div>
                    <div className={'d-flex flex-row w-100'}>
                        <div
                            onClick={() => {
                                setToggleConfirm(!toggleConfirm);
                                formContext?.setReadOnly(!toggleConfirm);
                            }}
                            className="form-page-option-button w-50"
                        >
                            {' '}
                            Anuluj
                        </div>
                        <div
                            onClick={confirmCruise}
                            className="form-page-option-button w-50 bg-danger"
                        >
                            {' '}
                            Potwierdź
                        </div>
                    </div>
                </div>
            )}
            {!toggleConfirm && (
                <>
                    <div
                        onClick={() => {
                            setToggleConfirm(!toggleConfirm);
                            formContext?.setReadOnly(!toggleConfirm);
                        }}
                        className="form-page-option-button w-100"
                    >
                        {' '}
                        Zatwierdź rejs
                    </div>
                </>
            )}
        </>
    );

    return { toggleConfirm, Render };
};

const EditFormButtons = () => (
    <>
        <ClearFormButton />
        <SaveButton />
    </>
);

const EditButton = () => {
    const formContext = useContext(FormContext);
    return (
        <div
            onClick={() => formContext!.setReadOnly(false)}
            className="form-page-option-button w-100"
        >
            {' '}
            Edytuj{' '}
        </div>
    );
};

const CancelEditButton = () => {
    const formContext = useContext(FormContext);
    return (
        <div
            onClick={() => formContext!.setReadOnly(true)}
            className="form-page-option-button w-100"
        >
            {' '}
            Anuluj{' '}
        </div>
    );
};

const NewCruiseButtons = () => {
    const { toggleConfirm, Render } = ConfirmCruiseButton();
    const formContext = useContext(FormContext);

    return (
        <>
            {!formContext!.readOnly && (
                <>
                    <CancelEditButton />
                    <EditFormButtons />
                </>
            )}
            {formContext!.readOnly && (
                <>
                    {!toggleConfirm && <EditButton />}
                    <Render />
                </>
            )}
        </>
    );
};

const NoCruiseButtons = () => <EditFormButtons />;

const ConfirmedCruiseButtons = () => {
    const cruise = cruiseFromLocation();
    const refreshCruiseFormPage = RefreshCruiseFormPage();
    const action = () =>
        Api.put(`/api/Cruises/${cruise.id}/end`).then(refreshCruiseFormPage);

    return (
        <div onClick={action} className="form-page-option-button w-100">
            Oznacz rejs jako zakończony
        </div>
    );
};

const EndedCruiseButtons = () => {
    return (
        <div className="p-2 text-center w-100">
            Rejs zakończony brak dodatkowych akcji
        </div>
    );
};

const PermittedUserMenu = () => {
    const cruise = cruiseFromLocation();

    return (
        <div className="form-page-option-bar">
            {!cruise && <NoCruiseButtons />}
            {cruise?.status == CruiseStatus.New && <NewCruiseButtons />}
            {cruise?.status == CruiseStatus.Confirmed && <ConfirmedCruiseButtons />}
            {cruise?.status == CruiseStatus.Ended && <EndedCruiseButtons />}
        </div>
    );
};

export const CruiseFormBottomOptionBar = () => {
    const { UserHasShipownerAccess, UserHasAdminAccess } = UserBasedAccess();

    return (
        <>
            {(UserHasShipownerAccess() || UserHasAdminAccess()) && (
                <PermittedUserMenu />
            )}
        </>
    );
};
