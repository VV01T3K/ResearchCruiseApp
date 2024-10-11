import useFormWrapper from '../../../ToBeMoved/CommonComponents/useFormWrapper';
import { useNavigate } from 'react-router-dom';
import { Path } from '../../../ToBeMoved/Tools/Path';
import Page from '../../../ToBeMoved/Pages/Page';

function LogoutPage() {
  const { ReturnToLoginLink } = useFormWrapper();
  const navigate = useNavigate();

  const LogoutForm = () => {
    return (
      <form onSubmit={() => navigate(Path.Default)}>
        <div className={'text-submit'}>Nastąpiło wylogowanie</div>
        <ReturnToLoginLink />
      </form>
    );
  };
  return (
    <Page className={'login-common'}>
      <LogoutForm />
    </Page>
  );
}

export default LogoutPage;
