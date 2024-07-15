import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {PathName as Path} from "./PathName";
import UserDataManager from "../CommonComponents/UserDataManager";
import BusyEvent from "../CommonComponents/BusyEvent";

const PageHeaderText = () => {
    const [pageHeaderText, _setPageHeaderText] = useState<string|null>(null)
    const {userData,UserLoggedIn} = UserDataManager()
    const location = useLocation();
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
        setPageHeaderText()
    }, [location, UserLoggedIn, 'load'])

    return {pageHeaderText}
}
export default PageHeaderText
