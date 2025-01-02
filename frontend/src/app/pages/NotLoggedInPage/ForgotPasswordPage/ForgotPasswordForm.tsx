import {useState} from 'react';
import {FieldValues} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';

import {ErrorMessageIfPresentNoContext,} from '@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext';
import userDataManager from '../../../../ToBeMoved/CommonComponents/UserDataManager';
import useFormWrapper from '../../../../ToBeMoved/CommonComponents/useFormWrapper';
import {Path} from '../../../../ToBeMoved/Tools/Path';

function ForgotPasswordForm() {
    const { ForgotPassword } = userDataManager();
    const {
        handleSubmit,
        EmailTextInput,
        ConfirmButton,
        RegisterLink,
        setDisabled,
        ReturnToLoginLink,
    } = useFormWrapper();
    const [resetError, setError] = useState<null | string>(null);
    const [resetEnablingSuccessful, setResetEnablingSuccessful] = useState(false);

    const navigate = useNavigate();
    const onSubmit = async (data: FieldValues) => {
        setDisabled(true);
        try {
            await ForgotPassword(data);
            setResetEnablingSuccessful(true);
        } catch (e) {
            setError('Wystąpił problem z resetowaniem hasła');
            setDisabled(false);
        }
    };

    const onSubmitWhenSuccess = () => {
        navigate(Path.Default);
    };

    const RememberPasswordLink = () => {
        return (
            <Link className="forget-password-link" to={Path.Default}>
                Znasz hasło?
            </Link>
        );
    };

    const DefaultForm = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <EmailTextInput />
                <RememberPasswordLink />
                <ConfirmButton />
                {resetError && <ErrorMessageIfPresentNoContext message={resetError} />}
                <RegisterLink />
            </form>
        );
    };

    const FormAfterResetSuccess = () => {
        return (
            <form onSubmit={handleSubmit(onSubmitWhenSuccess)}>
                <div className={'signup-link'}>
                    Jeśli konto istnieje, został wysłany link do zmiany hasła na podany
                    adres e-mail
                </div>
                <ReturnToLoginLink />
            </form>
        );
    };

    return (
        <>
            <h1 className={'login-common-header'}>Resetowanie hasła</h1>
            {!resetEnablingSuccessful && <DefaultForm />}
            {resetEnablingSuccessful && <FormAfterResetSuccess />}
        </>
    );
}

export default ForgotPasswordForm;
