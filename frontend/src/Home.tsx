import React, {Dispatch, SetStateAction} from "react";
import Bg from "./resources/image.png";

function Home (props:{setTitle:Dispatch<SetStateAction<string | null>>}){
    props.setTitle("Witaj")
    return <>
        <div className={"bg"} style={{"backgroundImage":`url(${Bg})`}}></div>
    </>
}
export default Home;