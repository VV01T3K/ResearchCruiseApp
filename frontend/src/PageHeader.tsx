import React, {useEffect, useState} from 'react';
import Logo from "./resources/logo.svg"
import En from "./resources/en.svg"
function PageHeader(props:{className?: string}){
    const [sizeM, setSizeM] = useState(window.innerWidth < 992)
    const [toggledButton, setToggle] = useState(false)
    useEffect(()=>{
        const windowResized = ()=> setSizeM(window.innerWidth < 992)
        window.addEventListener("resize", windowResized)
        return () => {
            window.removeEventListener("resize", windowResized)
        }
    })
    return(
        <div>
            <div className={props.className+ " fixed-top text-light w-100"} style={{"backgroundColor":"#052d73", "height":"84.3px"}}>
                <div className={"navbar d-flex navbar-light navbar-expand-md h-100 pt-2 pb-2 mw-100 "}>
                    <div className={"container d-flex justify-content-start flex-nowrap p-0 m-0  h-100 mw-100 "}>
                        <a className={"navbar-brand pt-1 pb-1 pe-3 ps-3 h-100  d-inline-flex border-end"} href={"https://ug.edu.pl/"} title={"Strona główna"} rel={"home"}>
                            <img src={Logo} alt="Strona główna" className="d-flex align-top h-100"/>
                        </a>
                        <div className={"navbar h-100 d-inline-flex text-light text-nowrap "}>Aplikacja do obsługi rejsów</div>
                        {sizeM &&
                        <div className={"d-inline-flex ms-auto me-0 pe-3 "}>
                            <button className="navbar-toggler navbar-light d-inline-flex ms-auto me-0" type="button" onClick={()=>setToggle(!toggledButton)} data-toggle="collapse" >
                                <span className="navbar-toggler-icon navbar-light text-white">
                                </span>
                            </button>
                        </div>
                        }
                        {sizeM && toggledButton &&
                            <div id="block-menuglowne" className="col-md-9 col block block-superfish block-superfishmenu-glowne">
                                <div className="ms-md-5 ps-md-5 content">
                                    <div className="icons-mobile px-0 mx-auto py-4 col-12 techniczne g-1 d-none">

                                        <div className="col border-end d-flex justify-content-center flex-column align-items-center">
                                            <a id="radiomors" onClick={()=>window.open('http://player.mors.ug.edu.pl/sites/all/modules/jplayer/mors_popup.html', 'newWin','width=280,height=220')} tabIndex={0} title="Listen to Radio MORS">
                                                <img alt="Radio MORS" src="/themes/ug_theme/images/radio.svg"/>
                                            </a>
                                        </div>
                                        <div className="col border-end d-flex justify-content-center flex-column align-items-center">
                                            <a href="https://outlook.com/ug.edu.pl" id="webmail" title="Poczta uniwersytecka" tabIndex={0}>
                                                <img alt="Poczta UG" src="/themes/ug_theme/images/mail.svg"/>
                                            </a>
                                        </div>
                                        <div className="col border-end d-flex justify-content-center flex-column align-items-center me-1">
                                            <a href="https://en.ug.edu.pl/" id="english" lang="en" title="English Version" tabIndex={0} style={{"fontSize": "20px","fontWeight": "500","color": "white"}}>
                                                EN
                                            </a>
                                        </div>
                                    </div>

                                    {/*<ul id="superfish-menu-glowne" className="menu sf-menu sf-menu-glowne sf-horizontal sf-style-white megamennu sf-js-enabled" style="">*/}

                                    {/*    <li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3581" className="sf-depth-1 menuparent"><a href="/kandydaci" className="sf-depth-1 menuparent">Kandydaci</a><ul style="float: none; width: 40em;" className="sf-hidden"><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3582" className="sf-depth-2 sf-no-children" style=""><a href="/rekrutacja/studia_i_i_ii_stopnia_oraz_jednolite_magisterskie" className="sf-depth-2" style="">Studia I i II stopnia oraz jednolite magisterskie</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3617" className="sf-depth-2 sf-no-children" style=""><a href="/rekrutacja/szkoly_doktorskie" className="sf-depth-2" style="">Szkoły doktorskie</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3618" className="sf-depth-2 sf-no-children" style=""><a href="/kandydaci/studia-podyplomowe" className="sf-depth-2" style="">Studia podyplomowe</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne4047" className="sf-depth-2 sf-no-children" style=""><a href="/rekrutacja/kursy_i_szkolenia" className="sf-depth-2" style="">Kursy i szkolenia</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne44529" className="sf-depth-2 sf-no-children" style=""><a href="/kandydaci/dni-otwarte-ug" className="sf-depth-2" style="">Dni otwarte UG</a></li></ul></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3625" className="sf-depth-1 menuparent"><a href="/studenci" className="sf-depth-1 menuparent">Studenci</a><ul style="float: none; width: 40em;" className="sf-hidden"><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne41536" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/stypendia-dla-studentow-i-doktorantow-szkol-doktorskich" className="sf-depth-2" style="">Stypendia dla Studentów i Doktorantów Szkół Doktorskich</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3626" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/studia-i-i-ii-stopnia-oraz-jednolite-magisterskie" className="sf-depth-2" style="">Studia I i II stopnia oraz jednolite magisterskie</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne35947" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/komunikaty-dla-studentow" className="sf-depth-2" style="">Komunikaty dla studentów</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3721" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/studia-trzeciego-stopnia" className="sf-depth-2" style="">Studia trzeciego stopnia</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne40417" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/erasmus_2021-2027" className="sf-depth-2" style="">Erasmus+ 2021-2027</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3771" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/studia_podyplomowe" className="sf-depth-2" style="">Studia podyplomowe</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3793" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/gdanski_uniwersytet_trzeciego_wieku" className="sf-depth-2" style="">Gdański Uniwersytet Trzeciego Wieku</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3709" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/sprawy-informatyczne" className="sf-depth-2" style="">Sprawy informatyczne</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne31327" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/portal-studenta" className="sf-depth-2" style="">Portal Studenta</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne31328" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/portal-edukacyjny" className="sf-depth-2" style="">Portal Edukacyjny</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne37126" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/biuro-karier-ug" className="sf-depth-2" style="">Biuro Karier UG</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne4141" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/kola_naukowe_1" className="sf-depth-2" style="">Koła naukowe</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne44391" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/centrum-wsparcia-psychologicznego" className="sf-depth-2" style="">Centrum Wsparcia Psychologicznego</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne44450" className="sf-depth-2 sf-no-children" style=""><a href="/studenci/panstwowe-fundusze-celowe" className="sf-depth-2" style="">Państwowe Fundusze Celowe</a></li></ul></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3845" className="sf-depth-1 menuparent"><a href="/pracownicy" className="sf-depth-1 menuparent">Pracownicy</a><ul style="float: none; width: 40em;" className="sf-hidden"><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne35946" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/komunikaty_2" className="sf-depth-2" style="">Komunikaty</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3857" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/szukaj" className="sf-depth-2" style="">Skład osobowy</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne4186" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/struktura_organizacyjna" className="sf-depth-2" style="">Struktura organizacyjna</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne4187" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/strony_jednostek" className="sf-depth-2" style="">Strony jednostek</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne44449" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/erasmus-2021-2027" className="sf-depth-2" style="">Erasmus+ 2021-2027</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne43933" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/system-pol" className="sf-depth-2" style="">System POL-on</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3953" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/rozwoj-kariera" className="sf-depth-2" style="">Rozwój, kariera</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3954" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/zwiazki-zawodowe" className="sf-depth-2" style="">Związki zawodowe</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne31150" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/portal-pracownika" className="sf-depth-2" style="">Portal Pracownika</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne31477" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/portal-edukacyjny" className="sf-depth-2" style="">Portal Edukacyjny</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne37612" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/elektroniczne_zarzadzanie_dokumentacja" className="sf-depth-2" style="">Elektroniczne Zarządzanie Dokumentacją</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3955" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/emeryci" className="sf-depth-2" style="">Emeryci</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne40169" className="sf-depth-2 sf-no-children" style=""><a href="/pracownicy/sprawy-informatyczne" className="sf-depth-2" style="">Sprawy informatyczne</a></li></ul></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3818" className="sf-depth-1 menuparent"><a href="/absolwenci" className="sf-depth-1 menuparent">Absolwenci</a><ul style="float: none; width: 40em;" className="sf-hidden"><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3828" className="sf-depth-2 sf-no-children" style=""><a href="/absolwenci/nasi-absolwenci" className="sf-depth-2" style="">Nasi absolwenci</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne43826" className="sf-depth-2 sf-no-children" style=""><a href="/absolwenci/klub-absolwentow" className="sf-depth-2" style="">Klub Absolwentów</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3819" className="sf-depth-2 sf-no-children" style=""><a href="/absolwenci/wydzialowe-stowarzyszenia-absolwentow" className="sf-depth-2" style="">Wydziałowe Stowarzyszenia Absolwentów</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3830" className="sf-depth-2 sf-no-children" style=""><a href="/absolwenci/biuro-karier" className="sf-depth-2" style="">Biuro Karier</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3842" className="sf-depth-2 sf-no-children" style=""><a href="/absolwenci/gdanski-uniwersytet-trzeciego-wieku" className="sf-depth-2" style="">Gdański Uniwersytet Trzeciego Wieku</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3844" className="sf-depth-2 sf-no-children" style=""><a href="/absolwenci/podnoszenie-kwalifikacji" className="sf-depth-2" style="">Podnoszenie kwalifikacji</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne39645" className="sf-depth-2 sf-no-children" style=""><a href="/absolwenci/weryfikacja-wyksztalcenia" className="sf-depth-2" style="">Weryfikacja wykształcenia</a></li></ul></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3986" className="sf-depth-1 menuparent"><a href="/media" className="sf-depth-1 menuparent">Media</a><ul style="float: none; width: 40em;" className="sf-hidden"><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne22851" className="sf-depth-2 sf-no-children" style=""><a href="/media/aktualnosci" className="sf-depth-2" style="">Aktualności</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne44387" className="sf-depth-2 sf-no-children" style=""><a href="/media/komunikaty-sars-cov-2" className="sf-depth-2" style="">Komunikaty SARS-Cov-2</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3989" className="sf-depth-2 sf-no-children" style=""><a href="/media/subiektywny-przeglad-mediow" className="sf-depth-2" style="">Subiektywny przegląd mediów</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne3994" className="sf-depth-2 sf-no-children" style=""><a href="/media/media-uniwersyteckie" className="sf-depth-2" style="">Media uniwersyteckie</a></li><li id="menu-glowne-taxonomy-menumenu-linktaxonomy-menumenu-linkmenu-glowne22852" className="sf-depth-2 sf-no-children" style=""><a href="/media/centrum-komunikacji-i-promocji" className="sf-depth-2" style="">Centrum Komunikacji i Promocji</a></li></ul></li>*/}
                                    {/*</ul>*/}

                                </div>
                            </div>}
                        {!sizeM &&
                        <div className="d-inline-flex ms-auto me-0 pe-3" id="CollapsingNavbar">
                            <div id="block-ug-theme-ikonytechniczne" className="block block-block-content block-block-contenta8295708-6016-4580-a9fe-5b0afe4aa874">
                                <div className="top-icons content">

                                    <div className="clearfix text-formatted field field--name-body field--type-text-with-summary field--label-hidden field__item"><div className="row d-none d-lg-flex">
                                        <div className="col text-center border-end border-light">
                                            <a id="radiomors" onClick={()=>window.open('http://player.mors.ug.edu.pl/sites/all/modules/jplayer/mors_popup.html', 'newWin','width=280,height=220')} tabIndex={1} title="Słucha  Radia MORS">
                                                <img alt="Radio MORS" src="https://ug.edu.pl/themes/ug_faculty/images/radio.svg"/>
                                                </a>
                                        </div>
                                        <div className="col text-center border-end border-light">
                                            <a href="https://outlook.com/ug.edu.pl" id="webmail" title="Poczta uniwersytecka">
                                                <img alt="Poczta UG" src="https://ug.edu.pl/themes/ug_faculty/images/mail.svg"/>
                                            </a>
                                        </div>
                                        <div className="col text-center">
                                            <a href="https://en.ug.edu.pl/" id="english" lang="en" title="English Version" tabIndex={0} style={{"textDecoration":"none", "fontSize": "20px","fontWeight": "500","color": "white"}}>
                                                EN
                                            </a>
                                        </div>
                                    </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
            <div className={"m-0 p-0"} style={{"height":"84.3px"}}></div>
        </div>
        );
}
export default PageHeader