import React, {useEffect, useState} from "react";
import {Controller, useFieldArray} from "react-hook-form";

import 'react-dropdown/style.css';
import {ButtonGroup, Dropdown} from "react-bootstrap";
import Style from "./TaskInput.module.css";
import InputWrapper from "../InputWrapper";
import TextArea from "../TextArea";
import NumberInput from "../NumberInput";
import Select from "react-select";


type Props = {
    className: string,
    label:string,
    form?,
    name: string,
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

    const [isOpen, setIsOpen] = useState(false);

    useEffect(
        () => {
            const onScroll = () => setIsOpen(false)
            document.body.addEventListener('scroll', onScroll);
            return () => document.body.removeEventListener("scroll", onScroll);
        },
        [isOpen]
    );

    const newProps = {
        ...props,
        label: '',
    }

    React.useEffect(() => {
        const lastIndex = fields.length-1;

        if(fields.length>0) {

            props.form!.setValue(
                `${props.name}[${lastIndex}].value`,
                // @ts-ignore
                fields[lastIndex].value,
                {shouldDirty: true, shouldTouch: true}
            )
            props.form!.clearErrors(props.name)
        }
    }, [fields])

    return (
        <InputWrapper {...newProps}>
        <div className={props.className + " p-3"}>
            <div className="table-striped w-100">
                <div className="text-white text-center" style={{"backgroundColor": "#052d73"}}>
                    <div className="d-flex flex-row center align-items-center">
                        <div className="col-xl-3 text-center d-none d-xl-block border-end p-2">Zadanie</div>
                        <div className=" col-xl-8 text-center d-lg-block d-xl-none p-2">Zadanie</div>
                        <div className="w-75 text-center d-none d-xl-block p-2">Szczegóły</div>
                        {/*<div className="d-none d-xl-inline-flex p-2">*/}
                        {/*    <ButtonGroup as={Dropdown}*/}
                        {/*                 className={"w-100 align-self-center" + Style.centeredDropdown}*/}
                        {/*    >*/}
                        {/*        /!* Dodaj klasę CSS dla dropleft *!/*/}
                        {/*        <Dropdown.Toggle variant="primary">*/}
                        {/*            +*/}
                        {/*        </Dropdown.Toggle>*/}
                        {/*        <Dropdown.Menu>*/}
                        {/*            {Object.keys(options).map((key, index) => (*/}
                        {/*                <Dropdown.Item key={index} onClick={() => { append({[key]:options[key]})}}>*/}
                        {/*                    {key}*/}
                        {/*                </Dropdown.Item>*/}
                        {/*            ))}*/}
                        {/*        </Dropdown.Menu>*/}
                        {/*    </ButtonGroup>*/}
                        {/*</div>*/}
                    </div>
                    {/*}//*/}
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
                                {<div className="d-flex flex-wrap justify-content-center justify-content-xl-start  align-items-center w-100">
                                    {/*{()=>{*/}
                                    {/*    console.log(Object.values(item)[0])*/}
                                    {/*    return <div/>}}()*/}
                                    {Object.entries(Object.values(item)[0]).map((t, s) => {
                                        const title = Object.keys(Object.values(options)[Object.keys(item)[0]])[s];
                                        return(
                                        <div id={`${Object.keys(item)[0]}.${s}`}  className={`${Object.entries(Object.values(item)[0]).length == 2 && "col-xl-6" }
                                         ${Object.entries(Object.values(item)[0]).length == 3 && "col-xl-4" }
                                         col-12 `}>
                                            {(()=>{
                                                console.log(Object.keys(item)[0])
                                                switch (title){
                                                    case "Autor":
                                                    case "Tytuł":
                                                    case "Instytucja do której składany":
                                                    case "Opis zajęcia dydaktycznego" :
                                                    case "Opis zadania" :
                                                        return (<TextArea  resize={"none"} label={title} form={props.form} name={`${props.name}[${index}].${Object.keys(item)[0]}.${t[0]}`}/>)

                                                    case "Przewidywany termin składania":
                                                        return (<NumberInput label={title} form={props.form} name={`${props.name}[${index}].${Object.keys(item)[0]}.${t[0]}`}/>)
                                                    case "Ramy czasowe" :
                                                    case "Kwota finansowania" :
                                                        return (<NumberInput label={title + " (zł)"} form={props.form} name={`${props.name}[${index}].${Object.keys(item)[0]}.${t[0]}`}/>)
                                                }
                                            })()}
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
                        {/* Dodaj klasę CSS dla dropleft */}
                        <Dropdown.Toggle variant="primary">
                            +
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Object.keys(options).map((key, index) => (
                                <Dropdown.Item key={index} onClick={() => { append({[index]:Object.values(Object.values(options)[index]).reduce((acc, value, index) => {
                                        acc[index] = value;
                                        return acc;
                                    }, {})})}}>
                                    {key}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </ButtonGroup>
                    <Select
                        minMenuHeight={300}
                        className="d-flex col-6 text-center p-2 justify-content-center"
                        isDisabled={props.form.formState.errors[props.name]}
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
                        options ={{label:"", value:""}}
                        value={""}
                        // onChange={(selectedOption: { label: string, value: SpubTask })=> {
                        //     if (selectedOption) {
                        //         const newSpubTask: SpubTask = {
                        //             yearFrom: `${selectedOption.value.yearFrom}`,
                        //             yearTo: `${selectedOption.value.yearTo}`,
                        //             name: `${selectedOption.value.name}`
                        //         }
                        //         append({value: newSpubTask})
                        //     }
                        // }}
                    />
                </div>
            </div>
        </InputWrapper>
    )
}


export default TaskInput