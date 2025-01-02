import {useState} from 'react';
import {FieldValues} from 'react-hook-form';
import {Link} from 'react-router-dom';
import {ErrorMessageIfPresentNoContext,} from '@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext';
import userDataManager from '../../../../ToBeMoved/CommonComponents/UserDataManager';
import useFormWrapper from '../../../../ToBeMoved/CommonComponents/useFormWrapper';
import axios from 'axios';
import {Path} from '../../../../ToBeMoved/Tools/Path';

// TODO: [Not important] Switch to useContext(FormContext)
function LoginForm() {
    const { Login } = userDataManager();
    const [loginError, setLoginError] = useState<null | string>(null);
    const {
        handleSubmit,
        ClearField,
        setDisabled,
        EmailTextInput,
        PasswordTextInput,
        CommonSubmitButton,
        RegisterLink,
    } = useFormWrapper();

    const BeforeSubmit = () => {
        setDisabled(true);
        setLoginError(null);
    };

    const AfterError = () => {
        ClearField('password');
        setDisabled(false);
    };

    const HandleLoginError = (error: unknown) => {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response?.status === 401) {
                setLoginError('Podano błędne hasło lub użytkownik nie istnieje');
            } else {
                setLoginError(
                    'Wystąpił problem z zalogowaniem, spróbuj ponownie później',
                );
            }
        }
        AfterError();
    };
    const onSubmit = async (credentials: FieldValues) => {
        BeforeSubmit();
        try {
            await Login(credentials);
        } catch (error) {
            HandleLoginError(error);
        }
    };
    const ForgetPasswordLink = () => {
        return (
            <Link className="forget-password-link" to={Path.ForgotPassword}>
                Nie pamiętam hasła
            </Link>
        );
    };

    const LoginButton = () => {
        return <CommonSubmitButton label={'Zaloguj się'} />;
    };

    return (
        <>
            <h1 className={'login-common-header'}>Logowanie</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <EmailTextInput />
                <PasswordTextInput />
                <ForgetPasswordLink />
                <LoginButton />
                {loginError && <ErrorMessageIfPresentNoContext message={loginError} />}
                <RegisterLink />
            </form>
        </>
    );
}

export default LoginForm;
