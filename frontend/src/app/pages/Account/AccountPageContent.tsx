import {ChangePasswordColumn, CredentialsColumn} from '@app/pages';

export const AccountPageContent = () => (
  <div className='account-page-data-row mh-100'>
    <CredentialsColumn />
    <ChangePasswordColumn />
  </div>
);
