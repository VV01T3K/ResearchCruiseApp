import {Link} from "react-router-dom";
import React from "react";


export default function RegisterSuccessful() {
    return (
        <>
            <div className="signup_link m-3 text-break">
                <div style={{fontSize:"1.3rem"}}>
                    Rejestracja przebiegła pomyślnie, potwierdź rejestrację poprzez link wysłany na adres e-mail i
                    oczekuj zatwierdzenia konta przez biuro armatora
                </div>
                <div className="butt p-2 mt-2">
                    <Link className="text-white" to="/">
                        Powrót do logowania
                    </Link>
                </div>
            </div>
        </>
    )
}