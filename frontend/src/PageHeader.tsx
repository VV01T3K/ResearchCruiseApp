import React, {useEffect, useState} from 'react';
import Logo from "./resources/logo.svg"
function PageHeader(){
    return(
        <header id="header" className="header" role="banner" aria-label="Site header">
            <nav className="navbar sticky-top navbar-light navbar-expand-md affix w-100" id="navbar-main" data-toggle="affix" style={{"backgroundColor":"#052d73", "position":"fixed", "height":"86.75px"}}>
                {/*<a href="/" title="Strona główna" rel="home" className="navbar-brand">*/}
                    <img src={Logo} alt="Strona główna" className="img-fluid d-inline-block align-top"/>
                {/*</a>*/}


                <button className="navbar-toggler navbar-toggler-right " type="button" data-toggle="collapse" data-target="#CollapsingNavbar" aria-controls="CollapsingNavbar" aria-expanded="true" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>

        </nav>
        </header>
    )
}
export default PageHeader