import React from "react";
import {Controller} from "react-hook-form";
import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../DateInput.css'
import pl from "date-fns/locale/pl";
registerLocale("pl", pl);
import 'react-dropdown/style.css';
import {ButtonGroup, Dropdown} from "react-bootstrap";
import Style from "./TaskInput.module.css";
import Select from "react-select";
import ErrorCode from "../../../LoginPage/ErrorCode";


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
        "Realizacja projektu krajowego (NCN, NCBiR, itp)":  { "Tytuł": "", "Ramy czasowe":{}, "Kwota finansowania":"" },
        "Realizacja projektu zagranicznego (ERC, Programy ramowe UE, fundusze norweskie, itp)":  { "Tytuł": "", "Ramy czasowe":{}, "Kwota finansowania":"" },
        "Realizacja projektu wewnętrznego UG": { "Tytuł": "", "Ramy czasowe":{}, "Kwota finansowania":"" },
        "Realizacja innego projektu naukowego":{ "Tytuł": "", "Ramy czasowe":{}, "Kwota finansowania":"" },
        "Realizacja projektu komercyjnego": { "Tytuł": "", "Ramy czasowe":{}, "Kwota finansowania":"" },
        "Dydaktyka": {"Opis zajęcia dydaktycznego":""},
        "Realizacja własnego zadania badawczego": { "Tytuł": "", "Ramy czasowe":{}, "Kwota finansowania":"" },
        "Inne zadanie": {"Opis zadania":""}
};

    const getFieldValue = (field, index, item, subIndex) => {
        return field.value[index][Object.keys(item)[0]][subIndex[0]]
    }

    const handleChange = (field, index, item, subIndex,  newValue) => {
        var newField = field.value
        newField[index][Object.keys(item)[0]][subIndex[0]] = newValue
        props.form.setValue(props.name, newField, {shouldTouch:true, shouldValidate:true, shouldDirty:true})
        return newField
    }

    const getTaskTitle = (item) => {
        return Object.keys(options)[Object.keys(item)[0]]
    }

    const getFields = (item) => {
        return Object.entries(Object.values(item)[0])
    }

    const getFieldLabel = (item, fieldIndex) => {
        return Object.keys(Object.values(options)[Object.keys(item)[0]])[fieldIndex]
    }
    const requiredMsg = "Dodaj przynajmniej jedno zadanie"
    const disabled = props.form.formState.errors[props.name] && props.form.formState.errors[props.name].message != requiredMsg
    return (
        <div className={props.className + " p-3"}>
            <Controller name={props.name}  control={props.form!.control}
                        defaultValue={[]}
                        rules = {{ required:requiredMsg,validate: {
                            notEmptyArray:(value)=>{
                                if(
                                value.some((val)=> {
                                    console.log(Object.values(Object.values(val)[0]))
                                    return Object.values(Object.values(val)[0]).some((x)=> {
                                        if (typeof x === 'string' && x.trim() === '') {
                                            return true;
                                        }
                                        else if (typeof x === 'object') {
                                            if(Object.keys(x).length < 2)
                                                return true;

                                            for (let key in x) {
                                                if (x.hasOwnProperty(key) && typeof x[key] === 'string' && x[key].trim() === '') {
                                                    return true; // Zwraca true, jeśli znaleziono pusty string
                                                }
                                            }
                                        }

                                        return false;
                                    })
                                }))
                                return"Wypełnij wszystkie pola"}}}}
                        render={({field})=>(
                            <>
            <div className="table-striped w-100">
                <div className="text-white text-center bg-primary">
                    <div className="d-flex flex-row center align-items-center">
                        <div className="col-xl-3 text-center d-none d-xl-block border-end p-2">Zadanie</div>
                        <div className=" col-xl-8 text-center d-lg-block d-xl-none p-2">Zadanie</div>
                        <div className="w-75 text-center d-none d-xl-block p-2">Szczegóły</div>
                    </div>
                </div>
                <div className={"w-100"}>
                    {!field.value.length &&
                        <div className="d-flex flex-row justify-content-center bg-light p-2 ">
                            <div className="text-center">Nie wybrano żadnego zadania</div>
                        </div>
                    }
                    {field.value && field.value.map((item, index) => (
                        <div key={index}
                             className="d-flex flex-wrap border
                             bg-light"
                        >
                            <div className="text-center align-items-center  col-12 col-xl-3 justify-content-center p-2
                             d-inline-flex border-end">
                                {getTaskTitle(item)}
                            </div>
                            <div className="text-center d-flex col-12 col-xl-8 ">
                                {<div className="d-flex flex-wrap justify-content-center justify-content-xl-start
                                  pb-3  w-100">
                                    {getFields(item).map((t, s) => {
                                        return(
                                        <div key={s}
                                             className={`${getFields(item).length == 2
                                             && "col-xl-6" }
                                         ${getFields(item).length == 3 && "col-xl-4" }
                                         col-12 p-1`}>
                                            <label className={"d-flex justify-content-center"}>{getFieldLabel(item, s)}</label>
                                            {(()=>{
                                                switch (getFieldLabel(item, s)){
                                                    case "Autor":
                                                    case "Tytuł":
                                                    case "Instytucja do której składany":
                                                        return (
                                                            <input className={"w-100"} {...field} value={getFieldValue(field, index, item, t)} onChange={(e)=>{
                                                                field.onChange(handleChange(field, index, item, t, e.target.value ))
                                                            } }/>
                                                        )

                                                    case "Opis zajęcia dydaktycznego" :
                                                    case "Opis zadania" :
                                                        return (
                                                            <input type="text" className={"w-100"}  style={{height:"100px"}} {...field} value={getFieldValue(field, index, item, t)} onChange={(e)=>{
                                                            field.onChange(handleChange(field, index, item, t, e.target.value ))
                                                        } }/>
                                                        )
                                                    case "Przewidywany termin składania":
                                                        return (
                                                            <DatePicker
                                                                {...field}
                                                                className={"text-center w-100"}

                                                                closeOnScroll={true}
                                                                locale={"pl"}
                                                                selected={getFieldValue(field, index, item, t) ? new Date(getFieldValue(field, index, item, t)) : null}
                                                                onChange={(e)=>{
                                                                field.onChange(handleChange(field, index, item, t, e.toString() ))
                                                             }}
                                                                // getPopupContainer={trigger => trigger.parentElement}
                                                                dateFormat="dd/MM/yyyy"
                                                                // placeholderText={props.label}
                                                            />
                                                            )
                                                    case "Ramy czasowe" :
                                                        return (<>
                                                            <DatePicker
                                                               {...field}
                                                               //  onBlur = {()=>{if(getFieldValue(field, index, item, t).startDate)field.onBlur()}}
                                                                showMonthYearPicker
                                                                showMonthYearDropdown
                                                                className={" text-center w-100"}
                                                                selectsStart
                                                                startDate={getFieldValue(field, index, item, t).startDate ? new Date(getFieldValue(field, index, item, t).startDate) : null}
                                                                maxDate={getFieldValue(field, index, item, t).endDate ? new Date(getFieldValue(field, index, item, t).endDate) : null}
                                                                endDate={getFieldValue(field, index, item, t).endDate ? new Date(getFieldValue(field, index, item, t).endDate) : null}
                                                                locale={"pl"}
                                                                selected={getFieldValue(field, index, item, t).startDate ? new Date(getFieldValue(field, index, item, t).startDate) : null}
                                                                onChange={(e)=>{
                                                                    if(e!=null) {
                                                                        var tmp = getFieldValue(field, index, item, t)
                                                                        tmp["startDate"] = e.toString();
                                                                        field.onChange(handleChange(field, index, item, t, tmp))
                                                                    }
                                                                }}
                                                                // getPopupContainer={trigger => trigger.parentElement}
                                                                dateFormat="dd/MM/yyyy"
                                                            />
                                                            <DatePicker
                                                                {...field}
                                                                // onBlur = {()=>{if(getFieldValue(field, index, item, t).endDate)field.onBlur()}}
                                                                showYearDropdown
                                                                showMonthYearPicker
                                                                className={"text-center w-100"}
                                                                startDate={getFieldValue(field, index, item, t).startDate ? new Date(getFieldValue(field, index, item, t).startDate) : null}
                                                                endDate={getFieldValue(field, index, item, t).endDate ? new Date(getFieldValue(field, index, item, t).endDate) : null}
                                                                minDate={getFieldValue(field, index, item, t).startDate ? new Date(getFieldValue(field, index, item, t).startDate) : null}
                                                                selectsEnd
                                                                locale={"pl"}
                                                                selected={getFieldValue(field, index, item, t).endDate ? new Date(getFieldValue(field, index, item, t).endDate) : null}
                                                                onChange={(e)=>{
                                                                    if(e!=null) {
                                                                        var tmp = getFieldValue(field, index, item, t)
                                                                        tmp["endDate"] = e.toString();
                                                                        field.onChange(handleChange(field, index, item, t, tmp))
                                                                    }
                                                                }}
                                                                // getPopupContainer={trigger => trigger.parentElement}
                                                                dateFormat="dd/MM/yyyy"
                                                            />
                                                            </>
                                                            )
                                                    case "Kwota finansowania" :
                                                        return (
                                                            <input
                                                                {...field}
                                                                type="text" // Zmieniamy typ na text
                                                                className="text-center placeholder-glow w-100"
                                                                value={getFieldValue(field, index, item, t)}
                                                                onChange={ (e) => field.onChange(handleChange(field, index, item, t, e.target.value))}
                                                                onBlur ={(e) => {
                                                                    const { value } = e.target;
                                                                    const sanitizedValue = parseFloat(value);
                                                                    if (!isNaN(sanitizedValue)) {
                                                                        field.onChange(handleChange(field, index, item, t, sanitizedValue.toFixed(2).toString()))
                                                                    } else {
                                                                        field.onChange(handleChange(field, index, item, t, "0.00"))
                                                                    }
                                                                }}
                                                                placeholder="0"
                                                            />)
                                                }
                                            })()}
                                        </div>
                                        )
                                    })}
                                </div>}
                            </div>
                            <div className=" d-flex p-2 col-12 col-xl-1 justify-content-center
                                            justify-content-xl-end"
                            >
                                <div className={"align-items-center justify-content-center d-flex"}>
                                <button type="button"
                                        className=" btn btn-primary"
                                        onClick={() => {
                                            const val = field.value;
                                            val.splice(index,1)
                                            props.form.setValue(props.name, val, {shouldValidate:true, shouldDirty:true, shouldTouched:true})
                                        }}
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
                        <Dropdown.Toggle disabled={disabled} variant="primary">
                            +
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Object.keys(options).map((key, index) => (
                                <Dropdown.Item key={index} onClick={() => {
                                    props.form.setValue(props.name, [...field.value, {[index]:Object.values(Object.values(options)[index]).reduce((acc, value, index) => {
                                            acc[index] = value;
                                            return acc;
                                        }, {})}], {shouldValidate:true, shouldDirty:true, shouldTouched:true})
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
                        isDisabled={disabled}
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
                        options ={Object.values(props.historicalTasks).map((key)=>{
                            const task = Object.keys(options)[Object.keys(key)[0]];
                            const values = Object.keys(Object.values(options)[Object.keys(key)[0]]);
                            const string = task + ", " + values.map((value, index)=> value +  ": " + Object.values(key[0])[index] ).join(", ")

                            return{ label:string, value:  key}
                        }
                        )}
                        value={""}
                        onChange={(selectedOption: { label: any, value: unknown })=> {
                            props.form.setValue(props.name, [...field.value,selectedOption.value], {shouldValidate:true, shouldDirty:true, shouldTouched:true})
                            field.onChange([...field.value,selectedOption.value])
                        }}
                    />
                </div>
            </div>


                            </>)}/>
            {props.form.formState.errors[props.name] &&
                <ErrorCode code={props.form.formState.errors[props.name].message}/>
            }
        </div>
    )
}


export default TaskInput