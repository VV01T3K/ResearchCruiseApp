import React  from 'react';
import Tile from "./Tile";
import {Link} from "react-router-dom";


type Props = {
    children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>
}


function NewFormTile( props: Props){
    return (
        <Tile>
            <Link
                to="/NewForm"
                className="p-3 d-flex flex-column w-100 h-100 align-items-center text-decoration-none"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-100 w-100 bi bi-chat-fill"
                    fill="black"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M7 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zM0 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0m7-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5M3 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6m0 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"
                    />
                </svg>
                Nowy formularz
            </Link>
        </Tile>
    )
}


export default NewFormTile