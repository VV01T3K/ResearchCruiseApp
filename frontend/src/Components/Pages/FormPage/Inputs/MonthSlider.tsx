import React, {useContext, useEffect, useState} from "react";
import Slider from 'rc-slider';
import "./MonthSlider.css"
import {FieldValues, useFormContext} from "react-hook-form";
import FieldWrapper from "./FieldWrapper";
import {FormContext} from "../Wrappers/FormTemplate";
import {readyFieldOptions} from "../Wrappers/ReactSelectWrapper";
import {read} from "@popperjs/core";
import {concatenate} from "workbox-streams";


type Props = {
    className?: string,
    fieldLabel: string,
    fieldName: string,
    range?: [number,number],
    fieldNameToAlsoSet?:string
}

type MonthRange = [number, number]

const MonthSlider = (props: Props) => {
    const formContext = useContext(FormContext)

    const months = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik',
        'Listopad', 'Grudzień', null // begin of next's year
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

    const [minVal, maxVal] = props.range ?? [0, 24]

    const slicedMonths = months.slice((minVal + 1) / 2, (maxVal) / 2 + 1)

    months.forEach((element, index, arr) => {
        if (!slicedMonths.includes(element)) {
            arr[index] = null;
        }
    });

    const onChange = (selectedOption: MonthRange) => {
        formContext!.setValue( props.fieldName, selectedOption, readyFieldOptions);
        if(props.fieldNameToAlsoSet)
            formContext!.setValue(props.fieldNameToAlsoSet, formContext!.getValues(props.fieldName), { shouldDirty: true, shouldTouch: true, shouldValidate:true })
    }

    type MonthsMarks = {
        [key: number]: string | null;
    };

    // User can select every half of the month
    const monthsMarks = months.reduce((acc:MonthsMarks, month, index) => {
        acc[2 * index] = month;
        return acc;
    }, {})


    const render = ({field}: FieldValues) => {
        const MonthLabel = () => (
            <label className={` text-center ${formContext!.readOnly ? "d-none" : ""}`}>
                Wybrano okres:
                od początku {field.value && labels[field.value[0]] + " "}
                do końca {field.value && labels[field.value[1] - 1]}.
            </label>
        )

        const sliderOptions = {
            pushable:true,
            allowCross:false,
            range:true,
            min:minVal,
            max:maxVal,
            marks:monthsMarks
        }

        // workaround for context rendering
        const [value, setValue] = useState(formContext?.getValues(props.fieldName))
        useEffect(() => {
            setValue(formContext?.getValues(props.fieldName))
        }, [formContext]);

        return(
            <div className={"ps-3 pe-3"}>
                <Slider
                    {...field} onChange={(e)=>setValue(e)}
                    {...sliderOptions} disabled={formContext?.readOnly}
                    value={value} onChangeComplete={onChange}
                />
                <MonthLabel/>
            </div>
        )
    }
    const selectedWholeYear = (val:MonthRange) => (val[0]==0&&val[1]==24)
    const fieldProps = {
        ...props,
        rules: {required: 'Wybierz jedną z opcji',
            validate: {differenceCheck: (val:MonthRange)=>selectedWholeYear(val) && "Ustaw krótszy okres"}},
        render: render,
        defaultValue:[0,24]
    }

    return ( <FieldWrapper {...fieldProps}/> );
};


export default MonthSlider;