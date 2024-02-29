import React, {useEffect, useState} from 'react';
import './App.css';
import LoginPage from "./LoginPage/LoginPage";
import {Route, Routes} from "react-router-dom"
import AdminPanel from "./HomePage/AdminPanel"
import PageHeader from "./PageHeader/PageHeader";
import NewFormPage from "./NewFormPage/NewFormPage";
import FormA0 from "./Forms/FormA0";
import 'bootstrap/dist/css/bootstrap.min.css';
import FormB0 from "./Forms/FormB0";
import FormC0 from "./Forms/FormC0";
import ManagerPanel from "./HomePage/ManagerPanel";
import ShipOwnerPanel from "./HomePage/ShipOwnerPanel";
import LogoutPage from "./LoginPage/LogoutPage";
import AccountPage from "./AccountPage/AccountPage";
import ManageUsersPage from "./ManageUsersPage/ManageUsersPage";
import EmailConfirmPage from "./LoginPage/EmailConfirmPage";
// import {TestPage} from "./TestPage/TestPage";
import Api from "./Tools/Api";
import useCustomEvent from "./Tools/useCustomEvent";

function App() {

    const { addEventListener:loginListener } = useCustomEvent('loginSuccessful');
    const { addEventListener:logoutListener } = useCustomEvent('logoutSuccessful');

    interface UserData {
        roles: string[];
        firstName: string;
    }

    const [userData, setUserData] = useState<UserData|null>(null)

    useEffect(() => {
        const getUserData = () => {
            if(sessionStorage.getItem("accessToken"))
                Api.get('/account')
                    .then(response=>setUserData(response.data))
        }

        const unsubscribeLogin = loginListener(() => {
            getUserData();
        });

        const unsubscribeLogout = logoutListener(() => {
            sessionStorage.clear()
            setUserData(null)
        });
        window.addEventListener('load', getUserData);

        return () => {
            unsubscribeLogin();
            unsubscribeLogout();
            window.removeEventListener('load', getUserData);

        };
    }, [loginListener, logoutListener, 'load']);

    return (
        <div className={`vh-100`}>
            <PageHeader name={userData ? userData.firstName:null}/>
            <Routes>
                    { userData && userData["roles"].includes("Shipowner") && <>
                        <Route path="/NewForm" element={<NewFormPage/>}/>
                        <Route path="/FormA" element={<FormA0/>}/>
                        <Route path="/ManageUsers" element={<ManageUsersPage/>}/>
                        <Route path="/*" element={<ShipOwnerPanel/>}/>
                    </>
                    }
                    { userData && userData["roles"].includes("Administrator") &&<>
                        <Route path="/NewForm" element={<NewFormPage/>}/>
                        <Route path="/FormA" element={<FormA0/>}/>
                        <Route path="/FormB" element={<FormB0/>}/>
                        <Route path="/FormC" element={<FormC0/>}/>
                        <Route path="/ManageUsers" element={<ManageUsersPage/>}/>

                        <Route path="/*" element={<AdminPanel/>}/>
                    </>
                    }
                    { userData && userData["roles"].includes("CruiseManager") &&<>
                        <Route path="/NewForm" element={<NewFormPage/>}/>
                        <Route path="/FormA" element={<FormA0/>}/>
                        <Route path="/FormB" element={<FormB0/>}/>
                        <Route path="/FormC" element={<FormC0/>}/>
                        <Route path="/*" element={<ManagerPanel/>}/>
                    </>
                    }
                { userData != null &&
                    <Route path={"/AccountSettings"} element={<AccountPage userData={userData}/>}/> }
                { userData == null &&
                    <>
                    <Route path="/*" element={<LoginPage/>}/>
                    <Route path="/forcedLogout" element={<LogoutPage/>}/> </>}
                <Route path="/ConfirmEmail" element={<EmailConfirmPage/>}/>
                {/*<Route path="/Test" element={<TestPage/>}/>*/}
            </Routes>
        </div>
    );
}

export default App;
