import React, {useEffect, useState} from "react";
import {Controller, FieldValues, useForm} from "react-hook-form";
import ErrorCode from "../LoginPage/ErrorCode";
import Select from 'react-select';
import FormTemplate from "./Tools/FormTemplate";
import FormTitle from "./Tools/FormTitle";
import FormSelect from "./Inputs/FormSelect";
import FormSection from "./Tools/FormSection";
import MonthSlider from "./Inputs/MonthSlider";
import NumberInput from "./Inputs/NumberInput";
import TextArea from "./Inputs/TextArea";
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
    const { control, getValues, setValue,register,resetField, handleSubmit, formState: { errors, dirtyFields } } = useForm({
        mode: 'onBlur'});

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

    function checkGroup(group:[string, string[]]) {
        if(group[1].map((value: string)=>{return (dirtyFields[value]!=undefined && errors[value])==undefined}).reduce((sum, next)=> sum && next, true)) {
            if (completedSections.some(item =>  item[0] === group[0] && item[1] === false)) {
                setCompleted(completedSections.map((value, index) => {
                    return value[0] == group[0] ? value.map((item, index) => index == 1 ? true : item) : value
                }))

            }
        }
        else
            if(completedSections.some(item => item[0] === group[0] && item[1] === true)) {
                setCompleted(completedSections.map((value, index) => {
                    return value[0] == group[0] ? value.map((item, index) => index == 1 ? false : item) : value
                }))

            }
    }

    useEffect(()=>{
        var sec= completedSections;
        ([
            ["Kierownik",["managers","supplyManagers","years"]],
            ["Pozwolenia", ["permissions"]],
            ["Czas", ["acceptedPeriod", "optimalPeriod"]]
        ] as [string, string[]][]).forEach(value => {
            checkGroup(value)
        })
    })

    const [minmaxAcceptedPeriod, setMinmaxAcceptedPeriod] = useState([0,24])
    const handleInput = (arg: React.SetStateAction<number[]>) => {
        setMinmaxAcceptedPeriod(arg)
        resetField("optimalPeriod")
    }

    const [cruiseTime, setCruiseTime] = useState(1);

    return (
        <FormTemplate>
            <FormTitle completed={completedSections} title={"Formularz A"}/>
            <form className={" flex-grow-1 overflow-auto justify-content-center z-1"} onSubmit={()=>console.log(getValues())}> //
                <FormSection completed={completedSections[0]} id={"0"} title={"1. Kierownik zgłaszanego rejsu"}>
                    <FormSelect className="d-flex flex-column col-12 col-md-6 col-xl-3" name={"managers"} label={"Kierownik rejsu"} control={control}
                                options={managers()} errors={errors}/>
                    <FormSelect className="d-flex flex-column col-12 col-md-6 col-xl-3" name={"supplyManagers"} label={"Zastępca"} control={control}
                                options={supplyManagers()} errors={errors}/>
                    <FormSelect className="d-flex flex-column col-12 col-md-6 col-xl-3" name={"years"} label={"Rok rejsu"} control={control}
                                options={years()} errors={errors}/>
                </FormSection>
                <FormSection completed={completedSections[1]} id={"1"} title={"2. Czas trwania zgłaszanego rejsu"}>
                    <MonthSlider className={"d-flex flex-column col-12 col-md-12 col-xl-6"} handleInput={handleInput} name="acceptedPeriod"
                                 control={control} label={"Dopuszczalny okres, w którym miałby się odbywać rejs:"}/>
                    <MonthSlider className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"} minMaxVal={minmaxAcceptedPeriod} name={"optimalPeriod"} control={control}
                                 label={"Optymalny okres, w którym miałby się odbywać rejs"}/>
                    <NumberInput handleInput={(e)=>{setCruiseTime(Number(e*24)); setValue("cruiseDays", Number(e/24));} }className={"d-flex flex-column col-12 col-md-12 col-xl-6"} name={"cruiseDays"} label={"Liczba planowanych dób rejsowych"}
                                  maxVal={99} default={String(Number(cruiseTime/24))} control={control} errors={errors}/>
                    <NumberInput handleInput={(e)=>{setCruiseTime(e); setValue("cruiseTime", Number(e))} } className={"d-flex flex-column col-12 col-md-12 col-xl-6"} name={"cruiseTime"} label={"Liczba planowanych godzin rejsowych"}
                                  maxVal={99} default={String(cruiseTime)} control={control} errors={errors}/>

                    <TextArea label={"Uwagi dotyczące teminu"} control={control} errors={errors} name={"notes"} className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}/>
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