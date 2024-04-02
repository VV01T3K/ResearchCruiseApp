import React, {useEffect, useState} from 'react';
import './App.css';
import LoginPage from "./LoginPage/LoginPage";
import {Route, Routes} from "react-router-dom"
import AdminPanel from "./HomePage/AdminPanel"
import PageHeader from "./PageHeader/PageHeader";
import NewFormPage from "./NewFormPage/NewFormPage";
import FormA0 from "./Forms/FormA0";
import './../scss/app.scss';
import FormB0 from "./Forms/FormB0";
import FormC0 from "./Forms/FormC0";
import ManagerPanel from "./HomePage/ManagerPanel";
import ShipOwnerPanel from "./HomePage/ShipOwnerPanel";
import LogoutPage from "./LoginPage/LogoutPage";
import AccountPage from "./AccountPage/AccountPage";
import ManageUsersPage from "./ManageUsersPage/ManageUsersPage";
import EmailConfirmPage from "./LoginPage/EmailConfirmPage";
import Api from "./Tools/Api";
import useCustomEvent from "./Tools/useCustomEvent";
import Page from "./Tools/Page";
import MessagesPage from "./MessagesPage/MessagesPage";
import SavedFormPage from "./SavedFormsPage/SavedFormPage";


function App() {

    const { addEventListener:loginListener, dispatchEvent } = useCustomEvent('loginSuccessful');
    const { addEventListener:logoutListener } = useCustomEvent('logoutSuccessful');

    interface UserData {
        roles: string[];
        firstName: string;
    }

    const [userData, setUserData] = useState<UserData | null | undefined>(undefined)

    const logout = () => {
        sessionStorage.clear()
        setUserData(null)
    }
    const getUserData = async () => {
        if (sessionStorage.getItem("accessToken")) {
             await Api.get('/account')
                .then(response => setUserData(response.data)).catch((err)=>{})
        } else setUserData(null)
    }

    useEffect(
        () => {
            const unsubscribeLogin = loginListener(getUserData);
            window.addEventListener('load', getUserData);
            return () => {
                unsubscribeLogin();
                window.removeEventListener('load', getUserData);
            };
        },
        [loginListener, 'load']
    );

    useEffect(()=>{
        const unsubscribeLogout = logoutListener(() => {
         logout()
        });
        return () => {
            unsubscribeLogout();
        };
    }, [logoutListener])
    return (
        <div className="vh-100">
            <PageHeader name={userData ? userData.firstName : null} />
            <Routes>
                    {userData && userData["roles"].includes("Shipowner") &&
                        <>
                            <Route path="/NewForm" element={<NewFormPage />} />
                            <Route path="/ManageUsers" element={<ManageUsersPage />} />
                            <Route path="/*" element={<ShipOwnerPanel />} />
                        </>
                    }
                    {userData && userData["roles"].includes("Administrator") &&
                        <>
                            <Route path="/SavedForms" element={<SavedFormPage />} />
                            <Route path="/NewForm" element={<NewFormPage />} />
                            <Route path="/FormB" element={<FormB0 />} />
                            <Route path="/FormC" element={<FormC0 />} />
                            <Route path="/ManageUsers" element={<ManageUsersPage />} />
                            <Route path="/*" element={<AdminPanel />} />
                            <Route path="/Messages" element={<MessagesPage/>}/>
                        </>
                    }
                    {userData && userData["roles"].includes("CruiseManager") &&
                        <>
                            <Route path="/NewForm" element={<NewFormPage />} />
                            <Route path="/FormB" element={<FormB0 />} />
                            <Route path="/FormC" element={<FormC0 />} />
                            <Route path="/*" element={<ManagerPanel />} />
                        </>
                    }
                {userData != null && true &&
                    <Route path="/AccountSettings" element={<AccountPage userData={userData} />} />
                }
                {userData === null &&
                    <>
                        <Route path="/*" element={<LoginPage />} />
                        <Route path="/forcedLogout" element={<LogoutPage />} />
                    </>
                }
                {userData === undefined &&
                    <Route path="/*" element={<Page />} />
                }
                <Route path="/ConfirmEmail" element={<EmailConfirmPage />} />
                {/*<Route path="/Test" element={<TestPage/>}/>*/}
            </Routes>
        </div>
    );
}


export default App;
