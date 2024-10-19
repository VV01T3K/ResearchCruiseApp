import Page from '../../../ToBeMoved/Pages/Page';
import PageTitle from '@components/Page/PageTitle';
import CruiseApplicationsList from '@app/pages/CruiseApplicationsPage/CruiseApplicationsList/CruiseApplicationsList';
import React from 'react';

export default function HelpInformationPage() {
    return (
        <Page className="form-page">
            <PageTitle title="Pomoc" />
            <div className={'p-4'}>
                <h5>Tutaj powinny być informacje o pomocy</h5>
            </div>
        </Page>
    );
}