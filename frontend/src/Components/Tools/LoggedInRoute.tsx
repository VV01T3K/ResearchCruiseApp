import React  from 'react'
import {Navigate, Outlet} from 'react-router-dom'

function LoggedInRoute(props:{ auth: string | null, redirectPath:string}){
    if (!props.auth) {
        return <Navigate to={props.redirectPath} replace />;
    }
    return <Outlet />;
}
export default LoggedInRoute