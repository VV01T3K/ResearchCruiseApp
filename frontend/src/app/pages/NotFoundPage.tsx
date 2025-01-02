import Page from '../../ToBeMoved/Pages/Page';
import PageTitle from '@components/Page/PageTitle';
import image from '../../resources/Oceanograf2.jpg';
import LinkWithState from '@components/Navigation/LinkWithState';
import {Path} from '../../ToBeMoved/Tools/Path';

function NotFoundPage() {
  return (
    <Page className={'common-page '}>
      <PageTitle title={'Szukana strona nie została znaleziona'} />
      <img className={'m-5 mb-2 rounded'} src={image} />
      <LinkWithState
        className={'text-center fs-5 mb-3'}
        to={Path.Default}
        state={{}}
        label={'Powrót'}
      />
    </Page>
  );
}

export default NotFoundPage;
