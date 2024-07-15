import React, {useEffect, useState} from 'react';
import './App.css';
import {useLocation} from "react-router-dom"
import PageHeader from "./Pages/PageHeader/PageHeader";
import './../scss/app.scss';
import Page from "./Pages/Page";
import {PathName as Path} from "./Tools/PathName";
import BusyEvent from "./CommonComponents/BusyEvent";
import UserDataManager from "./CommonComponents/UserDataManager";
import {Interceptors} from "./Tools/Api";
import RoleBasedRouting from "./RoleBasedRouting";


function App() {
    const {userData, ForceLogout, UserLoggedIn} = UserDataManager();
    const {SetInterceptors} = Interceptors()
    const {ResetBusyState, isBusy} = BusyEvent()
    const OnAppStart = () => {

        const [isLoaded, setIsLoaded] = useState(false)
        if (!isLoaded) {
            setIsLoaded(true)
            SetInterceptors()
        }
    }

    OnAppStart()


    const DisplayIfBuisy = () => {
       return isBusy ? "" : "d-none"
    }
    const DisplayIfNotBuisy = () => {
        return !isBusy ? "" : "d-none"
    }

    const WaitingPage = () => {
        return(
        <Page className={`justify-content-center  bg-white`}>
            <div className={"d-flex m-5 flex-column"}>
                <div className={"h1"}>{isBusy}</div>
                <div className={"loadSpinner align-self-center m-5"}></div>
            </div>
        </Page>
        )
    }

    const [pageHeaderText, _setPageHeaderText] = useState<string|null>(null)

    const location = useLocation();
    const [currentLocation, setCurrentLocation] = useState("")
    const setPageHeaderText = () => {
        var text = null
        switch (location.pathname){
            case Path.NewForm:

                break
            default:
                if (UserLoggedIn())
                    text = `Witaj ${userData!.firstName}`
                break
        }
        _setPageHeaderText(text)
    }
    useEffect(()=>{
        if(currentLocation != location.pathname) {
            setPageHeaderText()
            ResetBusyState()
            setCurrentLocation(location.pathname)
        }


    }, [location, UserLoggedIn])


    return (
        <div className="vh-100">
            <PageHeader text={pageHeaderText} />
            <div className={DisplayIfNotBuisy() + " h-100"}> <RoleBasedRouting/> </div>
            <div className={DisplayIfBuisy() + " w-100"}> <WaitingPage/> </div>
        </div>
    );
}


export default App;
