import React, {useEffect, useState} from "react";
import UserDataManager from "./UserDataManager";

const CurrentPageBackground = () => {
    const [pageBackground, _setpageBackground] = useState<string>("default-bg")
    const {UserLoggedIn} = UserDataManager()
    // const location = useLocation();
    const setPageBackground = () => {
        var image = "default-bg";
        if(!UserLoggedIn())
            image = "default-bg-stretch"
        else{
            // switch (location.pathname){
            //     case Path.Default:
            //         break // May be page specific
            // }
        }
        if(pageBackground!=image)
            _setpageBackground(image)
    }

    useEffect(()=>{
        setPageBackground()
    }, [location, UserLoggedIn, 'load'])

    return {pageBackgroundImage:pageBackground}
}

export default function PageBackground() {
    const {pageBackgroundImage} = CurrentPageBackground()
    return (
        <div className={pageBackgroundImage}/>
    )
}