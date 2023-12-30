import React, {useEffect, useState} from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Style from "./MultiRangeSlider.css"
import CSSModules from "react-css-modules";
import {Control, Controller, FieldValues} from "react-hook-form";

const MonthSlider = (props: { label: string, name: string, control: Control<FieldValues, any>
        | undefined, minVal?: string | number | undefined, maxVal?: string | number | undefined,
    handleInput?: (arg0: any[]) => void, reset?}) => {
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

    const minVal = (props.minVal as number) ?? 0
    const maxVal = (props.maxVal as number)  ?? 24
    const slicedMonths = months.slice(( minVal+1)/2,( maxVal)/2+1)

    months.forEach((element, index, arr) => {
        if (!slicedMonths.includes(element)) {
            arr[index] = null;
        }
    });




    const handleChange =(sliderValues) => {
        setSliderValues(sliderValues);
        if(props.handleInput){
            props.handleInput(sliderValues)
        }
    };
    const [sliderValues, setSliderValues] = useState([minVal,maxVal])
    return (
        <>
        <label>{props.label}</label>
            <div style={{height:"80px"}}>
            <Controller
                name={props.name}
                control={props.control}
                // defaultValue={[minVal,maxVal]}
                render={({ field }) => (
                    <Slider
                        {...field}
                        range
                        min={minVal}
                        max={maxVal}
                        marks={months.reduce((acc, month, index) => {
                            acc[2*index] = month;
                            // acc[minVal % 2 == 0 ? 2*index+1: 2*index] = '';
                            return acc;
                        }, {})}
                        onChangeComplete={handleChange}
                        defaultValue={[minVal, maxVal]}
                    />
                )}
            />
            </div>
            <label className={"m-2 center text-center"} style={{fontSize:"0.9rem"}}>Wybrano okres: <br/> od początku {labels[sliderValues[0]]} <br/>do końca {labels[sliderValues[1]-1]}.</label>
        </>

    );
};

export default  CSSModules(MonthSlider, Style);