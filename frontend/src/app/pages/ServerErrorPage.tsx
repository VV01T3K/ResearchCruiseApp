import Page from '../../ToBeMoved/Pages/Page';

const ServerErrorPage = () => {
  return (
    <Page className={'bg-white w-100 text-danger fs-1 justify-content-center'}>
      <div>Wystąpił błąd serwera. Prosimy, spróbuj ponownie później</div>
    </Page>
  );
};
export default ServerErrorPage;
