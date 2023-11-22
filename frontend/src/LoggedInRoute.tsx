import React  from 'react'
import {Navigate, Outlet} from 'react-router-dom'

function LoggedInRoute(props:{ userToken: string | null, redirectPath:string}){
    if (!props.userToken) {
        return <Navigate to={props.redirectPath} replace />;
    }
    return <Outlet />;
}
export default LoggedInRoute