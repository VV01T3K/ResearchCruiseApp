import accountAdminPayload from '@tests/assets/api-mocks/account_admin.json' with { type: 'json' };
import cruisePayload from '@tests/assets/api-mocks/api_CruiseApplications_id_cruise.json' with { type: 'json' };
import formAPayload from '@tests/assets/api-mocks/api_CruiseApplications_id_formA.json' with { type: 'json' };
import formBPayload from '@tests/assets/api-mocks/api_CruiseApplications_id_formB.json' with { type: 'json' };
import initValuesAPayload from '@tests/assets/api-mocks/api_forms_InitValues_A.json' with { type: 'json' };
import initValuesBPayload from '@tests/assets/api-mocks/api_forms_InitValues_B.json' with { type: 'json' };
import authDetailsPayload from '@tests/assets/api-mocks/authDetails.json' with { type: 'json' };

export const getAdminAccountPayload = () => {
  return accountAdminPayload;
};

export const getCruisePayload = () => {
  return cruisePayload;
};

export const getFormAPayload = () => {
  return formAPayload;
};

export const getFormBPayload = () => {
  return formBPayload;
};

export const getInitValuesAPayload = () => {
  return initValuesAPayload;
};

export const getInitValuesBPayload = () => {
  return initValuesBPayload;
};

export const getAuthDetailsPayload = (timeoutHours: number = 24) => {
  const deadlineDate = new Date();
  deadlineDate.setTime(deadlineDate.getTime() + timeoutHours * 60 * 60 * 1000); // add timeout in hours

  return {
    ...authDetailsPayload,
    expiresIn: deadlineDate.toISOString(),
    expirationDate: deadlineDate.toISOString(),
  };
};
