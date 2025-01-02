import {useState} from 'react';
import {FieldValues} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

import {ErrorMessageIfPresentNoContext,} from '@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext';
import userDataManager from '../../../../ToBeMoved/CommonComponents/UserDataManager';
import useFormWrapper from '../../../../ToBeMoved/CommonComponents/useFormWrapper';
import {Path} from '../../../../ToBeMoved/Tools/Path';
import {ResetPasswordData} from "ResetPasswordData";

function ResetPasswordForm() {
    const { ResetPassword } = userDataManager();
    const {
        handleSubmit,
        PasswordTextInput,
        ConfirmPasswordTextInput,
        ConfirmButton,
        setDisabled,
        ReturnToLoginLink,
    } = useFormWrapper();
    const [resetError, setError] = useState<null | string>(null);
    const [resetSuccessful, setResetSuccessful] = useState(false);

    const queryParams = new URLSearchParams(window.location.search);
    const resetCode = queryParams.get('resetCode');
    const emailBase64 = queryParams.get('emailBase64');

    const navigate = useNavigate();
    const onSubmit = async (fieldValues: FieldValues) => {
        setDisabled(true);
        try {
            const resetPasswordData: ResetPasswordData | undefined = createResetPasswordData(fieldValues);
            if (resetPasswordData) {
                await ResetPassword(resetPasswordData);
                setResetSuccessful(true);
            }
            else {
                setError('Wystąpił problem z resetowaniem hasła');
                setDisabled(false);
            }
        } catch (e) {
            setError('Wystąpił problem z resetowaniem hasła');
            setDisabled(false);
        }
    };

    const onSubmitWhenSuccess = () => {
        navigate(Path.Default);
    };

    const DefaultForm = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <PasswordTextInput />
                <ConfirmPasswordTextInput />
                <ConfirmButton />
                {resetError && <ErrorMessageIfPresentNoContext message={resetError} />}
            </form>
        );
    };

    const FormAfterResetSuccess = () => {
        return (
            <form onSubmit={handleSubmit(onSubmitWhenSuccess)}>
                <div className={'signup-link'}>
                    Hasło zostało pomyślnie zmienione.
                </div>
                <ReturnToLoginLink />
            </form>
        );
    };

    const createResetPasswordData = (fieldValues: FieldValues): ResetPasswordData | undefined => {
        if (!emailBase64 || !resetCode) {
            return undefined;
        }

        return {
            password: fieldValues.password,
            passwordConfirm: fieldValues.passwordConfirm,
            emailBase64: emailBase64,
            resetCode: resetCode
        }
    };

    return (
        <>
            <h1 className={'login-common-header'}>Resetowanie hasła</h1>
            {!resetSuccessful && <DefaultForm />}
            {resetSuccessful && <FormAfterResetSuccess />}
        </>
    );
}

export default ResetPasswordForm;
