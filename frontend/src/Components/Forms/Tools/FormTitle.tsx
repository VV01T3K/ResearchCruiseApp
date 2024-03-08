import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import useCustomEvent from "../../Tools/useCustomEvent";
import Api from "../../Tools/Api";


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
        Object.keys(props.sections).map((key) => { return {[key]:false};
        })
    )


    const { addEventListener:sectionStateListener } = useCustomEvent('sectionStateChange');

    useEffect(() => {
        const unsubscribeLogin = sectionStateListener((data) => {

                // console.log(Object.keys(sections).map((key) => {
                //     const value = sections[key];
                //     if (key==Object.entries(data)[0][0]) {
                //         return { [key]: Object.entries(data)[0][1] }; // Zamień 'x' na 'y'
                //     }
                //     return {key: value};
                // }))
    // console.log(Object.entries(data)[0][0])
            console.log(sections)

                    // const tmpSections = sections
                    //
                    // const firstKey = tmpSections[Object.keys(data)]
                    // tmpSections[Object.keys(data)][Object.keys(firstKey)] = data[Object.keys(data)]
                    // setSections(sections[data.key] = data.value)

             // console.log(data)
            }

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
                {Object.entries(sections).map((value, index) => {
                    const section = value.at(1)

                    return <Link key={`${index}`}
                        className={`d-flex flex-nowrap m-1 align-self-center text-decoration-none ${!section[Object.keys(section)] ? "text-success" : "text-danger"}`}
                        style={{fontSize: "0.9rem"}} onClick={()=>scrollSmoothTo(`${index+1}`)}  to={""}>{index + 1}. {Object.keys(section)}</Link>
                })}
            </h1>
        </div>
    )
}


export default FormTitle