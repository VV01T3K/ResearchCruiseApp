import {Route} from "react-router-dom";
import {Path} from "../../ToBeMoved/Tools/Path";
import ServerErrorPage from "@app/pages/ServerErrorPage";
import EmailConfirmPage from "@app/pages/NotLoggedInPage/EmailConfirmPage";

export const CommonRoute = () => {
    return (
        <>
            <Route path={Path.ServerError} element={<ServerErrorPage/>}/>
            <Route path={Path.ConfirmEmail} element={<EmailConfirmPage/>}/>
        </>
    );
};