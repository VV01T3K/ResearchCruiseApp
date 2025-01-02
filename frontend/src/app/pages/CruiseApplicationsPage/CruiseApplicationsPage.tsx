import PageTitle from '../../../components/Page/PageTitle';
import CruiseApplicationsList from './CruiseApplicationsList/CruiseApplicationsList';
import Page from '../../../ToBeMoved/Pages/Page';

function CruiseApplicationsPage() {
  return (
    <Page className='form-page page-content mh-100'>
      <PageTitle title='Zgłoszenia' />
      <CruiseApplicationsList />
    </Page>
  );
}

export default CruiseApplicationsPage;
