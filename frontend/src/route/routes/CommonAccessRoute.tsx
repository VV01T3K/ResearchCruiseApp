import {Route} from "react-router-dom";
import {Path} from "../../ToBeMoved/Tools/Path";
import AccountPage from "@app/pages/Account/AccountPage";
import PriorityInformationPage from "@app/pages/PriorityInformationPage/PriorityInformationPage";

export const CommonAccessRoute = () => {
    return (
        <>
            {/*<Route path={Path.ForcedLogout} element={<LogoutPage />} />*/}
            <Route path={Path.AccountSettings} element={<AccountPage/>}/>
            <Route path={Path.PriorityInformation} element={<PriorityInformationPage/>}/>
        </>
    );
};