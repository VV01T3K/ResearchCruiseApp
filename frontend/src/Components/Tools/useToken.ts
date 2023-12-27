import React, {useState} from 'react'


const useToken = () => {
    const getToken =() =>{
        const tokenString = sessionStorage.getItem('token')
        return tokenString? JSON.parse(tokenString): null;
    }

    const [token, setToken] = useState(getToken())
    const saveToken = (userToken: string | null) => {
        if(userToken)
            sessionStorage.setItem('token', JSON.stringify(userToken))
        else {
            sessionStorage.clear()
        }
        setToken(userToken)
    }
    return {
        token,
        setToken: saveToken
    }
}

export default useToken