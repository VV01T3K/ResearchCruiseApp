import React from "react";
import {Link} from "react-router-dom";

function FormTitle(props:{title:string, completed:(string | boolean)[][]}){
    function scrollSmoothTo(elementId) {
        var element = document.getElementById(elementId);
        element.scrollIntoView({
            block: 'start',
            behavior: 'smooth'
        });
    }

    return (
        <div className={" mb-2  bg-light z-0 ps-2 pe-2 "}>

            <h1 className={" d-flex flex-column  text-decoration-underline text-end p-2 "}
                style={{fontSize: "1.5rem"}}>{props.title}</h1>
            <h1 className={"d-flex flex-row  flex-wrap d-none d-lg-flex p-2"} style={{fontSize: "1.5rem"}}>
                {props.completed.map((value, index) => {
                    return <Link key={`${index}`}
                        className={`d-flex flex-nowrap m-1 align-self-center text-decoration-none ${value.at(1) ? "text-success" : "text-danger"}`}
                        style={{fontSize: "0.9rem"}} onClick={()=>scrollSmoothTo(`${index}`)}  to={""}>{index + 1}. {value.at(0)}</Link>
                })}
            </h1>
        </div>
    )
}

export default FormTitle