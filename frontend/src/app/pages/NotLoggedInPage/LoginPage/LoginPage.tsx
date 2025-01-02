import {useEffect} from 'react';
import LoginForm from './LoginForm';
import Page from '../../../../ToBeMoved/Pages/Page';
import {extendedUseLocation} from '@hooks/extendedUseLocation';
import useFormWrapper from '../../../../ToBeMoved/CommonComponents/useFormWrapper';
import {useNavigate} from 'react-router-dom';
import {Path} from '../../../../ToBeMoved/Tools/Path';
import UserDataManager, {IsUserLoggedIn} from '../../../../ToBeMoved/CommonComponents/UserDataManager';

function LoginPage() {
    const location = extendedUseLocation();

    const { ReturnToLoginLink } = useFormWrapper();
    const navigate = useNavigate();
    const { Logout } = UserDataManager();

    useEffect(() => {
        if (IsUserLoggedIn() && !location?.state?.forcedLogout) {
            navigate(Path.Default);
        } else if (IsUserLoggedIn() && location?.state?.forcedLogout) {
            Logout();
        }
    });
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
            {(!location?.state?.forcedLogout) && <LoginForm />}
            {(location?.state?.forcedLogout) && <LogoutForm />}
        </Page>
    );
}

export default LoginPage;
