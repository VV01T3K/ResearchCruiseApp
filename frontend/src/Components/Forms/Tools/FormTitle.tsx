import React from "react";

function FormTitle(props:{title:string, completed:(string | boolean)[][]}){

    return (
        <div className={" mb-2  bg-light z-0 ps-2 pe-2 "}>

            <h1 className={" d-flex flex-column  text-decoration-underline text-end "}
                style={{fontSize: "2rem"}}>{props.title}</h1>
            <h1 className={"d-flex flex-row  flex-wrap d-none d-lg-flex"} style={{fontSize: "2.5rem"}}>
                {props.completed.map((value, index) => {
                    return <a key={`${index}`}
                        className={`d-flex flex-nowrap p-2 align-self-center text-decoration-none ${value.at(1) ? "text-success" : "text-danger"}`}
                        style={{fontSize: "0.9rem"}} href={`#${index}`}>{index + 1}. {value.at(0)}</a>
                })}
            </h1>
        </div>
    )
}

export default FormTitle