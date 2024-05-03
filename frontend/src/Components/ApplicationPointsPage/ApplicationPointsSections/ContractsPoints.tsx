import React, {useEffect, useState} from "react";
import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import ReadOnlyTextArea from "../../CommonComponents/ReadOnlyTextArea";
import file_icon from "../../../resources/file_icon.png";


type EvaluatedContract = {
    category: string,
    institution: {
        name: string,
        unit: string,
        localization: string
    },
    description: string,
    scan: {
        name: string,
        content: string
    },
    points: string
}

type Props = {
    evaluatedContracts: EvaluatedContract[],
}


export default function ContractsPoints(props: Props){
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
        <div className="col-12 p-3">
            <div className="table-striped w-100">
                <div className="text-white text-center" style={{"backgroundColor": "#052d73"}}>
                    <div className="d-flex flex-row center align-items-center">
                        <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "5%"}}>
                            <b>Lp.</b>
                        </div>
                        <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "15%"}}>
                            <b>Kategoria</b>
                        </div>
                        <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "25%"}}>
                            <b>Instytucja</b>
                        </div>
                        <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "36%"}}>
                            <b>Opis</b>
                        </div>
                        <div className="text-center d-none d-xl-block p-2 border-end" style={{width: "10%"}}>
                            <b>Skan</b>
                        </div>
                        <div className="text-center d-none d-xl-block p-2" style={{width: "9%"}}>
                            <b>Punkty</b>
                        </div>

                        <div className="text-center d-block d-xl-none p-2 col-12">
                            <b>Umowy</b>
                        </div>
                    </div>
                </div>
                <div className="w-100 bg-light">
                    {!props.evaluatedContracts.length &&
                        <div className="d-flex flex-row justify-content-center bg-light p-2 border">
                            <div className="text-center">Nie dodano żadnej umowy</div>
                        </div>
                    }
                    {props.evaluatedContracts.map((row: EvaluatedContract, index: number) => (
                        <div key={index}
                             className="d-flex flex-wrap flex-row justify-content-center border bg-light"
                        >
                            <div className="text-center d-none d-xl-flex justify-content-center align-items-center p-2
                                 border-end"
                                 style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                            >
                                {index + 1}.
                            </div>
                            <div className="text-center d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                                <b>Umowa {index + 1}.</b>
                            </div>

                            <div className="text-center d-inline-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                 style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                            >
                                <div className="col-12 d-xl-none">Kategoria</div>
                                <ReadOnlyTextInput value={row.category == "international" ? "Międynarodowa" : "Krajowa"} />
                            </div>
                            <div className="text-center d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                 style={{width: windowWidth >= 1200 ? "25%" : "100%"}}
                            >
                                <div className="col-12 mb-1">Nazwa instytucji</div>
                                <ReadOnlyTextInput value={row.institution.name} />

                                <div className="col-12 mb-1 mt-1">Jednostka</div>
                                <ReadOnlyTextInput value={row.institution.unit} />

                                <div className="col-12 mb-1 mt-1">Lokalizacja instytucji</div>
                                <ReadOnlyTextInput value={row.institution.localization} />
                            </div>
                            <div className="text-center d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                                 style={{width: windowWidth >= 1200 ? "36%" : "100%"}}
                            >
                                <div className="col-12 d-xl-none">Opis</div>
                                <ReadOnlyTextArea value={row.description} />
                            </div>
                            <div className="text-center d-flex flex-wrap align-items-center justify-content-center p-2 border-end"
                                 style={{width: windowWidth >= 1200 ? "10%" : "100%"}}
                            >
                                <div className="col-12 d-xl-none">Skan</div>
                                <img
                                    src={file_icon}
                                    height="45px"
                                    width="45px"
                                    className="rounded-2 p-1 d-flex"
                                    onMouseEnter={e => {
                                        const thisImage = e.target as HTMLImageElement
                                        thisImage.style.backgroundColor = "#eeeeee"
                                    }}
                                    onMouseLeave={e => {
                                        const thisImage = e.target as HTMLImageElement
                                        thisImage.style.backgroundColor = "#f8f8f8"
                                    }}
                                    alt="File picker icon"
                                />
                            </div>
                            <div className="text-center d-flex justify-content-center align-items-center p-2"
                                 style={{width: windowWidth >= 1200 ? "9%" : "100%"}}
                            >
                                <ReadOnlyTextInput value={row.points} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
