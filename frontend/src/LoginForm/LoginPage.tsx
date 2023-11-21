import React from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
function LoginPage(props:{className?: string}){
    return (
        <div className={props.className + " d-flex flex-row justify-content-end flex-nowrap m-4"}>
                    <div className="center flex-nowrap  col-12 col-md-auto my-auto ">
                        <div className="mx-auto pb-1" style={{"width":"500px",  "background": "white"}}>
                        <h1>Login</h1>
                        <form method="post">
                            <div className="txt_field">
                                <input type="text" required/>
                                    <span></span>
                                    <label>Username</label>
                            </div>
                            <div className="txt_field">
                                <input type="password" required/>
                                    <span></span>
                                    <label>Password</label>
                            </div>
                            <div className="pass">Forgot Password?</div>
                            <input type="submit" value="Login"/>
                                <div className="signup_link">
                                    Not a member? <a href="#">Signup</a>
                                </div>
                        </form>
                        </div>
                    </div>
        </div>
    )
}

export default CSSModules(LoginPage, Style);