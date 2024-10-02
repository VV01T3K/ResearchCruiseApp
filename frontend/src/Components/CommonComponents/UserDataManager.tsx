import Api from "../Tools/Api";
import {useContext, useEffect, useState} from "react";
import useCustomEvent from "../Tools/useCustomEvent";
import {useLocation, useNavigate} from "react-router-dom";
import {Path as Path} from "../Tools/Path";
import {CopyResponseToSessionStorage} from "../Misc";
import {FieldValues} from "react-hook-form";
import {UserContext} from "../App";

const Register = async (registerData:FieldValues) =>
    Api.post('/account/register', registerData, {raw: true})
        .then((response: { status: number; data: any; }) =>  response.data)

const ResetPassword = async (resetData: FieldValues) =>
    Api.post('/account/resetPassword', resetData, {raw:true})

const ChangePassword = async (changePasswordData:FieldValues) =>
    Api.patch('/account/password', changePasswordData, {raw:true})

const IsUserLoggedIn = () =>  sessionStorage.getItem("accessToken") != null

const ConfirmEmail = () => {
    const { search} = useLocation();
    const searchParams = new URLSearchParams(search);
    const userIdParam = searchParams.get('userId');
    const codeParam = searchParams.get('code');
    return async () => Api.get(`/account/emailConfirmation?userId=${userIdParam}&code=${codeParam}`, {raw:true})
}


const UserDataManager = () => {
    const navigate = useNavigate()
    const userContext = useContext(UserContext)
    const { dispatchEvent:logoutDispatcher, addEventListener:logoutListener } = useCustomEvent('logoutSuccessful');
    const { addEventListener:loginListener, dispatchEvent:loginDispatcher } = useCustomEvent('loginSuccessful');

    // useEffect(() => {
    //     (GetUserData)()
    // }, []);

    // useEffect(
    //     () => {
    //         const unsubscribeLogin = loginListener(GetUserData);
    //         window.addEventListener('load', GetUserData);
    //         return () => {
    //             unsubscribeLogin();
    //             window.removeEventListener('load', GetUserData);
    //         };
    //     },
    //     [loginListener, 'load']
    // );
    //
    // useEffect(()=>{
    //     const unsubscribeLogout = logoutListener(() => {
    //         sessionStorage.clear()
    //         userContext!.setUserData(null)
    //     });
    //     return () => {
    //         unsubscribeLogout();
    //     };
    // }, [logoutListener])

    const GetUserData = async () => {
        if (IsUserLoggedIn()) {
            if(userContext!.userData == null)
                await Api.get('/account')
                    .then(response => userContext!.setUserData(response?.data))
        }
        else userContext!.setUserData(null)
    }
    const Logout = () => {
        sessionStorage.clear()
        userContext?.setUserData(null)
    }
    const Login = async (credentials: FieldValues) =>
        await Api.post('/account/login', credentials, {raw: true})
            .then(response =>  {
                    CopyResponseToSessionStorage(response)
                    GetUserData()
                });

    const ForceLogout = () => {
        Logout()
        navigate(Path.ForcedLogout)
    }
    const confirmMail = ConfirmEmail()

    return {userData:userContext!.userData, Login, Logout, ForceLogout, UserLoggedIn: IsUserLoggedIn, GetUserData, Register, ResetPassword, ConfirmEmail:confirmMail,
    ChangePassword}
}
export default UserDataManager