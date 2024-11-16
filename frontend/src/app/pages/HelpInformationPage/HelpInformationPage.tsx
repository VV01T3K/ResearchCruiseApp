import Page from '../../../ToBeMoved/Pages/Page';
import PageTitle from '@components/Page/PageTitle';
import CruiseApplicationsList from '@app/pages/CruiseApplicationsPage/CruiseApplicationsList/CruiseApplicationsList';
import React from 'react';

export default function HelpInformationPage() {
  return (
    <Page className='form-page'>
      <PageTitle title='Pomoc' />
      <div
        className={
          'h5 p-4 justify-content-center align-items-center text-center align-self-center h-100'
        }
      >
        <>Informacje o pomocy zostaną dodane w przyszłej aktualizacji</>
      </div>
    </Page>
  );
}
