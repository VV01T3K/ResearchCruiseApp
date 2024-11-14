import Api from '../../api/Api';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Path as Path } from '../Tools/Path';
import { CopyResponseToSessionStorage } from '../Misc';
import { FieldValues } from 'react-hook-form';
import { UserContext } from '../App';
import {
  registerUser,
  forgotPassword,
  resetPassword,
  getAccountData,
  getEmailConfirmation,
  loginUser,
} from '@api/requests';
import { changePassword } from '@api/requests';

const Register = registerUser;

const ForgotPassword = forgotPassword;
const ResetPassword = resetPassword;
const ChangePassword = changePassword;

export const IsUserLoggedIn = () =>
  sessionStorage.getItem('accessToken') != null;

const ConfirmEmail = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const userIdParam = searchParams.get('userId');
  const codeParam = searchParams.get('code');
  return async () => getEmailConfirmation(userIdParam, codeParam);
};

const UserDataManager = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const GetUserData = async () => {
    if (IsUserLoggedIn()) {
      if (userContext!.userData == null) {
        await getAccountData().then((response) =>
          userContext!.setUserData(response?.data)
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
    await loginUser(credentials).then((response) => {
      CopyResponseToSessionStorage(response);
      GetUserData();
    });

  const ForceLogout = () => {
    navigate(Path.ForcedLogout, { state: { forcedLogout: true } });
    // Logout();
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
    ForgotPassword: ForgotPassword,
    ResetPassword: ResetPassword,
    ConfirmEmail: confirmMail,
    ChangePassword,
  };
};
export default UserDataManager;
