import React from "react";
import Slider from 'rc-slider';
import "./MonthSlider.css"
import {Control, Controller, FieldValues} from "react-hook-form";
import InputWrapper from "./InputWrapper";


type Props = {
    className?: string,
    label: string,
    name: string,
    watch?: number[],
    form?: {
        setValue: (arg0: string, arg1: any, arg2: { shouldDirty?: boolean; shouldTouch?: boolean; }) => void;
        control: Control<FieldValues, any> | undefined;
    }
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

    const [minVal, maxVal] = props.watch ?? [0, 24]

    React.useEffect(
        () => {
            props.form!.setValue(props.name, props.watch, { shouldDirty: true })
            props.form!.setValue(props.name, props.watch, { shouldTouch: true })
        },
        [props.watch]
    );


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
                render={({ field}) => (
                    <>
                        <Slider style={{height: "80px"}}
                                pushable={true}
                                allowCross={false}
                                {...field}
                                range
                                min={minVal}
                                max={maxVal}
                                marks={
                                    months.reduce((acc, month, index) => {
                                        // @ts-ignore
                                        acc[2 * index] = month;
                                        return acc;
                                    }, {})}
                        />
                        <label className="m-2 center text-center" style={{fontSize: "0.9rem"}}>
                            Wybrano okres: <br/>
                            od początku {labels[field.value[0]]} <br/>
                            do końca {labels[field.value[1] - 1]}.
                        </label>
                    </>
                )}
            />
        </InputWrapper>
    );
};


export default MonthSlider;