import React, {useEffect, useState} from "react";
import {Controller, FieldValues, get, useForm, useWatch} from "react-hook-form";
import FormTemplate from "./Tools/FormTemplate";
import FormTitle from "./Tools/FormTitle";
import FormSelect from "./Inputs/FormSelect";
import FormSection from "./Tools/FormSection";
import MonthSlider from "./Inputs/MonthSlider";
import NumberInput from "./Inputs/NumberInput";
import TextArea from "./Inputs/TextArea";
import "./Tools/CheckGroup"
import checkGroup from "./Tools/CheckGroup";
import FormRadio from "./Inputs/FormRadio";
import FormWithSections from "./Tools/FormWithSections";
import ClickableMap from "./Inputs/ClickableMap";
import IntInput from "./Inputs/IntInput";
import TaskInput from "./Inputs/taskInput/TaskInput";
import BlockList from "./Inputs/BlockList/BlockList";
import BlockListInput from "./Inputs/BlockListInput/BlockListInput";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
function FormC0(){

    const {
        control, trigger,
        watch,
        getValues,
        setValue,
        resetField,
        handleSubmit,
        formState: { errors, dirtyFields } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            managers: null,
            supplyManagers:null,
            years: { label: '2023', value: '2023' },
            acceptedPeriod: [0,24],
            optimalPeriod:[0,24],
            cruiseDays: 0,
            cruiseTime: 0,
            notes:null,
            shipUsage:null,
            diffrentUsage:null,


        }
    });


    const [completedSections, setCompleted] = useState([
        "Sekcja 1",
        "Sekcja2",
    ].map((item)=>[item, false]))



    useEffect(()=>{
        var sec= completedSections;
        ([
            ["Kierownik",["managers","supplyManagers","years"]],
            ["Pozwolenia", ["permissions"]],
            ["Czas", ["acceptedPeriod", "optimalPeriod", "cruiseTime", "cruiseDays", "shipUsage" ]],
            ["Rejon", ["area"]]
        ] as [string, string[]][]).forEach(value => {
            checkGroup(value, completedSections, setCompleted, dirtyFields, errors)
        })
    })

    return (
        <FormTemplate>
            <FormTitle completed={completedSections} title={"Formularz B"}/>
            <FormWithSections onSubmit={handleSubmit(submit)} onChange={()=>console.log(getValues())}>
                <FormSection title={"1. Coś"}
                             completed={completedSections[0]} id={"0"}>
                </FormSection>
            </FormWithSections>
        </FormTemplate>

    )
}

export default FormC0