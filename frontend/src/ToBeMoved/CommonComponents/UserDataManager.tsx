import Api from '../../api/Api';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Path as Path } from '../Tools/Path';
import { CopyResponseToSessionStorage } from '../Misc';
import { FieldValues } from 'react-hook-form';
import { UserContext } from '../App';
import { registerUser, resetPassword } from '@api/requests';
import { changePassword } from '@api/requests';

const Register = registerUser;

const ResetPassword = resetPassword;
const ChangePassword = changePassword;

export const IsUserLoggedIn = () =>
    sessionStorage.getItem('accessToken') != null;

const ConfirmEmail = () => {
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const userIdParam = searchParams.get('userId');
    const codeParam = searchParams.get('code');
    return async () =>
        Api.get(
            `/account/emailConfirmation?userId=${userIdParam}&code=${codeParam}`,
            { raw: true },
        );
};

const UserDataManager = () => {
    const navigate = useNavigate();
    const userContext = useContext(UserContext);

    const GetUserData = async () => {
        if (IsUserLoggedIn()) {
            if (userContext!.userData == null) {
                await Api.get('/account').then((response) =>
                    userContext!.setUserData(response?.data),
                );
            }
        } else {
            userContext!.setUserData(null);
        }
    };
    const Logout = () => {
        sessionStorage.clear();
        userContext?.setUserData(null);
    };
    const Login = async (credentials: FieldValues) =>
        await Api.post('/account/login', credentials, { raw: true }).then(
            (response) => {
                CopyResponseToSessionStorage(response);
                GetUserData();
            },
        );

    const ForceLogout = () => {
        navigate(Path.Default, { state: { forcedLogout: true } });
        Logout();
    };
    const confirmMail = ConfirmEmail();

    return {
        userData: userContext!.userData,
        Login,
        Logout,
        ForceLogout,
        UserLoggedIn: IsUserLoggedIn,
        GetUserData,
        Register,
        ResetPassword,
        ConfirmEmail: confirmMail,
        ChangePassword,
    };
};
export default UserDataManager;
