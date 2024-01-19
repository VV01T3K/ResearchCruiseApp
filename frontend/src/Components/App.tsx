import React, {useEffect, useState} from 'react';
import './App.css';
import LoginPage from "./LoginPage/LoginPage";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom"
import AdminPanel from "./HomePage/AdminPanel"
import LoggedInRoute from "./Tools/LoggedInRoute";
import NotLoggedInRoute from "./Tools/NotLoggedInRoute";
import PageHeader from "./PageHeader/PageHeader";
import useAuth from "./Tools/useAuth";
import NewFormPage from "./NewFormPage/NewFormPage";
import FormA0 from "./Forms/FormA0";
import 'bootstrap/dist/css/bootstrap.min.css';
import FormB0 from "./Forms/FormB0";
import FormC0 from "./Forms/FormC0";
import ManagerPanel from "./HomePage/ManagerPanel";
import ShipOwnerPanel from "./HomePage/ShipOwnerPanel";
import RegisterForm from "./LoginPage/RegisterForm";
import LogoutPage from "./LoginPage/LogoutPage";
import AccountPage from "./AccountPage/AccountPage";
import ManageUsersPage from "./ManageUsersPage/ManageUsersPage";
import EmailConfirmPage from "./LoginPage/EmailConfirmPage";

function App() {
    const navigate = useNavigate()
    const {auth, setAuth} = useAuth(navigate)

    return (
        <div className={`vh-100`}>
            <PageHeader auth={null}></PageHeader>
            <Routes>
                {/*<Route element={<LoggedInRoute auth={auth} redirectPath={"/login"} />}>*/}
                    { auth != null && auth.role=="shipOwner" && <>
                        <Route path="/NewForm" element={<NewFormPage/>}/>
                        <Route path="/FormA" element={<FormA0/>}/>
                        <Route path="/ManageUsers" element={<ManageUsersPage/>}/>
                        <Route path="/*" element={<ShipOwnerPanel setAuth={setAuth}/>}/>
                    </>
                    }
                    { auth != null && auth.role=="admin" &&<>
                        <Route path="/NewForm" element={<NewFormPage/>}/>
                        <Route path="/FormA" element={<FormA0/>}/>
                        <Route path="/FormB" element={<FormB0/>}/>
                        <Route path="/FormC" element={<FormC0/>}/>
                        <Route path="/*" element={<AdminPanel setAuth={setAuth}/>}/>
                    </>
                    }
                    { auth != null && auth.role=="manager" &&<>
                        <Route path="/NewForm" element={<NewFormPage/>}/>
                        <Route path="/FormA" element={<FormA0/>}/>
                        <Route path="/FormB" element={<FormB0/>}/>
                        <Route path="/FormC" element={<FormC0/>}/>
                        <Route path="/*" element={<ManagerPanel setAuth={setAuth}/>}/>
                    </>
                    }
                    {/*{ auth == null &&<>*/}
                    {/*    <Route path="/*" element={<LogoutPage setAuth={setAuth} />}/>*/}
                    {/*</>*/}
                    {/*}*/}
                { auth != null &&
                    <Route path={"/AccountSettings"} element={<AccountPage/>}/> }
                {/*</Route>*/}
                {/*<Route element={<NotLoggedInRoute auth={auth} redirectPath={"/"} />}>*/}
                { auth == null &&
                    <>
                    <Route path="/*" element={<LoginPage setAuth={setAuth} />}/>
                    <Route path="/forcedLogout" element={<LogoutPage/>}/> </>}
                {/*</Route>*/}
                <Route path="/ConfirmEmail/:token" element={<EmailConfirmPage/>}/>
            </Routes>
        </div>
    );
}

export default App;
