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

export const UserContext =
    createContext <null | {userData:UserData|null, setUserData:React.Dispatch<SetStateAction<UserData|null>>}>(null)


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

    return (
        <div className="vh-100">
            <PageBackground/>
            <PageHeader/>
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
