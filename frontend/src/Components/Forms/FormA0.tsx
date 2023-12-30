import React, {useEffect, useState} from "react";
import {Controller, FieldValues, useForm} from "react-hook-form";
import ErrorCode from "../LoginPage/ErrorCode";
import Select from 'react-select';
import FormTemplate from "./Tools/FormTemplate";
import FormTitle from "./Tools/FormTitle";
import FormSelect from "./Tools/FormSelect";
import FormSection from "./Tools/FormSection";
import MonthSlider from "../Tools/MonthSlider";
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
    const { control,register,resetField, handleSubmit, formState: { errors, dirtyFields } } = useForm({
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
    function handleInput(arg){
        setMinmaxAcceptedPeriod(arg)
        resetField("optimalPeriod")
    }
    return (
        <FormTemplate>
            <FormTitle completed={completedSections} title={"Formularz A"}/>
            <form className={" flex-grow-1 overflow-auto justify-content-center z-1"} onSubmit={handleSubmit(onSubmit)}>
                <FormSection completed={completedSections[0]} id={"0"} title={"1. Kierownik zgłaszanego rejsu"}>
                    <div className="d-flex flex-column col-12 col-md-6 col-xl-3 p-3 ">
                        <FormSelect name={"managers"} label={"Kierownik rejsu"} control={control} options={managers()}
                                    errors={errors}/>
                    </div>
                    <div className="d-flex flex-column col-12 col-md-6 col-xl-3 p-3">
                        <FormSelect name={"supplyManagers"} label={"Zastępca"} control={control}
                                    options={supplyManagers()} errors={errors}/>
                    </div>
                    <div className="d-flex flex-column col-12 col-md-6 col-xl-3 p-3">
                        <FormSelect name={"years"} label={"Rok rejsu"} control={control} options={years()}
                                    errors={errors}/>
                    </div>
                </FormSection>
                <FormSection completed={completedSections[1]} id={"1"} title={"2. Czas trwania zgłaszanego rejsu"}>

                    <div className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}>
                        <MonthSlider handleInput={handleInput} maxVal={24} minVal={0} name="acceptedPeriod"
                                     control={control} label={"Dopuszczalny okres, w którym miałby się odbywać rejs:"}/>
                    </div>
                    <div className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}>

                        <MonthSlider key={minmaxAcceptedPeriod} name="optimalPeriod" maxVal={minmaxAcceptedPeriod[1]}
                                     minVal={minmaxAcceptedPeriod[0]} control={control}
                                     label={"Optymalny okres, w którym miałby się odbywać rejs"}/>
                    </div>
                    <div className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}>
                        <label> Liczba planowanych dób rejsowych
                        </label>
                        <input type={"textbox"}/>

                    </div>
                    <div className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}>
                        <label> Liczba planowanych dób rejsowych
                        </label>
                        <input type={"textbox"}/>

                    </div>
                    <div className={"d-flex flex-column col-12 col-md-12 col-xl-6 p-3"}>
                        <label> Uwagi dotyczące teminu
                        </label>
                        <textarea rows="4" cols="50" />

                    </div>
                </FormSection>
                <FormSection completed={completedSections[2]} id={"2"}
                             title={"3. Dodatkowe pozwolenia do planowanych podczas rejsu badań"}>
                    <div className="d-flex flex-column col-12 col-md-6 col-xl-3 p-1">
                    <input type="text" disabled={loading} {...register("permissions", {
                            required: true,
                            validate: {
                                maxLength: (v) =>
                                    v.length <= 4 || "The email should have at most 50 characters",

                        }})}/>
                        {errors.permissions && <ErrorCode code={errors.permissions.message}/>}
                    </div>
                    <div className="d-flex flex-column col-12 col-md-6 col-xl-3 p-1">
                    </div>
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