import {useContext} from 'react';
import userDataManager from '../../../ToBeMoved/CommonComponents/UserDataManager';

import ReadOnlyTextInput from '../../../ToBeMoved/CommonComponents/ReadOnlyTextInput';
import {FormALink, FormBLink, FormCLink,} from '../CruiseApplicationDetailsPage/CruiseApplicationInfo';
import LinkWithState from '../../../components/Navigation/LinkWithState';
import {Path} from '../../../ToBeMoved/Tools/Path';
import {FormContext} from '@contexts/FormContext';
import {CruiseApplicationContext} from '@contexts/CruiseApplicationContext';
import {CellContext} from '@contexts/CellContext';
import {FieldContext} from '@contexts/FieldContext';
import {CruiseApplicationListMode} from 'CruiseApplicationListMode';
import {ListModeContext} from '@contexts/ListModeContext';
import {ApplicationsContext} from '@contexts/ApplicationsContext';
import {CruiseApplication} from 'CruiseApplication';
import {CruiseApplicationStatus} from 'CruiseApplicationStatus';

export const ApplicationTools = () => {
  const cellContext = useContext(CellContext);
  const applicationContext = useContext(ApplicationsContext);

  const application: CruiseApplication =
    applicationContext![cellContext?.rowIndex!];
  return { application };
};

export const NumberAndDate = () => {
  const { application } = ApplicationTools();
  return (
    <div className={'task-field-input'}>
      <label className={'table-field-input-label'}>Numer i data:</label>
      <ReadOnlyTextInput value={application.number} />
      <ReadOnlyTextInput value={application.date} />
    </div>
  );
};

export const Year = () => {
  const { application } = ApplicationTools();
  return (
    <div className={'task-field-input'}>
      <label className={'table-field-input-label'}>Rok rejsu:</label>
      <ReadOnlyTextInput value={application.year.toString()} />
    </div>
  );
};

export const CruiseManager = () => {
  const { application } = ApplicationTools();
  return (
    <div className={'task-field-input'}>
      <label className={'table-field-input-label'}>Kierownik:</label>
      <ReadOnlyTextInput value={application.cruiseManagerFirstName} />
      <ReadOnlyTextInput value={application.cruiseManagerLastName} />
    </div>
  );
};

export const FormLinks = () => {
  const { application } = ApplicationTools();
  return (
    <CruiseApplicationContext.Provider value={application}>
      <div className={'task-field-input'}>
        <FormALink />
        <FormBLink />
        <FormCLink />
      </div>
    </CruiseApplicationContext.Provider>
  );
};

export const Points = () => {
  const { application } = ApplicationTools();
  return (
    <div className={'task-field-input'}>
      <label className={'table-field-input-label'}>Punkty:</label>
      <ReadOnlyTextInput value={application!.points} />
    </div>
  );
};

export const IsCurrentUserCruiseOrDeputyManager = (
  cruiseApplication: CruiseApplication
) => {
  const { userData } = userDataManager();
  return (
    cruiseApplication.cruiseManagerId == userData?.id ||
    cruiseApplication.deputyManagerId == userData?.id
  );
};

export const Status = () => {
  const { application } = ApplicationTools();
  const listModeContext = useContext(ListModeContext);
  const isCurrentUserCruiseOrDeputyManager =
    IsCurrentUserCruiseOrDeputyManager(application);
  return (
    <div className={'task-field-input'}>
      <label className={'table-field-input-label'}>Status:</label>
      <i>{application!.status}</i>
      {!listModeContext?.mode && (
        <>
          {application!.status == CruiseApplicationStatus.Draft &&
            isCurrentUserCruiseOrDeputyManager && (
              <>
                {<div style={{ fontSize: 11 }}>{application.note}</div>}
                <LinkWithState
                  to={Path.Form}
                  state={{ formType: 'A', cruiseApplication: application }}
                  label={'Kontynuuj wypełnianie'}
                />
              </>
            )}
          {application!.status == CruiseApplicationStatus.FormBRequired &&
            isCurrentUserCruiseOrDeputyManager && (
              <LinkWithState
                to={Path.Form}
                state={{ formType: 'B', cruiseApplication: application }}
                label={'Wypełnij'}
              />
            )
          }
          {application!.status == CruiseApplicationStatus.Undertaken &&
            isCurrentUserCruiseOrDeputyManager && (
              <LinkWithState
                to={Path.Form}
                state={{ formType: 'C' }}
                label={'Wypełnij formularz C'}
              />
            )
          }
            {(application!.status === CruiseApplicationStatus.Undertaken || application!.status === CruiseApplicationStatus.Reported) &&
                isCurrentUserCruiseOrDeputyManager && (
                    <div>
                        {application.effectsDoneRate} efektów
                    </div>
                )
            }
        </>
      )}
    </div>
  );
};

export const Actions = () => {
  const { application } = ApplicationTools();
  const listModeContext = useContext(ListModeContext);
  const fieldContext = useContext(FieldContext);
  const formContext = useContext(FormContext);

  return (
    <div className='task-field-input'>
      <LinkWithState
        useWindow={listModeContext?.mode != undefined}
        to={Path.CruiseApplicationDetails}
        label='Szczegóły'
        state={{ cruiseApplication: application, readOnly: true }}
      />
      {!formContext?.readOnly && (
        <>
          {listModeContext!.mode == CruiseApplicationListMode.Deletion && (
            <a
              className='btn btn-outline-danger'
              style={{ fontSize: 'inherit' }}
              onClick={() => {
                const updatedApplications = fieldContext!.value.filter(
                  (id: CruiseApplication['id']) => id !== application.id
                );
                fieldContext!.onChange!(updatedApplications);
              }}
            >
              Usuń
            </a>
          )}
          {listModeContext!.mode == CruiseApplicationListMode.Add && (
            // Show only if the component enables adding applications to a cruise
            <a
              className='btn btn-outline-success'
              style={{ fontSize: 'inherit' }}
              onClick={() => {
                const updatedApplications = [
                  ...fieldContext!.value,
                  application.id,
                ];
                fieldContext!.onChange(updatedApplications);
              }}
            >
              Dołącz
            </a>
          )}
        </>
      )}
    </div>
  );
};

export const CruiseApplicationsTableContent = () => [
  NumberAndDate,
  Year,
  CruiseManager,
  FormLinks,
  Points,
  Status,
  Actions,
];
