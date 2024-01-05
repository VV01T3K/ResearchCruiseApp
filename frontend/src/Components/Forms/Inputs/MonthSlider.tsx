import React, {useEffect, useState} from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Style from "./MonthSlider.css"
import CSSModules from "react-css-modules";
import {Control, Controller, FieldValues} from "react-hook-form";
import {circIn} from "framer-motion";

const MonthSlider = (props: { className?:string, label: string, name: string, control: Control<FieldValues, any>
        | undefined, handleInput?: (arg0: any[] | ((prevState: number[]) => number[])) => void, minMaxVal?: number[]}) => {
    const months = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień',
        'Maj', 'Czerwiec', 'Lipiec', 'Sierpień',
        'Wrzesień', 'Październik', 'Listopad', 'Grudzień', null


    ];
    const labels = [
        '1. połowy stycznia',
        '2. połowy stycznia',
        '1. połowy lutego',
        '2. połowy lutego',
        '1. połowy marca',
        '2. połowy marca',
        '1. połowy kwietnia',
        '2. połowy kwietnia',
        '1. połowy maja',
        '2. połowy maja',
        '1. połowy czerwca',
        '2. połowy czerwca',
        '1. połowy lipca',
        '2. połowy lipca',
        '1. połowy sierpnia',
        '2. połowy sierpnia',
        '1. połowy września',
        '2. połowy września',
        '1. połowy pażdziernika',
        '2. połowy pażdziernika',
        '1. połowy listopada',
        '2. połowy listopada',
        '1. połowy grudnia',
        '2. połowy grudnia',
    ]

    const [sliderValues, setSliderValues] = useState(props.minMaxVal != undefined ? props.minMaxVal:  [0,24])
    const [minVal,maxVal] = props.minMaxVal != undefined ? props.minMaxVal:  [0,24]

    React.useEffect(() => {
        setSliderValues(props.minMaxVal != undefined ? props.minMaxVal:  [0,24])
    }, [props.minMaxVal]);


    const slicedMonths = months.slice(( minVal+1)/2,( maxVal)/2+1)

    months.forEach((element, index, arr) => {
        if (!slicedMonths.includes(element)) {
            arr[index] = null;
        }

    });

    const handleChange =(sliderValues: number | number[]) => {
        setSliderValues(sliderValues as number[]);
        if(props.handleInput){
            props.handleInput(sliderValues as number[])

        }
    };

    return (
        <div className={props.className + "  p-3"}>
        <label>{props.label}</label>
            <div style={{height:"80px"}}>
            <Controller
                name={props.name}
                control={props.control}
                defaultValue={[minVal,maxVal]}
                render={({ field }) => (
                    <Slider
                        pushable={true}
                        allowCross={false}
                        {...field}
                        range
                        min={minVal}
                        max={maxVal}
                        marks={
                        months.reduce((acc, month, index) => {
                            // @ts-ignore
                            acc[2*index] = month;
                            return acc;
                        }, {})}
                        onChangeComplete={handleChange}
                    />
                )}
            />
            </div>
            <label className={"m-2 center text-center"} style={{fontSize:"0.9rem"}}>Wybrano okres: <br/> od początku {labels[sliderValues[0]]} <br/>do końca {labels[sliderValues[1]-1]}.</label>
        </div>

    );
};

export default  CSSModules(MonthSlider, Style);