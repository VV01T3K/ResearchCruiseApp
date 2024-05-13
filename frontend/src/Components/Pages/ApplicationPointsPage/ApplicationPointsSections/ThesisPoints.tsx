import React, {useEffect, useState} from "react";
import ReadOnlyTextInput from "../../../CommonComponents/ReadOnlyTextInput";


type EvaluatedTheses = {
    category: string,
    year: string,
    info: {
        author: string,
        title: string,
        promoter: string
    },
    points: string
}


type Props = {
    evaluatedThesis: EvaluatedTheses[]
}


function WorkList(props: Props){
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
                            className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                            style={{width: "5%"}}>
                            <b>Lp.</b>
                        </div>
                        <div
                            className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                            style={{width: "20%"}}>
                            <b>Kategoria</b>
                        </div>
                        <div
                            className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                            style={{width: "51%"}}>
                            <b>Informacje</b>
                        </div>

                        <div
                            className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                            style={{width: "15%"}}>
                            <b>Rok obrony</b>
                        </div>
                        <div
                            className="d-none d-xl-flex justify-content-center align-items-center p-2"
                            style={{width: "9%"}}>
                        </div>
                    </div>
                </div>
                {!props.evaluatedThesis.length &&
                    <div className="d-flex flex-row bg-light p-2 justify-content-center border">
                        <div className={"text-center"}>Nie dodano żadnej pracy</div>
                    </div>
                }
                {props.evaluatedThesis.map((row: EvaluatedTheses, index: number) => (
                    <div key={index}
                         className="d-flex flex-wrap flex-row justify-content-center border bg-light"
                    >
                        <div
                            className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end"
                            style={{width: windowWidth >= 1200 ? "5%" : "100%"}}
                        >
                            {index + 1}.
                        </div>
                        <div
                            className="d-flex d-xl-none justify-content-center align-items-center p-2 col-12">
                            <b>Instytucja {index + 1}.</b>
                        </div>

                        <div
                            className="d-flex flex-wrap justify-content-center align-items-center p-2 border-end text-center"
                            style={{width: windowWidth >= 1200 ? "20%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">
                                Kategoria
                            </div>
                            <ReadOnlyTextInput value={row.category} />
                        </div>
                        <div
                            className="text-center d-flex flex-wrap justify-content-center align-items-center p-2 border-end"
                            style={{width: windowWidth >= 1200 ? "51%" : "100%"}}
                        >
                            <div className="col-12">Autor</div>
                            <ReadOnlyTextInput value={row.info.author} />

                            <div className="col-12">Tytuł</div>
                            <ReadOnlyTextInput value={row.info.title} />

                            <div className="col-12">Promotor</div>
                            <ReadOnlyTextInput value={row.info.promoter} />

                        </div>

                        <div
                            className="d-flex justify-content-center align-items-center p-2 border-end"
                            style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                        >
                            <ReadOnlyTextInput value={row.year} />

                        </div>
                        <div className="d-flex justify-content-center align-items-center p-2"
                             style={{width: windowWidth >= 1200 ? "9%" : "100%"}}
                        >
                            <ReadOnlyTextInput value={row.points} />
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}


export default WorkList