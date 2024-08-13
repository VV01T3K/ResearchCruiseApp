import {
    Controller,
    UseFormReturn,
} from "react-hook-form";
import React, {useRef, useState} from "react";
import ErrorMessageIfPresent from "../../CommonComponents/ErrorMessageIfPresent";
import Map from '../../../../resources/GraniceSamorzadow.jpg'
import FieldWrapper from "./FieldWrapper";import Select from "react-select";
import {FormValues} from "../Wrappers/FormTemplate";

export type ResearchArea = {
    name: string,
    x: number[],
    y: number[]
}

type Props = {
    className?: string,
    label: string,
    name: keyof FormValues,
    required?: boolean,
    regions?: ResearchArea[],
    form?: UseFormReturn<FormValues>,
    readonly?: boolean
}


function ClickableMap(props: Props) {
    const [clickPosition, setClickPosition] =
        useState({ x: 0, y: 0 });
    const imageRef = useRef(null);


    const handleClick = (e) => {
        const boundingRect = imageRef.current.getBoundingClientRect();
        const offsetX = e.clientX - boundingRect.left;
        const offsetY = e.clientY - boundingRect.top;

        regions?.forEach((region, index)=> {
            if (isInside({ x: offsetX, y: offsetY }, region.X, region.Y))
                props.form.setValue(props.name, index, { shouldDirty: true, shouldTouch:true });
            // setClickPosition({ x: offsetX, y: offsetY });
        })
    }

    const isInside = (point: { x: any; y: any; }, xArr, yArr) => {
        const x = point.x;
        const y = point.y;

        let inside = false;
        for (let i = 0, j = xArr.length - 1; i < xArr.length; j = i++) {
            const xi = xArr[i];
            const yi = yArr[i];
            const xj = xArr[j];
            const yj = yArr[j];

            const intersect =
                yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

            if (intersect)
                inside = !inside;
        }

        return inside;
    };

    // console.log()

    return (
        <FieldWrapper {...props}>
            <Controller
                //defaultValue={""}
                render={({ field}) =>
                    <div className="d-flex flex-column">
                        <Select
                            minMenuHeight={300}
                            // className={"text-white"}
                            isDisabled={props.readonly ?? false}
                            menuPlacement="auto"
                            styles={{
                                menu: provided => ({
                                    ...provided,
                                    zIndex: 9999
                                })
                            }}
                            placeholder={"Wybierz"}
                            value={{
                                label: ((props.regions && typeof(field.value) === 'number') ? props.regions[field.value].name : ""),
                                value: field.value
                            }}
                            options={props.regions?.map((value, index) => ({
                                label: value.name,
                                value: index
                            }))}
                            // closeMenuOnScroll={() => true}
                            onChange={(selectedOption) => {
                                props.form?.setValue(
                                    props.name,
                                    selectedOption?.value,
                                    { shouldDirty: true, shouldTouch:true }
                                );
                            }}
                        />
                        <img ref={imageRef}
                             className="shadow m-2 bg-white rounded w-100"
                             draggable={false}
                             style={{cursor: "pointer"}}
                             src={Map}
                             alt="Obszary"
                             onClick={props.readonly ? ()=>null : handleClick}
                        />
                    </div>
                }
                name={props.name}
                control={props.form?.control}
                rules={{
                    required: "Wybierz obszar"
                }}
            />
        </FieldWrapper>
    )
}


export default ClickableMap