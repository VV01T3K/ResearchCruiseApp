import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from "./LoginPage";
import PageHeader from "./PageHeader";
import Bg from "./resources/laboratorium.jpg"
import { useImageSize } from 'react-image-size';
function App() {
    const [dimensions, _] = useImageSize(Bg);
    const [horizontal, setHorizontal] = useState(window.innerWidth/window.innerHeight > 16/9)
    useEffect(()=>{
        const flip = ()=>{

            const state = window.innerWidth/window.innerHeight > dimensions!.width/dimensions!.height
            if(state!==horizontal)
                setHorizontal(state)
        }
        window.addEventListener("resize", flip)
        return () => {
            window.removeEventListener("resize", flip)
        }
    })
    return (
        <div className={`App bg ${horizontal ? "bgHorizontal": "bgVertical" }`} style={{"backgroundImage":`url(${Bg})`}}>
            <PageHeader></PageHeader>
            <LoginPage className=" position-relative"></LoginPage>
        </div>
    );
}

export default App;
