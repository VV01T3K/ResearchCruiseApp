import React, {useState} from 'react';
import './App.css';
import PageHeader from "./Pages/PageHeader/PageHeader";
import './../scss/app.scss';
import BusyEvent from "./CommonComponents/BusyEvent";
import {Interceptors} from "./Tools/Api";
import RoleBasedRouting from "./RoleBasedRouting";
import WaitingPage from "./Pages/WaitingPage";


function App() {
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
            <PageHeader/>
            <div className={DisplayIfNotBuisy() + " h-100"}> <RoleBasedRouting/> </div>
            <div className={DisplayIfBuisy() + " w-100"}> <WaitingPage/> </div>
        </div>
    );
}


export default App;
