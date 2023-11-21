import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginPage from "./LoginForm/LoginPage";
import PageHeader from "./PageHeader/PageHeader";
import Bg from "./resources/Oceanograf.jpg"
import { useImageSize } from 'react-image-size';
function App() {
    return (
        <div className={`App`}>
            <div className={"bg"} style={{"backgroundImage":`url(${Bg})`}}></div>
            <PageHeader></PageHeader>
            <LoginPage></LoginPage>
        </div>
    );
}

export default App;
