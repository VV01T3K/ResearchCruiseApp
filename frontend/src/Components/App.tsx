import React, {useEffect, useState} from 'react';
import './App.css';
import LoginPage from "./Pages/LoginPage/LoginPage";
import {Route, Routes, useNavigate} from "react-router-dom"
import AdminPanel from "./Pages/HomePage/AdminPanel"
import PageHeader from "./Pages/PageHeader/PageHeader";
import NewFormPage from "./Pages/NewFormPage/NewFormPage";
import './../scss/app.scss';
import FormB from "./Pages/FormPage/Forms/FormB";
import FormC from "./Pages/FormPage/Forms/FormC";
import ManagerPanel from "./Pages/HomePage/ManagerPanel";
import ShipOwnerPanel from "./Pages/HomePage/ShipOwnerPanel";
import LogoutPage from "./Pages/LoginPage/LogoutPage";
import AccountPage from "./Pages/AccountPage/AccountPage";
import ManageUsersPage from "./Pages/ManageUsersPage/ManageUsersPage";
import EmailConfirmPage from "./Pages/LoginPage/EmailConfirmPage";
import Api from "./Tools/Api";
import useCustomEvent from "./Tools/useCustomEvent";
import Page from "./Pages/Page";
import MessagesPage from "./Pages/MessagesPage/MessagesPage";
import SavedFormPage from "./Pages/SavedFormsPage/SavedFormPage";
import {setUpInterceptors} from "./Tools/Api";
import ApplicationDetailsPage from "./Pages/ApplicationDetailsPage/ApplicationDetailsPage";
import ApplicationsPage from "./Pages/ApplicationsPage/ApplicationsPage";
import FormPage from "./Pages/FormPage/FormPage";
import CruisesPage from "./Pages/CruisesPage/CruisesPage"

function App() {

    const { addEventListener:loginListener, dispatchEvent } = useCustomEvent('loginSuccessful');
    const { addEventListener:logoutListener } = useCustomEvent('logoutSuccessful');
    const { addEventListener:busyListener } = useCustomEvent('busy')
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

    const [isBusy, setIsBusy] = useState<null|string>(null)
    useEffect(()=>{
        const unsubscribeBusy = busyListener((data:null|string) => {
            setIsBusy(data)
        });
        return () => {
            unsubscribeBusy();
        };
    }, [busyListener])

    const [state, setState] = useState({
        action: history.action,
        location: history.location
    });

    const navigate = useNavigate()
    const [isLoaded, setIsLoaded] = useState(false)

    if (!isLoaded) {
        setIsLoaded(true)
        setUpInterceptors(navigate, setUserData)
    }
    return (
        <div className="vh-100">
            <PageHeader name={userData ? userData.firstName : null} />
            <div className={`${isBusy ? "d-none":" h-100"}`}>
            <Routes  >
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
                            <Route path="/Cruises" element={<CruisesPage />} />
                            <Route path="/NewForm" element={<NewFormPage />} />
                            <Route path="/Form" element={<FormPage />} />
                            <Route path="/FormB" element={<FormB />} />
                            <Route path="/FormC" element={<FormC />} />
                            <Route path="/ManageUsers" element={<ManageUsersPage />} />
                            <Route path="/*" element={<AdminPanel />} />
                            <Route path="/Messages" element={<MessagesPage />} />
                            <Route path="/Applications" element={<ApplicationsPage />} />
                            <Route path="/ApplicationDetails" element={<ApplicationDetailsPage />} />
                        </>
                    }
                    {userData && userData["roles"].includes("CruiseManager") &&
                        <>
                            <Route path="/NewForm" element={<NewFormPage />} />
                            <Route path="/FormB" element={<FormB />} />
                            <Route path="/FormC" element={<FormC />} />
                            <Route path="/*" element={<ManagerPanel />} />
                        </>
                    }
                {userData != null && true &&

                    <>
                        <Route path="/forcedLogout" element={<LogoutPage />} />

                        <Route path="/serverError" element={<Page className={"bg-white w-100 text-danger fs-1 justify-content-center"}><div>server error</div></Page>} />
                        <Route path="/AccountSettings" element={<AccountPage userData={userData} />} />

                    </>
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
            <div className={`${isBusy ? "" : "d-none"}`}>
            <Page className={`justify-content-center  bg-white`}>
                <div className={"d-flex m-5 flex-column"}>
                    <div className={"h1"}>{isBusy}</div>
                    <div className={"loadSpinner align-self-center m-5"}></div>
                </div>
            </Page>
            </div>
        </div>
    );
}


export default App;
