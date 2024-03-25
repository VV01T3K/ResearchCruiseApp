import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";


function SavedFormsTile(){
    return (
        <Tile>
            <Tile>
                <Link to="/SavedForms"  className={"p-3 d-flex flex-column w-100 h-100 align-items-center text-decoration-none"}>
                    <svg xmlns="http://www.w3.org/2000/svg"  fill="black"
                         className="bi bi-chat-fill p-2" viewBox="0 0 16 16">
                        <path
                            d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z"/>
                        <path
                            d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z"/>
                    </svg>
                    Zapisane formularze
                </Link>
            </Tile>
        </Tile>
    )
}


export default SavedFormsTile;