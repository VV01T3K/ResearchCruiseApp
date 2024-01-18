import React  from 'react'
import {Navigate, Outlet} from 'react-router-dom'

function LoggedInRoute(props:{ auth: string | null, redirectPath:string, role:string}){
    if (!(props.auth.role==props.role)) {
        return <Navigate to={props.redirectPath} replace />;
    }
    return <Outlet />;
}
export default LoggedInRoute