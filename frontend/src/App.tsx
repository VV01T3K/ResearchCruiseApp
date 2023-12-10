import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from "./LoginForm/LoginPage";
import { Route, Routes } from "react-router-dom"
import Home from "./Home";
import LoggedInRoute from "./LoggedInRoute";
import NotLoggedInRoute from "./NotLoggedInRoute";
import PageHeader from "./PageHeader/PageHeader";
function App() {
    const [userToken, setUserToken] = useState<string|null>(null);
    const [headerTitle, setTitle] = useState<string | null>(null)
    return (
        <div className={`App vh-100`}>
            <PageHeader title={headerTitle}></PageHeader>
            <Routes>
                <Route element={<LoggedInRoute userToken={userToken} redirectPath={"/login"} />}>
                    <Route path="/*" element={<Home setTitle = {setTitle}/>}/>
                </Route>
                <Route element={<NotLoggedInRoute userToken={userToken} redirectPath={"/"} />}>
                    <Route path="/login" element={<LoginPage setUserToken={setUserToken} setTitle = {setTitle} />}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
