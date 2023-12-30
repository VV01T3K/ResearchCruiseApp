import React, { useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import Style from "./MultiRangeSlider.css"
import CSSModules from "react-css-modules";
import {Control, Controller, FieldValues} from "react-hook-form";

const MonthSlider = (props: { label: string, name: string, control: Control<FieldValues, any> | undefined, minVal?: string | number | undefined, maxVal?: string | number | undefined, handleInput?: (arg0: any[]) => void}) => {
    const months = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień',
        'Maj', 'Czerwiec', 'Lipiec', 'Sierpień',
        'Wrzesień', 'Październik', 'Listopad', 'Grudzień', ''


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

    const [minValue, set_minValue] = useState(1);
    const [maxValue, set_maxValue] = useState(2);
    const slicedMonths = months.slice(props.minVal as number/2 ?? 0 ,(props.maxVal as number/2 + 1)  ?? 13)
    if((props.maxVal ?? 24) <24 )slicedMonths.pop()
        if((props.maxVal ?? 24) <24 )slicedMonths.push(' ')
    const handleInput = (e: { min?: number; max?: number; minValue: any; maxValue: any; }) => {
        console.log("pies")
        set_minValue(e.minValue);
        set_maxValue(e.maxValue);
        if(props.handleInput)props.handleInput([e.minValue, e.maxValue])
    };

    return (
        <>
        <label>{props.label}</label>
            <Controller
                name={props.name}
                control={props.control}
                render={({field}) => (
                    <>
        <MultiRangeSlider {...field}
            min={props.minVal ?? 0}
                max={props.maxVal ?? 24}
                step={1}
                minValue={minValue}
                maxValue={maxValue}
                onChange={(e) => {
                    handleInput(e)
                }}
            labels={slicedMonths}
            />
                    </>
                )}
            />
            <label className={"m-2 center text-center"} style={{fontSize:"0.9rem"}}>Wybrano okres: <br/> od początku {labels[minValue]} <br/>do końca {labels[maxValue-1]}.</label>
        </>

    );
};

export default  CSSModules(MonthSlider, Style);