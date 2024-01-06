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
function FormA0(){
    async function loginUser(data:FieldValues) {
        return fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data, null, 2)
        })
            .then(data => data.json())
    }

    const onSubmit = async (data:FieldValues) => {
        setLoading(true);


        setLoading(false)

    }
    const [ loading, setLoading ] = useState(false);
    const { control, trigger, watch, getValues, setValue,register,resetField, handleSubmit, formState: { errors, dirtyFields } } = useForm({
        mode: 'onBlur',
        defaultValues: {
            cruiseDays: 0,
            cruiseTime: 0
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
            ["Czas", ["acceptedPeriod", "optimalPeriod", "cruiseDays", "cruiseTime", "shipUsage"]]
        ] as [string, string[]][]).forEach(value => {
            checkGroup(value, completedSections, setCompleted, dirtyFields, errors)
        })
    })

    const [minmaxAcceptedPeriod, setMinmaxAcceptedPeriod] = useState([0,24])

    const hiddenArea = watch('shipUsage')
    return (
        <FormTemplate>
            <FormTitle completed={completedSections} title={"Formularz A"}/>
            <form className={" flex-grow-1 overflow-auto justify-content-center z-1"} onChange={()=>console.log(getValues())}>
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
                                 handleInput={
                                     (arg)=>{
                                         setMinmaxAcceptedPeriod(arg)
                                         resetField("optimalPeriod")
                                     }
                                 } control={control} />
                    <MonthSlider className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                                 name={"optimalPeriod"}  label={"Optymalny okres, w którym miałby się odbywać rejs"}
                                 minMaxVal={minmaxAcceptedPeriod} control={control}/>
                    <NumberInput className={"d-flex flex-column col-12 col-md-12 col-xl-6"}
                                 name={"cruiseDays"} label={"Liczba planowanych dób rejsowych"} name2={"cruiseTime"}
                                 newVal={(e)=>24*e}   maxVal={99}
                                 control={control} errors={errors} setValue={setValue}/>
                    <NumberInput className={"d-flex flex-column col-12 col-md-12 col-xl-6"}
                                 name={"cruiseTime"}  label={"Liczba planowanych godzin rejsowych"} name2={"cruiseDays"}
                                 newVal={(e)=>Number((e/24).toFixed(2))}  maxVal={99}
                                 control={control} errors={errors} setValue={setValue}/>

                    <TextArea className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                              label={"Uwagi dotyczące teminu"} name={"notes"}
                              control={control} errors={errors} setValue={setValue}/>
                    <FormRadio label={"Czy statek na potrzeby badań będzie wykorzystywany:"} name={"shipUsage"} control={control}
                               options={["całą dobę","jedynie w ciągu dnia (max. 8-12h)",
                                   "jedynie w nocy (max. 8-12h)",
                                   "8-12h w ciągu doby rejsowej, ale bez znaczenia o jakiej porze albo z założenia o różnych porach",
                               "w inny sposób"]} errors={errors}/>
                    { (hiddenArea == 'w inny sposób') &&
                        <TextArea className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}
                                  label={"Inny sposób użycia"} name={"diffrentUsage"} required={true}
                                  control={control} errors={errors} setValue={setValue}/>
                    }
                </FormSection>
                <FormSection completed={completedSections[2]} id={"2"}
                             title={"3. Dodatkowe pozwolenia do planowanych podczas rejsu badań"}>
                    <TextArea label={"Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?"} control={control} errors={errors} name={"notes2"} className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}/>
                </FormSection>
                <FormSection completed={completedSections[3]} id={"3"} title={"4. Rejon prowadzenia badań"}>
                    <div/>
                </FormSection>
                <FormSection completed={completedSections[4]} id={"4"} title={"5. Cel Rejsu"}>
                    <text style={{height: "200px"}}>
                        ss
                    </text>
                    <div></div>
                </FormSection>
                <FormSection completed={completedSections[5]} id={"5"}
                             title={"6. Przewidywana liczba osób załogi naukowej."}>

                </FormSection>
                <FormSection completed={completedSections[6]} id={"6"}
                             title={"7. Zadania do zrealizowania w trakcie rejsu"}>
                    <text style={{height: "200px"}}>
                        ss
                    </text>
                    <div></div>
                </FormSection>
                <FormSection completed={completedSections[7]} id={"7"} title={"8. Lista umów współpracy."}>
                    <text style={{height: "200px"}}>
                        ss
                    </text>
                    <div></div>
                </FormSection>
                <FormSection completed={completedSections[8]} id={"8"}
                             title={"9. Zespoły badawcze jakie miałyby uczestniczyć w rejsie."}>

                </FormSection>
                <FormSection completed={completedSections[9]} id={"9"} title={"10. Publikacje i Prace"}>
                    <text style={{height: "200px"}}>
                        ss
                    </text>
                    <div></div>
                </FormSection>
                <FormSection completed={completedSections[10]} id={"10"} title={"11. Efekty rejsu"}>
                </FormSection>

                <FormSection completed={completedSections[11]} id={"11"} title={"12. Zadanie SPUB."}>

                </FormSection>

                <button type={"submit"}/>
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
            </form>
        </FormTemplate>

    )
}

export default FormA0