import React, {createContext, SetStateAction, useState} from 'react';
import './App.css';
import PageHeader from "./Pages/PageHeader/PageHeader";
import './../scss/app.scss';
import BusyEvent from "./CommonComponents/BusyEvent";
import {Interceptors} from "./Tools/Api";
import RoleBasedRouting from "./RoleBasedRouting";
import WaitingPage from "./Pages/WaitingPage";
import PageBackground from "./CommonComponents/PageBackground";
import {UserData} from "./CommonComponents/DataTypes";
import {useLocation} from "react-router-dom";

export const UserContext =
    createContext <null | {userData:UserData|null, setUserData:React.Dispatch<SetStateAction<UserData|null>>}>(null)


export const OpenedWithLocation = () => {
    const { search} = useLocation();
    const searchParams = new URLSearchParams(search);
    return searchParams.get('data')!= null;
}

const AppContent = () => {
    const {SetInterceptors} = Interceptors()
    const {DisplayIfBuisy, DisplayIfNotBuisy} = BusyEvent()
    const OnAppStart = () => {
        const [isLoaded, setIsLoaded] = useState(false)
        if (!isLoaded) {
            setIsLoaded(true)
            SetInterceptors()
        }
    }

    OnAppStart()

    const openedWithLocation = OpenedWithLocation()
    return (
        <div className="vh-100">
            <PageBackground/>
            {!openedWithLocation && <PageHeader/>}
            <div className={DisplayIfNotBuisy() + " h-100"}><RoleBasedRouting/></div>
            <div className={DisplayIfBuisy() + " w-100"}><WaitingPage/></div>
        </div>
    )
}

function App() {
    const [userData, setUserData] = useState<UserData|null>(null)

    return (
        <UserContext.Provider value={{userData, setUserData}}>
            <AppContent/>
        </UserContext.Provider>
    );
}


export default App;
