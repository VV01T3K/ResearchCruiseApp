import React, {useEffect, useState} from 'react'

const useAuth = (navigate) => {

    const getAuth =() =>{
        const auth = sessionStorage.getItem('auth')
        return auth? JSON.parse(auth): null;
    }

    const [auth, setAuth] = useState(getAuth())
    const saveAuth = (auth) => {
        if(auth)
            sessionStorage.setItem('auth', JSON.stringify(auth))
        else {
            sessionStorage.clear()
        }
        setAuth(auth)
    }

    useEffect(() => {
        const refreshAccessToken = async () => {
            try {
                const response = await fetch('/login/refreshToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(auth["refreshToken"]),
                }).then((data)=>{
                    if (!data.ok) {
                        throw new Error('Błąd podczas odświeżania tokena');
                    }
                    else return data.json()
                });

                setAuth({
                    accessToken:response["accessToken"],
                    refreshToken:response["refreshToken"],
                    role:response["role"],
                    name:response["name"]})
            } catch (error) {
                console.error(error.message);
                sessionStorage.clear()
                setAuth(null)
                navigate("/forcedLogout")
            }
        };

        if(auth) {
            const intervalId = setInterval(() => {
                refreshAccessToken();
            }, 360000);
            return () => clearInterval(intervalId);
        }
    }, [auth]);





    return {
        auth: auth,
        setAuth: saveAuth,
    }
}

export default useAuth