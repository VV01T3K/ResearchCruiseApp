import React from 'react';
import Page from '../../../ToBeMoved/Pages/Page';
import PageTitle from '../../../components/Page/PageTitle';
import { Content } from './AccountPageContent';

const AccountPage = () => (
  <Page className={'form-page'}>
    <PageTitle title={'Ustawienia konta'} />
    <Content />
  </Page>
);

export default AccountPage;
