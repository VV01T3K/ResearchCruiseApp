import React from 'react';
import PageTitle from '../../../components/Page/PageTitle';
import CruiseApplicationsList from './CruiseApplicationsList/CruiseApplicationsList';
import Page from '../../../ToBeMoved/Pages/Page';

function CruiseApplicationsPage() {
    return (
        <Page className="form-page">
            <PageTitle title="Zgłoszenia" />
            <CruiseApplicationsList />
        </Page>
    );
}

export default CruiseApplicationsPage;
