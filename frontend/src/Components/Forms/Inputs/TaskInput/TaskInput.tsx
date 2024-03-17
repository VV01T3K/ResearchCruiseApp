import React, {useEffect, useState} from "react";
import {Controller, useFieldArray} from "react-hook-form";

import 'react-dropdown/style.css';
import {ButtonGroup, Dropdown} from "react-bootstrap";
import Style from "./TaskInput.module.css";
import InputWrapper from "../InputWrapper";
import TextArea from "../TextArea";
import NumberInput from "../NumberInput";
import Select from "react-select";
import ErrorCode from "../../../LoginPage/ErrorCode";
import textArea from "../TextArea";


type Props = {
    className: string,
    label:string,
    form?,
    name: string,
    historicalTasks
}


// const defaultOption = options[0];

function TaskInput(props: Props) {
    const options =
        {'Praca licencjacka': {"Autor": "", "Tytuł": "" },
        'Praca magisterska': { "Autor": "", "Tytuł": "" },
        'Praca doktorska': { "Autor": "", "Tytuł": "" },
        "Przygotowanie projektu naukowego": { "Tytuł": "", "Instytucja do której składany": "", "Przewidywany termin składania":"" },
        "Realizacja projektu krajowego (NCN, NCBiR, itp)":  { "Tytuł": "", "Ramy czasowe":"", "Kwota finansowania":"" },
        "Realizacja projektu zagranicznego (ERC, Programy ramowe UE, fundusze norweskie, itp)":  { "Tytuł": "", "Ramy czasowe":"", "Kwota finansowania":"" },
        "Realizacja projektu wewnętrznego UG": { "Tytuł": "", "Ramy czasowe":"", "Kwota finansowania":"" },
        "Realizacja innego projektu naukowego":{ "Tytuł": "", "Ramy czasowe":"", "Kwota finansowania":"" },
        "Realizacja projektu komercyjnego": { "Tytuł": "", "Ramy czasowe":"", "Kwota finansowania":"" },
        "Dydaktyka": {"Opis zajęcia dydaktycznego":""},
        "Realizacja własnego zadania badawczego": { "Tytuł": "", "Ramy czasowe":"", "Kwota finansowania":"" },
        "Inne zadanie": {"Opis zadania":""}
};

    const {
        fields,
        append,
        remove
    } = useFieldArray({
        control: props.form.control,
        name: props.name,
    });

    const checkTouched = (index,item, field) => {
        return props.form.formState.touchedFields[`${props.name}`] &&
            props.form.formState.touchedFields[`${props.name}`][`${index}`] &&
            props.form.formState.touchedFields[`${props.name}`][`${index}`][`${Object.keys(item)[0]}`] &&
            props.form.formState.touchedFields[`${props.name}`][`${index}`][`${Object.keys(item)[0]}`][field]
        && (!(
            props.form.formState.errors[`${props.name}`] &&
            props.form.formState.errors[`${props.name}`][`${index}`] &&
            props.form.formState.errors[`${props.name}`][`${index}`][`${Object.keys(item)[0]}`]
            // props.form.formState.errors[`${props.name}`][`${index}`][`${Object.keys(item)[0]}`][field]
        ))

    }
    const touched = fields.every((item, index) => {
        return       Object.keys(Object.values(item)[0]).every(
            (value) => checkTouched(index, item, value) === true
        )
    }   );
    const [isTouched, setTouched] = useState(touched);

    React.useEffect(() => {
        if(!touched ) {
            if(!props.form.formState.errors[props.name])
            props.form.setError(props.name, {
                type: 'manual',
                message: 'To jest ręcznie ustawiony błąd!',
            });
            // props.form!.clearErrors(props.name)
        }
        else {
            if(props.form.formState.errors[props.name])
                props.form!.clearErrors(props.name)
            if(!fields.length ) {
                if(!props.form.formState.errors[props.name])
                    props.form.setError(props.name, {
                        type: 'manual',
                        message: 'To jest ręcznie ustawiony błąd!',
                    });
                // props.form!.clearErrors(props.name)
            }
            else {
                if(props.form.formState.errors[props.name])
                    props.form!.clearErrors(props.name)
            }
        }

        // // console.log(fields)
        // console.log(props.form.formState.errors)
    })

    return (
        <div className={props.className + " p-3"}>
            <div className="table-striped w-100">
                <div className="text-white text-center" style={{"backgroundColor": "#052d73"}}>
                    <div className="d-flex flex-row center align-items-center">
                        <div className="col-xl-3 text-center d-none d-xl-block border-end p-2">Zadanie</div>
                        <div className=" col-xl-8 text-center d-lg-block d-xl-none p-2">Zadanie</div>
                        <div className="w-75 text-center d-none d-xl-block p-2">Szczegóły</div>
                    </div>
                </div>
                <div className={"w-100"}>
                    {!fields.length &&
                        <div className="d-flex flex-row justify-content-center bg-light p-2 ">
                            <div className="text-center">Nie wybrano żadnego zadania</div>
                        </div>
                    }
                    {fields && fields.map((item, index) => (
                        <div key={item.id}
                             className="d-flex flex-wrap border
                             bg-light"
                        >
                            <div className="text-center align-items-center  col-12 col-xl-3 justify-content-center p-2 d-inline-flex border-end">
                                {Object.keys(options)[Object.keys(item)[0]]}
                            </div>
                            <div className="text-center d-flex col-12 col-xl-8 ">
                                {<div className="d-flex flex-wrap justify-content-center justify-content-xl-start  pb-3  w-100">
                                    {/*{item}*/}
                                    {Object.entries(Object.values(item)[0]).map((t, s) => {
                                        const title = Object.keys(Object.values(options)[Object.keys(item)[0]])[s];
                                        return(
                                        <div key={`${Object.keys(item)[0]}.${s}`}  className={`${Object.entries(Object.values(item)[0]).length == 2 && "col-xl-6" }
                                         ${Object.entries(Object.values(item)[0]).length == 3 && "col-xl-4" }
                                         col-12 `}>
                                            {(()=>{
                                                switch (title){
                                                    case "Autor":
                                                    case "Tytuł":
                                                    case "Instytucja do której składany":
                                                    case "Opis zajęcia dydaktycznego" :
                                                    case "Opis zadania" :
                                                        return (<TextArea customError={true}  resize={"none"} label={title} form={props.form} name={`${props.name}[${index}].${Object.keys(item)[0]}.${t[0]}`}/>)

                                                    case "Przewidywany termin składania":
                                                        return (<NumberInput customError={true}  label={title} form={props.form} name={`${props.name}[${index}].${Object.keys(item)[0]}.${t[0]}`}/>)
                                                    case "Ramy czasowe" :
                                                    case "Kwota finansowania" :
                                                        return (<NumberInput customError={true}  label={title + " (zł)"} form={props.form} name={`${props.name}[${index}].${Object.keys(item)[0]}.${t[0]}`}/>)
                                                }
                                            })()}


                                            {props.form.formState.errors[props.name] &&
                                                props.form.formState.errors[props.name][index] &&
                                                props.form.formState.errors[props.name][index][Object.keys(item)[0]] &&
                                                props.form.formState.errors[props.name][index][Object.keys(item)[0]][t[0]] &&
                                                <ErrorCode code={props.form.formState.errors[props.name][index][Object.keys(item)[0]][t[0]].message}/>
                                                }


                                        </div>
                                    )})}
                                </div>}
                            </div>
                            <div className=" d-flex p-2 col-12 col-xl-1 justify-content-center
                                            justify-content-xl-end"
                            >
                                <div className={"align-items-center justify-content-center d-flex"}>
                                <button type="button"
                                        className=" btn btn-primary"
                                        onClick={() => { remove(index) }}
                                >
                                    -
                                </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="d-inline-flex p-2 w-100">
                    <ButtonGroup as={Dropdown}
                                 className={"w-100 h-100 p-2 align-self-center" + Style.centeredDropdown}
                    >
                        <Dropdown.Toggle disabled={!touched} variant="primary">
                            +
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Object.keys(options).map((key, index) => (
                                <Dropdown.Item key={index} onClick={() => {
                                    append({[index]:Object.values(Object.values(options)[index]).reduce((acc, value, index) => {
                                        acc[index] = value;
                                        return acc;
                                    }, {})})
                                    // props.form.setError(props.name[fields.length-1], {
                                    //     type: 'manual',
                                    //     message: 'To jest ręcznie ustawiony błąd!',
                                    // });


                                }
                                }>
                                    {key}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </ButtonGroup>
                    <Select
                        minMenuHeight={300}
                        className="d-flex col-6 text-center p-2 justify-content-center"
                        isDisabled={!touched}
                        menuPlacement="auto"
                        placeholder="Dodaj z historii"
                        styles={{
                            control: (provided, state) => ({
                                ...provided,
                                boxShadow: "none",
                                border: "1px solid grey",
                                width: "100%"
                            }),
                            placeholder: (provided: any) => ({
                                ...provided,
                                textAlign: "center"
                            }),
                            input: (provided: any) => ({
                                ...provided
                            }),
                            menu: provided => ({
                                ...provided,
                                zIndex: 9999
                            })
                        }}
                        placeHolder={"Wybierz"}
                        options ={Object.values(props.historicalTasks).map((key)=>{
                            const task = Object.keys(options)[Object.keys(key)[0]];
                            const values = Object.keys(Object.values(options)[Object.keys(key)[0]]);
                            const string = task + ", " + values.map((value, index)=> value +  ": " + Object.values(key[0])[index] ).join(", ")

                            return{ label:string, value:  key}
                        }
                        )}
                        value={""}
                        onChange={(selectedOption: { label: any, value: unknown })=> {
                            append(selectedOption.value)
                            Object.values(selectedOption.value).forEach((key, value)=>{
                              Object.values(key).forEach((key1, value1)=>{
                                  props.form.setValue(`${props.name}.${fields.length}.${value}.${value1}`, key1,  {shouldDirty: true, shouldTouch: true, shouldValidate:true})

                              })
                            })
                        }}
                    />
                </div>
            </div>
        </div>
    )
}


export default TaskInput