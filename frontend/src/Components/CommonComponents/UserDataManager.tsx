import Api from "../Tools/Api";
import {useEffect, useState} from "react";
import {UserData} from "./DataTypes";
import useCustomEvent from "../Tools/useCustomEvent";
import {useNavigate} from "react-router-dom";
import {PathName as Path} from "../Tools/PathName";

const UserDataManager = () => {
    const navigate = useNavigate()
    const [userData, setUserData] = useState<UserData | null >(null)
    const { dispatchEvent:logoutDispatcher, addEventListener:logoutListener } = useCustomEvent('logoutSuccessful');
    const { addEventListener:loginListener, dispatchEvent } = useCustomEvent('loginSuccessful');

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
    const ForceLogout = () => {
        Logout()
        navigate(Path.ForcedLogout)
    }
    const UserLoggedIn = () => {
        return sessionStorage.getItem("accessToken") != null
    }
    return {userData, Logout, ForceLogout, UserLoggedIn, GetUserData}
}
export default UserDataManager