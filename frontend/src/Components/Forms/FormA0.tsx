import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import FormTemplate from "./Tools/FormTemplate";
import FormTitle from "./Tools/FormTitle";
import FormSelect from "./Inputs/FormSelect";
import FormCreatableSelect from "./Inputs/FormCreatableSelect";
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
import TaskInput from "./Inputs/TaskInput/TaskInput";
import BlockList from "./Inputs/BlockList/BlockList";
import BlockListInput from "./Inputs/BlockListInput/BlockListInput";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
import SpubTask from "./Inputs/SpubTask";
import Api from "../Tools/Api";
function FormA0(){

    const [userData, setUserData] = useState(null)

    useEffect(()=>{
        Api.get('/formA').then(response => setUserData(response.data)).catch(()=>{})
        console.log(userData)
        return () => {};

    },[]);

    const defaultValues = {
        managers: null,
        supplyManagers:null,
        years: { label: '', value: '' },
        acceptedPeriod: [0,24],
        optimalPeriod:[0,24],
        cruiseDays: 0,
        cruiseTime: 0,
        notes:null,
        shipUsage:null,
        diffrentUsage:null,


    }

    const form = useForm({mode: 'onBlur',defaultValues: defaultValues});

        // {
        // control, trigger,
        // watch,
        // getValues,
        // setValue,
        // resetField,
        // handleSubmit,
    //     formState: { errors, dirtyFields }
    // }

    const [sections, setSections] = useState({
        "Kierownik":"Kierownik zgłaszanego rejsu",
        "Czas":"Czas trwania zgłaszanego rejsu",
        "Pozwolenia": "Dodatkowe pozwolenia do planowanych podczas rejsu badań",
        "Rejon":"Rejon prowadzenia badań",
        "Cel":"Cel Rejsu",
        "L.Osób":"Przewidywana liczba osób załogi naukowej.",
        "Zadania":"Zadania do zrealizowania w trakcie rejsu",
        "Umowy":"Lista umów współpracy.",
        "Z.Badawcze":"Zespoły badawcze jakie miałyby uczestniczyć w rejsie.",
        "Publikacje/Prace":"Publikacje i Prace",
        "Efekty":"Efekty rejsu",
        "SPUB":"Zadanie SPUB."})



    // useEffect(()=>{
    //     var sec= completedSections;
    //     ([
    //         ["Kierownik",["managers","supplyManagers","years"]],
    //         ["Pozwolenia", ["permissions"]],
    //         ["Czas", ["acceptedPeriod", "optimalPeriod", "cruiseTime", "cruiseDays", "shipUsage" ]],
    //         ["Rejon", ["area"]],
    //         ["Cel",["goal"]],
    //         ["L.Osób", ["ugEmployees", "guests", "students"]]
    //     ] as [string, string[]][]).forEach(value => {
    //         checkGroup(value, completedSections, setCompleted, dirtyFields, errors)
    //     })
    // })
    return (
        <FormTemplate>
            <FormTitle sections={sections} title={"Formularz A"}/>
            <FormWithSections form={form} onSubmit={()=>{}} onChange={()=>console.log(form.getValues())}>
                <FormSection title={sections.Kierownik}>
                    <FormCreatableSelect className="col-12 col-md-6 col-xl-3" name={"managers"} label={"Kierownik rejsu"} options={[
                        { label: 'Shark', value: 'Shark' },
                        { label: 'Dolphin', value: 'Dolphin' },
                        { label: 'Whale', value: 'Whale' },
                    ]}/>
                    <FormSelect className="d-flex flex-column col-12 col-md-6 col-xl-3"
                                name={"supplyManagers"} label={"Zastępca"} options={[
                        { label: 'Shark', value: 'Shark' },
                        { label: 'Dolphin', value: 'Dolphin' },
                        { label: 'Whale', value: 'Whale' },
                    ]}
                                form={form}/>
                {/*    <FormSelect className="d-flex flex-column col-12 col-md-6 col-xl-3"*/}
                {/*                name={"years"} label={"Rok rejsu"} options={years()}*/}
                {/*                form={form}/>*/}
                {/*</FormSection>*/}
                {/*<FormSection title={sections.Czas}*/}
                {/*             completed={completedSections[1]} >*/}
                {/*    <MonthSlider className={"col-12 col-md-12 col-xl-6"}*/}
                {/*                 name="acceptedPeriod" label={"Dopuszczalny okres, w którym miałby się odbywać rejs:"}*/}
                {/*                 form={form} />*/}
                {/*    <MonthSlider className={"col-12 col-md-12 col-xl-6 p-3"}*/}
                {/*                 name={"optimalPeriod"}  label={"Optymalny okres, w którym miałby się odbywać rejs"}*/}
                {/*                 form={form} watch={watch("acceptedPeriod")}/>*/}
                {/*    <NumberInput className={"col-12 col-md-12 col-xl-6"}*/}
                {/*                 name={"cruiseDays"} label={"Liczba planowanych dób rejsowych"} name2={"cruiseTime"}*/}
                {/*                 newVal={(e)=>24*e}   maxVal={99}*/}
                {/*                 form={form}/>*/}
                {/*    <NumberInput className={"col-12 col-md-12 col-xl-6"}*/}
                {/*                 name={"cruiseTime"}  label={"Liczba planowanych godzin rejsowych"} name2={"cruiseDays"}*/}
                {/*                 newVal={(e)=>Number((e/24).toFixed(2))}  maxVal={99}*/}
                {/*                 form={form}/>*/}

                {/*    <TextArea className={"col-12 p-3"}*/}
                {/*              label={"Uwagi dotyczące teminu"} name={"notes"}*/}
                {/*              form={form}/>*/}
                {/*    <FormRadio*/}
                {/*        className={"col-12 col-md-12 col-xl-6 p-3"}*/}
                {/*        label={"Czy statek na potrzeby badań będzie wykorzystywany:"} name={"shipUsage"}*/}
                {/*               values={["całą dobę","jedynie w ciągu dnia (max. 8-12h)",*/}
                {/*                   "jedynie w nocy (max. 8-12h)",*/}
                {/*                   "8-12h w ciągu doby rejsowej, ale bez znaczenia o jakiej porze albo z założenia o różnych porach",*/}
                {/*               "w inny sposób"]} form={form}/>*/}

                {/*    {(() => {*/}
                {/*        if ( watch("shipUsage") == "w inny sposób" ) {*/}
                {/*            return (*/}
                {/*                <TextArea className={"col-12 col-md-12 col-xl-6 p-3"}*/}
                {/*                          label={"Inny sposób użycia"} name={"diffrentUsage"} required={"Podaj sposób"}*/}
                {/*                          form={form}/>*/}
                {/*            )*/}
                {/*        } else return <></>*/}
                {/*    })()}*/}


                </FormSection>
            {/*    <FormSection completed={completedSections[2]} id={"2"}*/}
            {/*                 title={sections.Pozwolenia}>*/}
            {/*        <FormRadio*/}
            {/*            className={"col-12 col-md-12 col-xl-6 p-3"}*/}
            {/*            label={"Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?:"} name={"permissions"}*/}
            {/*            values={["tak", "nie"]} form={form}/>*/}

            {/*        {(() => {*/}
            {/*            if ( watch("permissions") == "tak" ) {*/}
            {/*                return (*/}
            {/*                    <TextArea className={"col-12 col-md-12 col-xl-6 p-3"}*/}
            {/*                              label={"Jakie?"} name={"additionalPermissions"} required={"Podaj jakie"}*/}
            {/*                              form={form} />*/}
            {/*                )*/}
            {/*            } else return <></>*/}
            {/*        })()}*/}
            {/*    </FormSection>*/}
            {/*    <FormSection completed={completedSections[3]} id={"3"} title={sections.Rejon}>*/}
            {/*       <ClickableMap label={"Obszar prowadzonych badań"} name={"area"} form={form}/>*/}
            {/*        <TextArea className={"col-12 col-md-12 col-xl-6 p-3"}*/}
            {/*                  label={"Opis"} name={"areaInfo"}*/}
            {/*                  form={form}/>*/}
            {/*    </FormSection>*/}
            {/*    <FormSection completed={completedSections[4]} id={"4"} title={sections.Cel}>*/}
            {/*        <FormRadio*/}
            {/*            className={"col-12 col-md-12 col-xl-6 p-3"}*/}
            {/*            label={"Cel rejsu"} name={"goal"} form={form}*/}
            {/*            values={["Naukowy", "Komercyjny", "Dydaktyczny"]} />*/}
            {/*        <TextArea className={"col-12 col-md-12 col-xl-6 p-3"}*/}
            {/*                  label={"Opis"} name={"goalaInfo"}*/}
            {/*                  form={form} required={"Opisz cel"}/>*/}
            {/*    </FormSection>*/}
            {/*    <FormSection completed={completedSections[5]} id={"5"}*/}
            {/*                 title={}>*/}
            {/*        <IntInput   className={"col-12 col-md-12 col-xl-6 p-3"}*/}
            {/*                label={"Pracownicy UG"} name={"ugEmployees"} maxVal={20} form={form}/>*/}
            {/*        <IntInput   className={"col-12 col-md-12 col-xl-6 p-3"}*/}
            {/*                    label={"Studenci I, II st. i doktoranci"} name={"students"} maxVal={20} form={form}/>*/}
            {/*        <IntInput   className={" col-12 col-md-12 col-xl-6 p-3"}*/}
            {/*                    label={"Goście / osoby spoza UG"} name={"guests"}  maxVal={20} form={form}/>*/}

            {/*    </FormSection>*/}
            {/*    <FormSection completed={completedSections[6]} id={"6"}*/}
            {/*                 title={sections.Zadania}>*/}
            {/*        <TaskInput name={"wejscie"} form={form} className={"col-12"} label={""}/>*/}
            {/*    </FormSection>*/}
            {/*    <FormSection completed={completedSections[7]} id={"7"} title={sections.Umowy}>*/}
            {/*        <text style={{height: "200px"}}>*/}
            {/*            ss*/}
            {/*        </text>*/}
            {/*        <div></div>*/}
            {/*    </FormSection>*/}
            {/*    <FormSection completed={completedSections[8]} id={"8"}*/}
            {/*                 title={sections["Z.Badawcze"]}>*/}
            {/*        <BlockListInput className={"col-12 col-xl-4 "} form={form} label={"Uczestnictwo naukowców spoza UG"} name={"blockListInput2"}/>*/}
            {/*        <BlockListInput className={"col-12 col-xl-4 "} form={form} label={"Uczestnictwo naukowców z jednostek organizacyjnych UG spoza WOiG"} name={"blockListInput"}/>*/}
            {/*        <BlockList className={"col-12 col-xl-4"} form={form} label={"Uczestnictwo osób z jednostek organizacyjnych WOiG UG"} name={"blockList"}/>*/}

            {/*    </FormSection>*/}
            {/*    <FormSection completed={completedSections[9]} id={"9"} title={sections["Publikacje/Prace"]}>*/}
            {/*      </FormSection>*/}
            {/*    <FormSection completed={completedSections[10]} id={"10"} title={sections.Efekty}>*/}
            {/*        <TaskInput name={"wejscie2"} form={form} className={"col-12"} label={""}/>*/}

            {/*    </FormSection>*/}

            {/*    <FormSection completed={completedSections[11]} id={"11"} title={sections.SPUB}>*/}
            {/*    <SpubTask label={"Zadania do wykonania w trakcie rejsu"} name={"spubTask"} form={form}/>*/}
            {/*    </FormSection>*/}

            {/*    <button type={"submit"}/>*/}
            </FormWithSections>
        </FormTemplate>

    )
}

export default FormA0