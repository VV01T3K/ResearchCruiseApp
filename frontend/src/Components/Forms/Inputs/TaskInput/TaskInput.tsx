import React from "react";
import {Controller, UseFormReturn} from "react-hook-form";
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
    form?: UseFormReturn,
    name: string,
    historicalTasks: any
}


// const defaultOption = options[0];

function TaskInput(props: Props) {
    const options =
        {'Praca licencjacka': ["Autor", "Tytuł" ],
        'Praca magisterska': ["Autor", "Tytuł" ],
        'Praca doktorska': ["Autor", "Tytuł" ],
        "Przygotowanie projektu naukowego": ["Tytuł", "Instytucja do której składany", "Przewidywany termin składania"],
        "Realizacja projektu krajowego (NCN, NCBiR, itp)":  ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
        "Realizacja projektu zagranicznego (ERC, Programy ramowe UE, fundusze norweskie, itp)":  ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
        "Realizacja projektu wewnętrznego UG": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
        "Realizacja innego projektu naukowego":["Tytuł", "Ramy czasowe", "Kwota finansowania"],
        "Realizacja projektu komercyjnego": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
        "Dydaktyka": ["Opis zajęcia dydaktycznego"],
        "Realizacja własnego zadania badawczego": ["Tytuł", "Ramy czasowe", "Kwota finansowania"],
        "Inne zadanie": ["Opis zadania"]
};
    type time = {startDate:string, endDate:string}
    const defaultValues = [
        {author:"", title:""},
        {author:"", title:""},
        {author:"", title:""},
        {title:"", institution:"", date:""},
        {title:"", time:{startDate:"", endDate:""}, financingAmount:""},
        {title:"", time:{startDate:"", endDate:""}, financingAmount:""},
        {title:"", time:{startDate:"", endDate:""}, financingAmount:""},
        {title:"", time:{startDate:"", endDate:""}, financingAmount:""},
        {title:"", time:{startDate:"", endDate:""}, financingAmount:""},
        {description:""},
        {title:"", time:{startDate:"", endDate:""}, financingAmount:""},
        {description:""},
    ]

    const selectOptions = () =>{
        const values = Object.values(props.historicalTasks).map((key) => {
            const options2 = {month: '2-digit', year: 'numeric'}
            const values = key.values
            const type = key.type
            const string = (values.author ? ("Autor: " + values.author + ", ") : "")
                + (values.title ? ("Tytuł: " + values.title + ", ") : "")
                + (values.institution ? ("Instytucja: " + values.institution + ", ") : "")
                + (values.date ? ("Data: " + new Date(values.date).toLocaleDateString('pl-PL') + ", ") : "")
                + (values.time ? ("Od: " + new Date(values.time.startDate).toLocaleDateString('pl-PL', options2) + " do: " + new Date(values.time.endDate).toLocaleDateString('pl-PL', options2) + ", ") : "")
                + (values.financingAmount ? ("Kwota: " + values.financingAmount + " zł, ") : "")
                + (values.description ? ("Opis: " + values.description + ", ") : "")

            return {type:type, label: string, value: key}
        })
        var selectOptions:Array<{label:string, options:object}> = []
        Object.keys(options)
            .forEach((value, index)=>{

            selectOptions = [...selectOptions, {label:value,options:values.filter(item => item.type == index).map(item=>{return{label: item.label, value: item.value}})}]


        })
        return selectOptions
    }

    const handleChange = (field:{value:Array<{ values:any }>}, row:{values:object}, rowIndex:number, index:number, newValue:string) => {
        field.value[rowIndex].values[Object.keys(row.values)[index]] = newValue
        props.form!.setValue(props.name, field.value, {shouldTouch:true, shouldValidate:true, shouldDirty:true})
    }

    const getTaskTitle = (item:{type:number}) => {
        return Object.keys(options)[item.type]
    }

    const getFields = (item:{values:object}) => {
        console.log(Object.values(item.values))
        // return []
        return Object.values(item.values)
    }

    const requiredMsg = "Dodaj przynajmniej jedno zadanie"
    const disabled = props.form!.formState.errors[props.name] && props.form.formState.errors[props.name]!.message != requiredMsg
    return (
        <div className={props.className + " p-3"}>
            <Controller name={props.name}  control={props.form!.control}
                        defaultValue={[]}
                        rules = {{ required:requiredMsg,validate: {
                            notEmptyArray:(value)=>{
                                if(
                                value.some((val: { values:object })=> {
                                    return Object.values(val.values).some((x)=> {
                                        if (typeof x === 'string' && x.trim() === '') {
                                            return true;
                                        }
                                        else if (typeof x === 'object') {
                                            if(Object.values(x).some(y =>y==''))
                                                return true
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
                    {field.value && field.value.map((row: {type:number, values:object }, rowIndex:number) => (
                        <div key={rowIndex}
                             className="d-flex flex-wrap border
                             bg-light"
                        >
                            <div className="text-center align-items-center  col-12 col-xl-3 justify-content-center p-2
                             d-inline-flex border-end">
                                {getTaskTitle(row)}
                            </div>
                            <div className="text-center d-flex col-12 col-xl-8 ">
                                {<div className="d-flex flex-wrap justify-content-center justify-content-xl-start
                                  pb-3  w-100">
                                    {getFields(row).map((val:unknown, s, array:unknown[]) => {
                                        return(
                                        <div key={s}
                                             className={`${getFields(row).length == 2
                                             && "col-xl-6" }
                                         ${getFields(row).length == 3 && "col-xl-4" }
                                         col-12 p-1`}>
                                            <label className={"d-flex justify-content-center align-items-center"}>{Object.values(options)[row.type][s]}</label>
                                            {(()=>{
                                                switch (Object.values(options)[row.type][s]){
                                                    case "Autor":
                                                    case "Tytuł":

                                                        return (
                                                            <input className={"w-100"} {...field} value={val as string} onChange={(e)=>{
                                                                handleChange(field, row, rowIndex, s, e.target.value )
                                                            } }/>
                                                        )
                                                    case "Instytucja do której składany":
                                                    case "Opis zajęcia dydaktycznego" :
                                                    case "Opis zadania" :
                                                        return (
                                                            <input type="text" className={"w-100"}  style={{height:"100px"}} {...field} value={val as string} onChange={(e)=>{
                                                                handleChange(field, row, rowIndex, s, e.target.value )
                                                        } }/>
                                                        )
                                                    case "Przewidywany termin składania":
                                                        return (
                                                            <DatePicker
                                                                {...field}
                                                                className={"text-center w-100"}

                                                                closeOnScroll={true}
                                                                locale={"pl"}
                                                                selected={val ? new Date(val as string) : null}
                                                                onChange={(e:Date)=>{
                                                                    handleChange(field, row, rowIndex, s, e.toString() )
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
                                                                startDate={(val as time ).startDate ? new Date((val as time ).startDate) : null}
                                                                maxDate={(val as time ).endDate ? new Date((val as time ).endDate) : null}
                                                                endDate={(val as time ).endDate ? new Date((val as time ).endDate) : null}
                                                                locale={"pl"}
                                                                selected={(val as time ).startDate ? new Date((val as time ).startDate) : null}
                                                                onChange={(e:Date)=>{
                                                                    if(e!=null) {
                                                                        var tmp = val as time
                                                                        tmp["startDate"] = e.toString();
                                                                        handleChange(field, row, rowIndex, s, tmp )
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
                                                                startDate={(val as time ).startDate ? new Date((val as time ).startDate) : null}
                                                                endDate={(val as time ).endDate ? new Date((val as time ).endDate) : null}
                                                                minDate={(val as time ).startDate ? new Date((val as time ).startDate) : null}
                                                                selectsEnd
                                                                locale={"pl"}
                                                                selected={(val as time ).endDate ? new Date((val as time ).endDate) : null}
                                                                onChange={(e:Date)=>{
                                                                    if(e!=null) {
                                                                        var tmp = val as time
                                                                        tmp["endDate"] = e.toString();
                                                                        handleChange(field, row, rowIndex, s, tmp )

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
                                                                value={val as string}
                                                                onChange={ (e) =>  handleChange(field, row, rowIndex, s, e.target.value )}
                                                                onBlur ={(e) => {
                                                                    const { value } = e.target;
                                                                    const sanitizedValue = parseFloat(value);
                                                                    if (!isNaN(sanitizedValue)) {
                                                                        handleChange(field, row, rowIndex, s, sanitizedValue.toFixed(2).toString())
                                                                    } else {
                                                                        handleChange(field, row, rowIndex, s, "0.00")
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
                                        style={{fontSize:"inherit"}}
                                        className=" btn btn-primary"
                                        onClick={() => {
                                            const val = field.value;
                                            val.splice(rowIndex,1)
                                            props.form!.setValue(props.name, val, {shouldValidate:true, shouldDirty:true, shouldTouch:true})
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
                        <Dropdown.Toggle  disabled={disabled} variant="primary">
                            +
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {Object.keys(options).map((key, index) => (
                                <Dropdown.Item key={index} onClick={() => {
                                    props.form!.setValue(props.name, [...field.value, {type:index, values:defaultValues[index]}], {shouldValidate:true, shouldDirty:true, shouldTouch:true})
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
                        options ={selectOptions()}
                        value={""}
                        onChange={(selectedOption: { label: any, value: any })=> {
                            props.form!.setValue(props.name, [...field.value,selectedOption.value], {shouldValidate:true, shouldDirty:true, shouldTouch:true})
                            // field.onChange([...field.value,selectedOption.value])
                        }}
                    />
                </div>
            </div>


                            </>)}/>
            {props.form!.formState.errors[props.name] &&
                <ErrorCode code={props.form!.formState.errors[props.name]!.message}/>
            }
        </div>
    )
}


export default TaskInput