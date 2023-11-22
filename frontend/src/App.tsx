import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from "./LoginForm/LoginPage";
import { Route, Routes } from "react-router-dom"
import Home from "./Home";
import LoggedInRoute from "./LoggedInRoute";
import NotLoggedInRoute from "./NotLoggedInRoute";
function App() {
    const [userToken, setUserToken] = useState<string|null>(null);
    return (
        <div className={`App`}>
            <Routes>
                <Route element={<LoggedInRoute userToken={userToken} redirectPath={"/login"} />}>
                    <Route path="/*" element={<Home/>}/>
                </Route>
                <Route element={<NotLoggedInRoute userToken={userToken} redirectPath={"/"} />}>
                    <Route path="/login" element={<LoginPage setUserToken={setUserToken} />}/>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
