import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
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
function FormA0(){

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

    const managers = (): readonly any[] => {
        return [
            { label: 'Shark', value: 'Shark' },
            { label: 'Dolphin', value: 'Dolphin' },
            { label: 'Whale', value: 'Whale' },

        ];
    }

    const supplyManagers = (): readonly any[] => {
        return [
            { label: 'Octopus', value: 'Octopus' },
            { label: 'Crab', value: 'Crab' },
            { label: 'Lobster', value: 'Lobster' },
        ];
    }


    const years = (): readonly any[] => {
        return [
            { label: '2023', value: '2023' },
        ];
    }

    const [completedSections, setCompleted] = useState([
        "Kierownik",
        "Czas",
        "Pozwolenia",
        "Rejon",
        "Cel",
        "L.Osób",
        "Zadania",
        "Umowy",
        "Z.Badawcze",
        "Publikacje/Prace",
        "Efekty",
        "SPUB"
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


    const hiddenArea = watch('shipUsage')
    return (
        <FormTemplate>
            <FormTitle completed={completedSections} title={"Formularz A"}/>
            <FormWithSections onSubmit={handleSubmit(submit)} onChange={()=>console.log(getValues())}>
                <FormSection title={"1. Kierownik zgłaszanego rejsu"}
                             completed={completedSections[0]} id={"0"}>
                    <FormSelect className="d-flex flex-column col-12 col-md-6 col-xl-3"
                                name={"managers"} label={"Kierownik rejsu"}  options={managers()}
                                control={control} errors={errors}/>
                    <FormSelect className="d-flex flex-column col-12 col-md-6 col-xl-3"
                                name={"supplyManagers"} label={"Zastępca"} options={supplyManagers()}
                                control={control} errors={errors}/>
                    <FormSelect className="d-flex flex-column col-12 col-md-6 col-xl-3"
                                name={"years"} label={"Rok rejsu"} options={years()}
                                control={control} errors={errors}/>
                </FormSection>
                <FormSection title={"2. Czas trwania zgłaszanego rejsu"}
                             completed={completedSections[1]} id={"1"} >
                    <MonthSlider className={"d-flex flex-column col-12 col-md-12 col-xl-6"}
                                 name="acceptedPeriod" label={"Dopuszczalny okres, w którym miałby się odbywać rejs:"}
                                 control={control} />
                    <MonthSlider className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                                 name={"optimalPeriod"}  label={"Optymalny okres, w którym miałby się odbywać rejs"}
                                 control={control} watch={watch("acceptedPeriod")} setValue={setValue} resetField={resetField}/>
                    <NumberInput className={"d-flex flex-column col-12 col-md-12 col-xl-6"}
                                 name={"cruiseDays"} label={"Liczba planowanych dób rejsowych"} name2={"cruiseTime"}
                                 newVal={(e)=>24*e}   maxVal={99}
                                 control={control} errors={errors} setValue={setValue}/>
                    <NumberInput className={"d-flex flex-column col-12 col-md-12 col-xl-6"}
                                 name={"cruiseTime"}  label={"Liczba planowanych godzin rejsowych"} name2={"cruiseDays"}
                                 newVal={(e)=>Number((e/24).toFixed(2))}  maxVal={99}
                                 control={control} errors={errors} setValue={setValue}/>

                    <TextArea className={"d-flex flex-column col-12 p-3"}
                              label={"Uwagi dotyczące teminu"} name={"notes"}
                              control={control} errors={errors} setValue={setValue}/>
                    <FormRadio
                        className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                        label={"Czy statek na potrzeby badań będzie wykorzystywany:"} name={"shipUsage"} control={control}
                               values={["całą dobę","jedynie w ciągu dnia (max. 8-12h)",
                                   "jedynie w nocy (max. 8-12h)",
                                   "8-12h w ciągu doby rejsowej, ale bez znaczenia o jakiej porze albo z założenia o różnych porach",
                               "w inny sposób"]} errors={errors}/>

                    {(() => {
                        if ( watch("shipUsage") == "w inny sposób" ) {
                            return (
                                <TextArea className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                                          label={"Inny sposób użycia"} name={"diffrentUsage"} required={"Podaj sposób"}
                                          control={control} errors={errors} setValue={setValue}/>
                            )
                        } else return <></>
                    })()}


                </FormSection>
                <FormSection completed={completedSections[2]} id={"2"}
                             title={"3. Dodatkowe pozwolenia do planowanych podczas rejsu badań"}>
                    <FormRadio
                        className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                        label={"Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?:"} name={"permissions"} control={control}
                        values={["tak", "nie"]} errors={errors}/>

                    {(() => {
                        if ( watch("permissions") == "tak" ) {
                            return (
                                <TextArea className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                                          label={"Jakie?"} name={"additionalPermissions"} required={"Podaj jakie"}
                                          control={control} errors={errors} setValue={setValue}/>
                            )
                        } else return <></>
                    })()}
                </FormSection>
                <FormSection completed={completedSections[3]} id={"3"} title={"4. Rejon prowadzenia badań"}>
                   <ClickableMap label={"Obszar prowadzonych badań"} name={"area"} setValue={setValue} control={control} errors={errors}/>
                    <TextArea className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                              label={"Opis"} name={"areaInfo"}
                              control={control} errors={errors} setValue={setValue}/>
                </FormSection>
                <FormSection completed={completedSections[4]} id={"4"} title={"5. Cel Rejsu"}>
                    <FormRadio
                        className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                        label={"Cel rejsu"} name={"goal"} control={control}
                        values={["Naukowy", "Komercyjny", "Dydaktyczny"]} errors={errors}/>
                    <TextArea className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                              label={"Opis"} name={"goalaInfo"}
                              control={control} errors={errors} required={"Opisz cel"} setValue={setValue}/>
                </FormSection>
                <FormSection completed={completedSections[5]} id={"5"}
                             title={"6. Przewidywana liczba osób załogi naukowej."}>
                    <IntInput   className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                            label={"Pracownicy UG"} name={"ugEmployees"} setValue={setValue} maxVal={20} control={control} errors={errors}/>
                    <IntInput   className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                                label={"Studenci I, II st. i doktoranci"} name={"students"} setValue={setValue} maxVal={20} control={control} errors={errors}/>
                    <IntInput   className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                                label={"Goście / osoby spoza UG"} name={"guests"} setValue={setValue} maxVal={20} control={control} errors={errors}/>

                </FormSection>
                <FormSection completed={completedSections[6]} id={"6"}
                             title={"7. Zadania do zrealizowania w trakcie rejsu"}>
                    <TaskInput setValue={setValue} name={"wejscie"} control={control} className={"d-flex flex-column col-12"} label={""}/>
                </FormSection>
                <FormSection completed={completedSections[7]} id={"7"} title={"8. Lista umów współpracy."}>
                    <text style={{height: "200px"}}>
                        ss
                    </text>
                    <div></div>
                </FormSection>
                <FormSection completed={completedSections[8]} id={"8"}
                             title={"9. Zespoły badawcze jakie miałyby uczestniczyć w rejsie."}>
                    <BlockListInput className={"col-12 col-xl-4 "} errors={errors} setValue={setValue} dirtyFields={dirtyFields} label={"Uczestnictwo naukowców spoza UG"} control={control} name={"blockListInput2"}/>
                    <BlockListInput className={"col-12 col-xl-4 "} errors={errors} setValue={setValue} dirtyFields={dirtyFields} label={"Uczestnictwo naukowców z jednostek organizacyjnych UG spoza WOiG"} control={control} name={"blockListInput"}/>
                    <BlockList className={"col-12 col-xl-4"} label={"Uczestnictwo osób z jednostek organizacyjnych WOiG UG"} control={control} name={"blockList"}/>

                </FormSection>
                <FormSection completed={completedSections[9]} id={"9"} title={"10. Publikacje i Prace"}>
                  </FormSection>
                <FormSection completed={completedSections[10]} id={"10"} title={"11. Efekty rejsu"}>
                    <TaskInput setValue={setValue} name={"wejscie2"} control={control} className={"d-flex flex-column col-12"} label={""}/>

                </FormSection>

                <FormSection completed={completedSections[11]} id={"11"} title={"12. Zadanie SPUB."}>

                </FormSection>


                {/*<div className="txt_field">*/}
                {/*    <input type="password" disabled={loading}  {...register("password", {*/}
                {/*        required: true,*/}
                {/*        maxLength: 10*/}
                {/*    })}/>*/}
                {/*    <span></span>*/}
                {/*    <label>Password</label>*/}
                {/*</div>*/}
                {/*{errors.password && <ErrorCode code={"Password -> daj dobre hasło"}/>}*/}
                {/*<button type={"submit"}/>*/}
            </FormWithSections>
        </FormTemplate>

    )
}

export default FormA0