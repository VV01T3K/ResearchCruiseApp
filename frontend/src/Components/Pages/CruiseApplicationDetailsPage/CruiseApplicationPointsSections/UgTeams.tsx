import React, {useEffect, useState} from "react";
import  {UgTeam} from "../../FormPage/Inputs/UgTeamsInput/UgTeamsInput";

import {administrationUnits} from "../../../../resources/administrationUnits";

type Props = {
    ugTeams: UgTeam[],
}


export default function UgTeams(props: Props){
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(
        () => {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        },
        []
    );

    return (
        <div className="table-striped w-100 p-3">
            <div className="text-white text-center bg-primary">
                <div className="d-flex flex-row center">
                    <div className="w-100 p-2">
                        <b>Uczestnictwo osób z jednostek organizacyjnych UG</b>
                    </div>
                </div>
            </div>

            <div className="text-white text-center bg-secondary">
                <div className="d-flex flex-row center">
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "10%"}}>
                        <b>Lp.</b>
                    </div>
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "49%"}}>
                        <b>Jednostka</b>
                    </div>
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "21%"}}>
                        <b>Liczba pracowników</b>
                    </div>
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "20%"}}>
                        <b>Liczba studentów</b>
                    </div>
                </div>
            </div>
            {!props.ugTeams.length &&
                <div className="d-flex flex-row bg-light p-2 justify-content-center border">
                    <div className={"text-center"}>Nie dodano żadnej jednostki</div>
                </div>
            }
            {props.ugTeams && props.ugTeams.map((item: UgTeam, index: number) => (
                <div className="d-flex flex-wrap flex-row justify-content-center border bg-light"
                     key={index}
                >
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                         style={{width: windowWidth >= 1200 ? "10%" : "100%"}}
                    >
                        {index + 1}.
                    </div>
                    <div className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                        <b>Jednostka {index + 1}.</b>
                    </div>

                    <div className="d-flex justify-content-center align-items-center p-2 border-end text-center"
                         style={{width: windowWidth >= 1200 ? "49%" : "100%"}}
                    >
                        <span>{administrationUnits[item.unit]}</span>
                    </div>
                    <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                         style={{width: windowWidth >= 1200 ? "21%" : "100%"}}
                    >
                        <div className="col-12 d-flex d-xl-none justify-content-center">Liczba pracowników</div>
                        <input
                            className="text-center placeholder-glow w-100 p-1 form-control bg-light"
                            disabled
                            value={item.noOfEmployees}
                        />
                    </div>
                    <div className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                         style={{width: windowWidth >= 1200 ? "20%" : "100%"}}
                    >
                        <div className="col-12 d-flex d-xl-none justify-content-center">Liczba studentów</div>
                        <input
                            className="text-center placeholder-glow w-100 p-1 form-control bg-light"

                            disabled
                            value={item.noOfStudents}
                        />
                    </div>
                </div>))}

        </div>)
}
