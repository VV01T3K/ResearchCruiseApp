import React, {useEffect, useState} from 'react';
import Page from "../Page";
import UserImg from "../../../resources/user.png"
import ErrorCode from "../CommonComponents/ErrorCode";
import {FieldValues, useForm} from "react-hook-form";
import Api from "../../Tools/Api";


type Props = {
    className?: string,
    userData: { [x: string]: any; }
}


function AccountPage(props: Props) {
    const [loading2, setLoading2 ] = useState(false);

    // const [changeMailError, setChangeMailError] = useState<null|string>(null)
    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors } } = useForm({
    //     mode: 'onSubmit',
    // });


    // async function changeMail(data:FieldValues) {
    //     return fetch('http://localhost:8080/account/changeMail', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${JSON.parse(sessionStorage.getItem("auth")!)["accessToken"]}`,
    //         },
    //         body: JSON.stringify(data)
    //     })
    //         .then(data => {
    //             if(data.status == 401) setChangeMailError("Podano obecny adres e-mail");
    //             else if(!data.ok) setChangeMailError("Wystąpił problem ze zmianą adresu e-mail")
    //             else return data.json();
    //         })
    // }
    //
    // const handleMailChange =   async (data:FieldValues) => {
    //     setLoading(true);
    //     try {
    //         await changeMail(data);
    //         setChangeMailError(null)
    //         // setRegisterSuccessful(true)
    //     }
    //     catch (e){
    //         setChangeMailError("Wystąpił problem ze zmianą adresu e-mail, sprawdź połączenie z internetem")
    //     }
    //     setLoading(false)
    // }

    const [changePasswordError, setChangePasswordError] =
        useState<null | string>(null)
    const [changePasswordSuccess, setChangePasswordSuccess] =
        useState(false)

    const {
        watch,
        register: register2,
        handleSubmit: handleSubmit2,
        formState: { errors: errors2}
    } = useForm({
        mode: 'onBlur',
    });

    async function changePassword(data: FieldValues) {
        return Api
            .patch('/account', data)
            .then(response=> {
                if (response.status == 401)
                    throw new Error("Podano obecne hasło");
                else
                    return response.data
            })
    }

    const handlePasswordChange = async (data: FieldValues) => {
        const { password2, ...dataWithoutPassword2 } = data;
        setLoading2(true);

        try {
            await changePassword(dataWithoutPassword2);
            setChangePasswordError(null)
            setChangePasswordSuccess(true)
        }
        catch (e) {
            setChangePasswordError(e.message)
            setChangePasswordSuccess(false)
        }

        setLoading2(false)
    }

    useEffect(
        ()=> {
            setChangePasswordSuccess(false)
        },
        [watch])

    const [credentialsError, setCredentialsError] = useState()

    return (
        <>
            <Page className={props.className + " justify-content-center"}>
                <div className="bg-white w-100 d-flex flex-column pb-1 m-2 center align-self-start
                                justify-content-center p-2"
                >
                    <h1 style={{fontSize:"2rem"}}>Ustawienia konta</h1>

                    <div className="d-flex flex-row flex-wrap justify-content-center p-2 p-xl-5 align-items-center">
                        <div className="h4 col-12 col-xl-7 p-2 pt-3 d-flex flex-column justify-content-center
                                        justify-content-xl-start text-center"
                        >
                            <img style={{width: "300px"}}
                                 className="align-self-center border border-5 rounded m-2"
                                 src={UserImg}
                                 alt="Zdjęcie użytkownika"
                            />
                            <div className="h6">
                                {props.userData["role"]}
                            </div>
                            <div className="p-1">
                                {props.userData["firstName"] + " " + props.userData["lastName"]}
                                {!props.userData["accepted"] && <ErrorCode code="użytkownik nie został zaakceptowany" />}
                            </div>

                            <div className={"p-1 h5"}>
                                {props.userData["email"]}
                                {!props.userData["emailConfirmed"] && <ErrorCode code="email nie został potwierdzony" />}
                            </div>
                            {credentialsError && <ErrorCode code={credentialsError}/>}
                        </div>
                        <div className="h4 col-12 col-xl-5 p-2 pt-3 d-flex flex-column justify-content-center
                                        justify-content-xl-start text-center"
                        >
                            {/*<form className={`p-0 h6`}*/}
                            {/*      onSubmit={handleSubmit(handleMailChange)}>*/}
                            {/*    <div className="txt_field">*/}
                            {/*        <input type="text" disabled={loading} {...register("email", {*/}
                            {/*            required: "Pole wymagane", maxLength: 30, pattern: {*/}
                            {/*                value: /\b[A-Za-z0-9._%+-]+@ug\.edu\.pl\b/,*/}
                            {/*                message: 'Podaj adres e-mail z domeny @ug.edu.pl',*/}
                            {/*            }*/}
                            {/*        })}/>*/}
                            {/*        <span></span>*/}
                            {/*        <label>Adres e-mail</label>*/}
                            {/*    </div>*/}
                            {/*    {errors["email"] && <ErrorCode code={errors["email"].message}/>}*/}
                            {/*    <input className={loading ? "textAnim" : ""} type="submit" disabled={loading}*/}
                            {/*           value="Zmień adres email"/>*/}
                            {/*    {changeMailError && <ErrorCode code={changeMailError}/>}*/}
                            {/*</form>*/}

                            <form className="p-0 h6"
                                  onSubmit={handleSubmit2(handlePasswordChange)}
                            >
                                <div className="txt_field">
                                    <input type="password"
                                           onClick={() => setChangePasswordSuccess(false)}
                                           disabled={loading2}
                                           {...register2("password", {
                                               required: "Pole wymagane",
                                               maxLength: 30,
                                               pattern: {
                                                   value: /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
                                                   message:
                                                       'Co najmniej 8 znaków, w tym przynajmniej jedna duża litera,' +
                                                       'mała litera oraz cyfra',
                                                }
                                            })}
                                    />
                                    <span />
                                    <label>Stare hasło</label>
                                </div>
                                {errors2["password"] && <ErrorCode code={errors2["password"].message} />}

                                <div className="txt_field">
                                    <input type="password"
                                           onClick={() => setChangePasswordSuccess(false)}
                                           disabled={loading2}
                                           {...register2("newPassword", {
                                               required: "Pole wymagane",
                                               maxLength: 30,
                                               pattern: {
                                                   value: /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
                                                   message:
                                                       'Co najmniej 8 znaków, w tym przynajmniej jedna duża litera,' +
                                                       'mała litera oraz cyfra',
                                               }
                                           })}
                                    />
                                    <span />
                                    <label>Nowe hasło</label>
                                </div>
                                {errors2["newPassword"] && <ErrorCode code={errors2["newPassword"].message} />}

                                <div className="txt_field">
                                    <input type="password"
                                           onClick={() => setChangePasswordSuccess(false)}
                                           disabled={loading2}
                                           {...register2("password2", {
                                               required: "Pole wymagane",
                                               maxLength: 30,
                                               validate: (value) =>
                                                   value === watch('newPassword') || 'Hasła nie pasują do siebie',
                                           })}
                                    />
                                    <span />
                                    <label>Potwierdź hasło</label>
                                </div>
                                {errors2["password2"] && <ErrorCode code={errors2["password2"].message} />}

                                <input className={loading2 ? "textAnim" : ""}
                                       type="submit"
                                       disabled={loading2}
                                       value="Zmień hasło"
                                />
                                {changePasswordError && <ErrorCode code={changePasswordError} />}
                            </form>
                            {changePasswordSuccess && <div className="h6">Pomyślnie zmieniono hasło</div>}
                        </div>
                    </div>
                </div>
            </Page>
        </>
    )
}


export default AccountPage