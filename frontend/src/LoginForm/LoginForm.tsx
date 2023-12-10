import React, {Dispatch, SetStateAction, useState} from "react";

function LoginForm(props:{setUserToken: Dispatch<SetStateAction<string | null>>,
setCurrentForm: Dispatch<SetStateAction<"login"|"remind"|"register">>}){
    const [username, setUserName] = useState<string|null>(null);
    const [password, setPassword] = useState<string|null>(null);

    async function loginUser() {
        const type = "login"
        return fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({type, username, password})
        })
            .then(data => data.json())
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        const token = await loginUser();
        props.setUserToken(token);
    }

    return (
        <>
            <h1>Login</h1>
            <form method="post">
                <div className="txt_field">
                    <input type="text" onChange={e => setUserName(e.target.value)} required/>
                    <span></span>
                    <label>Username</label>
                </div>
                <div className="txt_field">
                    <input type="password" onChange={e => setPassword(e.target.value)} required/>
                    <span></span>
                    <label>Password</label>
                </div>
                <div className="pass" onClick={()=>props.setCurrentForm("remind")}>Forgot Password?</div>
                <input type="submit" value="Login" onClick={()=>props.setUserToken(" ")}/>
                <div className="signup_link">
                    Not a member? <a href="#" onClick={()=>props.setCurrentForm("register")}>Signup</a>
                </div>
            </form>
            {password}
        </>
    )
}
export default LoginForm