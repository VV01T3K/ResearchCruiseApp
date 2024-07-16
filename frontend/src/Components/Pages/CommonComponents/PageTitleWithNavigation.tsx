import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import useCustomEvent from "../../Tools/useCustomEvent";

type Props = {
    title: string,
    sections: {},
    showRequiredSections: boolean
}


function PageTitleWithNavigation(props: Props){
    function scrollSmoothTo(elementId: string){
        var element = document.getElementById(elementId);
        element?.scrollIntoView({
            block: 'start',
            behavior: 'smooth'
        });
    }


    const [sections, setSections] = useState(
        Object.keys(props.sections).reduce((acc, key) => {
            // @ts-ignore
            acc[key] = false;
            return acc;
        }, {})
    )



    const { addEventListener:sectionStateListener } = useCustomEvent('sectionStateChange');

    useEffect(() => {
        const unsubscribeLogin = sectionStateListener((data: any) => {
            setSections((sections) => ({
                ...sections,
                // @ts-ignore
                [Object.keys(data)]:Object.values(data)[0]
            }))}

        );
        return () => {
            unsubscribeLogin();
        };
    },[sectionStateListener])


    return (
        <div className={" d-flex align-items-center w-100 text-white bg-primary d-none d-lg-flex p-2 border-bottom"}>


            <div
            >
                {Object.entries(sections).map(([key, value], index) => {
                    return (
                        <button
                            key={`${index}`}
                            style={{fontSize: "0.8rem"}}
                            className={`p-2 mx-auto text-nowrap text-truncate text-white bg-primary border-0 text-decoration-none`}
                            onClick={() => scrollSmoothTo(`${index + 1}`)}
                        >
                            {key}{props.showRequiredSections && (value ? "" : "*")}
                        </button>
                    )
                })}

            </div>
            <div className={" bg-primary text-end me-0 ms-auto text-nowrap p-2"}
                 style={{fontSize: "1.3rem"}}>{props.title}</div>


        </div>
    )
}


export default PageTitleWithNavigation