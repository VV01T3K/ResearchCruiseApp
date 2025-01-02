import {DownloadButtonDefault, RefillBButton, RefillCButton, ResendButton, SaveMenu,} from './SaveMenu';
import {useContext, useEffect, useState} from 'react';
import {handlePrint, handleSubmit} from './FormButtonsHandlers';
import CancelIcon from 'bootstrap-icons/icons/x-lg.svg?react';
import userBasedAccess from '../../route/UserBasedAccess';
import {FormContext} from '@contexts/FormContext';
import {extendedUseLocation} from '@hooks/extendedUseLocation';
import {cruiseApplicationIdFromLocation} from '@hooks/cruiseApplicationIdFromLocation';
import {supervisorCodeFromLocation} from '@hooks/supervisorCodeFromLocation';
import {FormType} from '../Pages/CommonComponents/FormTitleWithNavigation';
import cruiseApplicationFromLocation from '@hooks/cruiseApplicationFromLocation';
import {CruiseApplicationStatus} from 'CruiseApplicationStatus';
import {acceptBySupervisor} from '@api/requests';

const SupervisorMenu = () => {
  const cruiseApplicationId = cruiseApplicationIdFromLocation();
  const supervisorCode = supervisorCodeFromLocation();
  const [response, setResponse] = useState<undefined | string>(undefined);
  const acceptPatch = (accept: string) =>
    acceptBySupervisor(cruiseApplicationId, supervisorCode, accept).catch(
      (err) => {
        setResponse(err.request.response);
        throw err;
      }
    );
  const accept = () =>
    acceptPatch('true')
      .then(() => setResponse('Zgłoszenie zostało zaakceptowane'))
      .catch(() => {});

  const deny = () =>
    acceptPatch('false')
      .then(() => setResponse('Zgłoszenie zostało odrzucone'))
      .catch(() => {});

  const AcceptButton = () => {
    const [disable, setDisable] = useState(false);
    return (
      <button
        disabled={disable}
        onClick={() => {
          setDisable(true);
          accept();
        }}
        className='form-page-option-button-default'
      >
        Zaakceptuj zgłoszenie
      </button>
    );
  };

  const DenyButton = () => {
    const [disable, setDisable] = useState(false);

    return (
      <button
        disabled={disable}
        onClick={() => {
          setDisable(true);
          deny();
        }}
        className='form-page-option-button bg-danger w-100'
      >
        Odrzuć zgłoszenie
      </button>
    );
  };

  return (
    <>
      {!response && (
        <>
          <AcceptButton />
          <DenyButton />
        </>
      )}
      {response && (
        <div className={'text-center justify-content-center w-100 p-2'}>
          {response}
        </div>
      )}
    </>
  );
};

const SendMenu = () => {
  const [enabled, setEnabled] = useState(false);
  const formContext = useContext(FormContext);
  const Button = () => {
    const onClickAction = () => {
      formContext!.setReadOnly(true);
      setEnabled(true);
    };
    return (
      <button
        onClick={formContext?.handleSubmit(onClickAction)}
        className='form-page-option-button-default'
      >
        Wyślij
      </button>
    );
  };

  const CancelButton = () => (
    <div
      className={'form-page-option-note-button-small'}
      onClick={() => {
        setEnabled(false);
        formContext!.setReadOnly(false);
      }}
    >
      <CancelIcon />
    </div>
  );

  const ConfirmSendButton = () => {
    const [disable, setDisable] = useState(false);

    useEffect(() => {}, []);
    const _handleSubmit = handleSubmit();
    return (
      <button
        onClick={() => {
          setDisable(true);
          _handleSubmit();
        }}
        disabled={disable}
        className='form-page-option-button w-100'
      >
        Potwierdź
      </button>
    );
  };

  return {
    Menu: () => (
      <div className={'d-flex flex-column w-100'}>
        {/*{formContext!.type == FormType.A && <Points />}*/}
        <div className={'d-flex flex-row w-100'}>
          <ConfirmSendButton />
          <CancelButton />
        </div>
      </div>
    ),
    Button: Button,
    enabled: enabled,
  };
};

const PrintButton = () => (
  <button onClick={handlePrint} className='form-page-option-button-default'>
    Drukuj
  </button>
);

export const BottomOptionBar = () => {
  const formContext = useContext(FormContext);
  const saveMenu = SaveMenu();
  const sendMenu = SendMenu();
  const location = extendedUseLocation();

  const EditableFormButtons = () => (
    <>
      {!sendMenu.enabled && <saveMenu.saveButton />}
      {!saveMenu.enabled && <sendMenu.Button />}
    </>
  );

  const ReadonlyFormButtons = () => {
    const formContext = useContext(FormContext);
    const cruiseApplication = cruiseApplicationFromLocation();
    const { UserHasGuestAccess, UserHasShipownerAccess, UserHasAdminAccess } =
      userBasedAccess();
    return (
      <>
        <PrintButton />
        {formContext?.type === FormType.A && !UserHasGuestAccess() && (
          <ResendButton />
        )}
        {formContext?.type === FormType.B &&
          (UserHasAdminAccess() || UserHasShipownerAccess()) &&
          (cruiseApplication?.status === CruiseApplicationStatus.FormBFilled ||
            cruiseApplication?.status ===
              CruiseApplicationStatus.Undertaken) && <RefillBButton />}
        {formContext?.type === FormType.C &&
          (UserHasAdminAccess() || UserHasShipownerAccess()) &&
          cruiseApplication?.status === CruiseApplicationStatus.Reported && (
            <RefillCButton />
          )}
        {(UserHasShipownerAccess() || UserHasAdminAccess()) && (
          <DownloadButtonDefault />
        )}
      </>
    );
  };

  const DefaultMenu = () => (
    <>
      {!formContext!.readOnly && <EditableFormButtons />}
      {formContext!.readOnly && <ReadonlyFormButtons />}
    </>
  );

  return (
    <div className='form-page-option-bar  ps-3 pe-3 ps-md-0 pe-md-0'>
      {location?.state.supervisorCode && <SupervisorMenu />}
      {!location?.state.supervisorCode && (
        <>
          {!saveMenu.enabled && !sendMenu.enabled && <DefaultMenu />}
          {saveMenu.enabled && <saveMenu.menu />}
          {sendMenu.enabled && <sendMenu.Menu />}
        </>
      )}
    </div>
  );
};
