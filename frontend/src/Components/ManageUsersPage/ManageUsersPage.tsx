import React, {useEffect, useState} from 'react';
import Page from "../Tools/Page";
import UserImg from "../../resources/user.png"
import ErrorCode from "../LoginPage/ErrorCode";
import {FieldValues, useForm} from "react-hook-form";
import {multiValueLabelCSS} from "react-select/dist/declarations/src/components/MultiValue";


function ManageUsersPage(props:{className?: string}){
    const [ loading, setLoading ] = useState(false);
    const [ loading2, setLoading2 ] = useState(false);


    const [userList, setUserList] = useState( [])//

    useEffect(() => {
        async function getCredentials() {
            try {
                const  response = await fetch('http://localhost:8080/Users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(sessionStorage.getItem("auth")!)["accessToken"]}`,
                    },
                })
                    .then(data => {
                       return data.json();
                    })
                setUserList(response);
            }
            catch (e){
                setUserList({user1: {firstName:"Wills", lastName:"Smith", mail:"www@ug.com", role:"admin"}, user2: {name:"sss", surname:"Smith", mail:"www@ug.com", role:"admin"}})
            }
        }
        // Wywołaj funkcję do pobierania danych po zamontowaniu komponentu
        getCredentials();
    }, [])





    return (
        <>
            <Page className={props.className + " justify-content-center "}>
                <div className="bg-white w-100 d-flex flex-column pb-1 m-2 center align-self-start justify-content-center p-2">
                   <h1 style={{fontSize:"2rem"}}>Zarządzanie użytkownikami</h1>
                    <div className={"d-flex flex-column flex-wrap justify-content-center  p-2 p-xl-5 align-items-center"}>
                        {Object.entries(userList).map(([key, value])=>(
                            <div key={key} className={"border border-3 w-100 text-center d-flex flex-row flex-wrap"}>
                                <div className={"col-12 col-xl-3 bg-dark text-white"}>{key}</div>
                                {Object.entries(value).map(([key, value])=>(<div key={key} className={"col-12 col-xl-2 border"}>{key} : {value}</div>))}
                                {/*{user[0]} : {user[1].name}  {user[1].surname},  {user[1].mail},  {user[1].role}*/}
                            </div>
                        ))}
                    </div>
                </div>
            </Page>
        </>
    )
}

export default ManageUsersPage