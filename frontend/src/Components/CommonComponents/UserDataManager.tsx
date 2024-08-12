import Api from "../Tools/Api";
import {useEffect, useState} from "react";
import {UserData} from "./DataTypes";
import useCustomEvent from "../Tools/useCustomEvent";
import {useLocation, useNavigate} from "react-router-dom";
import {PathName as Path} from "../Tools/PathName";
import {CopyResponseToSessionStorage} from "../Misc";
import {FieldValues} from "react-hook-form";

const UserDataManager = () => {
    const navigate = useNavigate()
    const [userData, setUserData] = useState<UserData | null >(null)
    const { dispatchEvent:logoutDispatcher, addEventListener:logoutListener } = useCustomEvent('logoutSuccessful');
    const { addEventListener:loginListener, dispatchEvent:loginDispatcher } = useCustomEvent('loginSuccessful');

    useEffect(
        () => {
            const unsubscribeLogin = loginListener(GetUserData);
            window.addEventListener('load', GetUserData);
            return () => {
                unsubscribeLogin();
                window.removeEventListener('load', GetUserData);
            };
        },
        [loginListener, 'load']
    );

    useEffect(()=>{
        const unsubscribeLogout = logoutListener(() => {
            sessionStorage.clear()
            setUserData(null)
        });
        return () => {
            unsubscribeLogout();
        };
    }, [logoutListener])

    const GetUserData = async () => {
        if (UserLoggedIn()) {
            if(userData == null)
            await Api.get('/account')
                .then(response => setUserData(response?.data))
        } else setUserData(null)
    }
    const Logout = () => {
        logoutDispatcher(null)
    }
    const Login = async (credentials: FieldValues) => {
          return await Api
                .post('/account/login', credentials, {raw: true})
                .then(response =>  {
                    CopyResponseToSessionStorage(response)
                    loginDispatcher(null)
                });
    }
    const Register = async (registerData:FieldValues) => {
        return Api
            .post('/account/register', registerData, {raw: true})
            .then((response: { status: number; data: any; }) => {
                return response.data;
            })
    }

    const ResetPassword = async (resetData: FieldValues) => {
        return Api.post('/account/resetPassword', resetData, {raw:true})
    }

    const { search} = useLocation();

    const ConfirmEmail = async () => {
        const searchParams = new URLSearchParams(search);
        const userIdParam = searchParams.get('userId');
        const codeParam = searchParams.get('code');
        return Api.get(`/account/emailConfirmation?userId=${userIdParam}&code=${codeParam}`, {raw:true})
    }

    const ChangePassword = async (changePasswordData:FieldValues) => {
            return Api.patch('/account/password', changePasswordData, {raw:true})
    }

    const ForceLogout = () => {
        Logout()
        navigate(Path.ForcedLogout)
    }
    const UserLoggedIn = () => {
        return sessionStorage.getItem("accessToken") != null
    }
    return {userData, Login, Logout, ForceLogout, UserLoggedIn, GetUserData, Register, ResetPassword, ConfirmEmail,
    ChangePassword}
}
export default UserDataManager