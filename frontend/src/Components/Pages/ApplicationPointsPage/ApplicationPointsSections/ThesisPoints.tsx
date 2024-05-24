import React, {useEffect, useState} from "react";
import ReadOnlyTextInput from "../../../CommonComponents/ReadOnlyTextInput";


type EvaluatedThesis = {
    category: string,
    year: string,
    ministerialPoints: string,
    author: string,
    title: string,
    promoter: string
}

type Props = {
    evaluatedPublications: EvaluatedThesis[]
}


function ThesisInput(props: Props){
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
                <div className="text-white text-center bg-primary">
                    <div className="d-flex flex-row center">
                        <div className="w-100 p-2">
                            <b>Prace</b>
                        </div>
                    </div>
                </div>

                <div className="text-white text-center bg-secondary">
                    <div className="d-flex flex-row center">
                        <div
                            className="d-none d-xl-flex justify-content-center align-items-center p-2"
                            style={{width: "5%"}}>
                            <b>Lp.</b>
                        </div>
                        <div
                            className="d-none d-xl-flex justify-content-center align-items-center p-2"
                            style={{width: "15%"}}>
                            <b>Kategoria</b>
                        </div>
                        <div
                            className="d-none d-xl-flex justify-content-center align-items-center p-2"
                            style={{width: "51%"}}>
                            <b>Informacje</b>
                        </div>

                        <div
                            className="d-none d-xl-flex justify-content-center align-items-center p-2"
                            style={{width: "15%"}}>
                            <b>Rok wydania</b>
                        </div>
                        <div
                            className="d-none d-xl-flex justify-content-center align-items-center p-2"
                            style={{width: "14%"}}>
                            <b>Punkty ministerialne</b>
                        </div>
                    </div>
                </div>
                {!props.evaluatedPublications.length &&
                    <div className="d-flex flex-row bg-light p-2 justify-content-center border">
                        <div className={"text-center"}>Nie dodano żadnej publikacji</div>
                    </div>
                }
                {props.evaluatedPublications.map((row: EvaluatedThesis, index: number) => (
                    <div key={index}
                         className={`d-flex flex-wrap flex-row justify-content-center border-bottom border-start border-end ${index % 2 == 0 ? "bg-light" : "bg-white"}`}
                    >
                        <div
                            className="d-none d-xl-flex justify-content-center align-items-center p-2"
                            style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                        >
                            {index + 1}.
                        </div>
                        <div
                            className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                            <b>Publikacja {index + 1}.</b>
                        </div>

                        <div
                            className="d-flex flex-wrap justify-content-center align-items-center p-2 text-center"
                            style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">
                                Kategoria
                            </div>
                            <ReadOnlyTextInput value={row.category} />
                        </div>
                        <div
                            className="text-center d-flex flex-wrap justify-content-center align-items-center p-2"
                            style={{width: windowWidth >= 1200 ? "51%" : "100%"}}
                        >
                            <div className="col-12 mb-1">Autor</div>
                            <ReadOnlyTextInput value={row.author} />

                            <div className="col-12 mb-1 mt-1">Tytuł</div>
                            <ReadOnlyTextInput value={row.title} />

                            <div className="col-12 mb-1 mt-1">Promotor</div>
                            <ReadOnlyTextInput value={row.promoter} />

                        </div>

                        <div
                            className="d-flex flex-wrap justify-content-center align-items-center p-2"
                            style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">
                                Rok obrony
                            </div>
                            <ReadOnlyTextInput value={row.year} />
                        </div>
                        <div
                            className="d-flex flex-wrap justify-content-center align-items-center p-2"
                            style={{width: windowWidth >= 1200 ? "14%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">
                                Punkty ministerialne
                            </div>
                            <ReadOnlyTextInput value={row.ministerialPoints} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default ThesisInput