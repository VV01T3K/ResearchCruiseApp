import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import useCustomEvent from "../../Tools/useCustomEvent";
import Api from "../../Tools/Api";
import {keyboard} from "@testing-library/user-event/dist/keyboard";


type Props = {
    title: string,
    sections: (string | boolean)[][]
}


function FormTitle(props: Props){
    function scrollSmoothTo(elementId){
        var element = document.getElementById(elementId);
        element.scrollIntoView({
            block: 'start',
            behavior: 'smooth'
        });
    }


    const [sections, setSections] = useState(
        Object.keys(props.sections).reduce((acc, key) => {
        acc[key] = false;
        return acc;
    }, {})
    )


    const { addEventListener:sectionStateListener } = useCustomEvent('sectionStateChange');

    useEffect(() => {
        const unsubscribeLogin = sectionStateListener((data) => {
           setSections((sections) => ({
               ...sections,
               [Object.keys(data)]:Object.values(data)[0]
           }))}

            );
        return () => {
            unsubscribeLogin();
        };
    },[sectionStateListener])


    return (
        <div className={" mb-2  bg-light z-0 ps-2 pe-2 "}>

            <h1 className={" d-flex flex-column  text-decoration-underline text-end p-2 "}
                style={{fontSize: "1.5rem"}}>{props.title}</h1>
            <h1 className={"d-flex flex-row  flex-wrap d-none d-lg-flex p-2"} style={{fontSize: "1.5rem"}}>
                {Object.entries(sections).map(([key,value], index) => {
                    return <Link key={`${index}`}
                        className={`d-flex flex-nowrap m-1 align-self-center text-decoration-none ${value ? "text-success" : "text-danger"}`}
                        style={{fontSize: "0.9rem"}} onClick={()=>scrollSmoothTo(`${index+1}`)}  to={""}>{index + 1}. {key}</Link>
                })}
            </h1>
        </div>
    )
}


export default FormTitle