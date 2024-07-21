import React, {useState} from 'react';
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import PageHeaderText from "../../Tools/PageHeaderText";
import {UgPageLink} from "./PageHeaderCommon";


type Props = {
    className?: string,
}


function PageHeader(props: Props) {
    const [toggledButton, setToggle] = useState(false)
    const {pageHeaderText} = PageHeaderText()
    return(
        <div className="fixed-top">
            <div className={props.className+ " bg-primary fixed-top text-light w-100 z-1 appHeader"}
            >
                <div className="navbar navbar-light h-100 w-100 ">
                    <div className="d-flex container-xxl flex-row justify-content-start flex-nowrap  h-100
                                    w-100"
                    >
                        <UgPageLink/>
                        <div className="h-100 text-light text-nowrap align-self-center text-center navbar me-3">
                            {pageHeaderText}
                        </div>
                        <button className="d-md-flex d-md-none navbar-toggler navbar-dark ms-auto me-0 pe-3"
                                onClick={() => setToggle(!toggledButton)}
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className="d-none d-md-flex ms-auto me-0 pe-3">
                            <DesktopMenu />
                        </div>
                    </div>
                </div>
            </div>

            <div className="m-0 p-0 appHeader" />
            <div className="m-0 p-0 fixed-top z-0 bg-primary">
                <div className="m-0 p-0 appHeader"/>
                <div className={`${toggledButton ? "flex-row d-md-flex" : "d-none" } d-md-none`}
                     style={{"height":"42.25px"}}
                >
                    <MobileMenu />
                </div>
            </div>
        </div>
    );
}


export default PageHeader