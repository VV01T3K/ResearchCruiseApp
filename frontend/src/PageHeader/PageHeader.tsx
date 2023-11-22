import React, {useState} from 'react';
import Logo from "../resources/logo.svg"
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
function PageHeader(props:{className?: string}){
    const [toggledButton, setToggle] = useState(false)

    return(
        <>
            <div className={props.className+ " fixed-top text-light w-100"} style={{"backgroundColor":"#052d73", "height":"84.3px"}}>
                <div className={"navbar navbar-light h-100 w-100 pt-2 pb-2"}>
                        <div className={"d-flex container-xxl flex-row justify-content-start flex-nowrap pt-1 pb-1 h-100 w-100 "}>
                            <a className={"navbar-brand pe-3 ps-3 h-100 border-end"} href={"https://ug.edu.pl/"} title={"Strona główna"} rel={"home"}>
                                <img src={Logo} alt="Strona główna" className={"d-inline align-top h-100"}/>
                            </a>
                            <div className={"h-100 text-light text-nowrap navbar"}>Aplikacja do obsługi rejsów</div>
                            <button className="d-md-flex d-lg-none navbar-toggler navbar-dark ms-auto me-0 pe-3" onClick={()=>setToggle(!toggledButton)}>
                                <span className="navbar-toggler-icon"></span>
                            </button>
                             <div className={"d-none d-lg-flex ms-auto me-0 pe-3"}>
                                 <DesktopMenu/>
                             </div>
                    </div>

                </div>
            </div>
            <div className={"m-0 p-0"} style={{"height":"84.3px"}}></div>
            <div className={"relative m-0 p-0"} style={{"backgroundColor":"#052d73"}}>
                <div className={`${toggledButton ? "row d-md-flex": "d-none" } d-lg-none`} style={{"height":"42.25px"}}>
                    <MobileMenu/>
                </div>
            </div>
        </>
        );
}
export default PageHeader