import React from "react";
import Slider from 'rc-slider';
import "./MonthSlider.css"
import {Control, Controller, FieldValues, UseFormReturn} from "react-hook-form";
import InputWrapper from "./InputWrapper";
import {prop} from "react-data-table-component/dist/DataTable/util";
import {FormValues} from "../Wrappers/FormTemplate";


type Props = {
    className?: string,
    label: string,
    name: keyof FormValues,
    watch?: number[],
    connectedName?: keyof FormValues,
    range?,
    form?: UseFormReturn<FormValues>
    readonly?: boolean

}


const MonthSlider = (props: Props) => {
    const months = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik',
        'Listopad', 'Grudzień', null
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

    return (
        <InputWrapper {...props}>
            <Controller
                name={props.name}
                control={props.form!.control}
                defaultValue={[0,24]}
                rules={{required: 'Wybierz jedną z opcji',
                    validate: {differenceCheck:(val)=>{if(val[0]==0&&val[1]==24) return "Ustaw krótszy okres"}}}}


                render={({ field}) => (
                    <>
                        <Slider style={{height: "77px"}}

                                pushable={true}
                                allowCross={false}
                                {...field}
                                range
                                min={minVal}
                                max={maxVal}
                                onChange={props.readonly ? ()=>{} : (e
                                )=>{
                                    props.form!.setValue(props.name, e, { shouldDirty: true, shouldTouch: true, shouldValidate:true })

                                    if(props.connectedName)
                                        props.form!.setValue(props.connectedName, props.form!.getValues(props.name), { shouldDirty: true, shouldTouch: true, shouldValidate:true })

                                }}
                                marks={
                                    months.reduce((acc, month, index) => {
                                        // @ts-ignore
                                        acc[2 * index] = month;
                                        return acc;
                                    }, {})}
                        />
                        <label className={` text-center ${props.readonly ? "d-none": ""}`}>
                            Wybrano okres:
                            od początku {field.value && labels[field.value[0]] + " "}
                            do końca {field.value && labels[field.value[1] - 1]}.
                        </label>
                    </>
                )}
            />
        </InputWrapper>
    );
};


export default MonthSlider;