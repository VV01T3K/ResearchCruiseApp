import React, {useState} from 'react';
import Page from "../../Tools/Page";
import UserImg from "../../../resources/user.png"
import ErrorCode from "../../LoginPage/ErrorCode";
import {useForm} from "react-hook-form";


function AccountPage(props:{className?: string}){

    const credentials =  {name:"Will", surname:"Smith", mail:"www@ug.com", role:"admin"}

    const {
        register,
        handleSubmit,
        formState: { errors } } = useForm({
        mode: 'onBlur',
    });

    const handleEmailChange = () => {

    }
    const [ loading, setLoading ] = useState(false);
    const [changeMail, setChangeMail] = useState(false)
    const [changePassword, setChangePassword] = useState(false)
    return (
        <>
            <Page className={props.className + " justify-content-center "}>
                <div className="bg-white w-auto d-flex flex-column pb-1 m-2 center align-self-start justify-content-center p-2">
                   <h1 style={{fontSize:"2rem"}}>Ustwienia konta <span className={"text-danger"}> {errors ? "!":""}</span></h1>
                    <div className={"d-flex flex-row flex-wrap justify-content-center p-2 p-xl-5"}>
                        <div className={"d-flex p-2 justify-content-center col-12 col-xl-6"}>
                       <img style={{width:"200px"}} className={"align-self-start border border-5 rounded "}  src={UserImg}></img>
                        </div>
                        <div
                            className={" h4 col-12 col-xl-6 p-2 pt-3 d-flex flex-column justify-content-center justify-content-xl-start  text-center   "}>
                            <div className={" h6 "}>
                                {credentials["role"]}

                            </div>
                            <div className={"p-1  "}>
                                {credentials["name"] + " " + credentials["surname"]}
                                <ErrorCode code={"użytkownik nie został zaakceptowany"}/>
                            </div>

                            <div className={"p-1 h5"}>
                                {credentials["mail"]}
                                <ErrorCode code={"email nie został potwierdzony"}/>
                            </div>


                            <a onClick={() => setChangeMail(!changeMail)} className={" h6 "}>
                                Zmień e-mail
                            </a>
                            <form className={`p-0 h6   ${changeMail ? "" : "d-none"}`}
                                  onSubmit={handleSubmit(handleEmailChange)}>
                                <div className={"d-flex flex-row w-100"}>
                                    <input className={"p-0 w-100 "} type="text"
                                           disabled={loading} {...register("email", {
                                        required: "Pole wymagane", maxLength: 30, pattern: {
                                            value: /\b[A-Za-z0-9._%+-]+@ug\.edu\.pl\b/,
                                            message: 'Podaj adres e-mail z domeny @ug.edu.pl',
                                        }
                                    })}/>
                                    <button className={"d-inline-flex"} type={"submit"}/>
                                </div>
                                {errors["email"] && <ErrorCode code={errors["email"].message}/>}
                            </form>

                            <a onClick={() => setChangePassword(!changePassword)} className={" h6 "}>
                                Zmień hasło
                            </a>
                            <form className={`p-0 h6   ${changePassword ? "" : "d-none"}`}
                                  onSubmit={handleSubmit(handleEmailChange)}>
                                <div className={"d-flex flex-row w-100"}>
                                    <input className={"p-0 w-100 "} type="text"
                                           disabled={loading} {...register("password", {
                                        required: "Pole wymagane", maxLength: 30, pattern: {
                                            value: /\b[A-Za-z0-9._%+-]+@ug\.edu\.pl\b/,
                                            message: 'Podaj adres e-mail z domeny @ug.edu.pl',
                                        }
                                    })}/>
                                    <button className={"d-inline-flex"} type={"submit"}/>
                                </div>
                                {errors["email"] && <ErrorCode code={errors["email"].message}/>}
                            </form>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    )
}

export default AccountPage