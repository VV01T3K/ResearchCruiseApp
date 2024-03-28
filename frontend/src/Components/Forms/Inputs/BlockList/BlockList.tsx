import React from "react";
import {Controller} from "react-hook-form";
import {administrationUnits} from "../../../../resources/administrationUnits";
import ErrorCode from "../../../LoginPage/ErrorCode";
import Select from "react-select";

type Props = {
    className: string,
    label: string,
    name: string,
    form:any
}
function BlockList(props: Props) {

    return (
        <div className={props.className + " p-3 d-flex flex-column justify-content-center"}>
            <Controller name={props.name}  control={props.form!.control}
                        defaultValue={[]}
                        rules = {{required: 'Wymagana przynajmniej jedna jednostka',  validate: {notEmptyArray:(value)=>{if(value.length==0)return"sss"}}}}
                        render={({field})=>(
                            <>
                <table className="table-striped w-100" >
                    <thead className="text-white text-center bg-primary">
                    <tr className="d-flex flex-row center align-items-center w-100">
                        <th className="text-center p-2 w-100">{props.label}</th>
                    </tr>
                    </thead>

                    <tbody>
                    {!field.value.length &&
                        <tr className="d-flex flex-row bg-light p-2 justify-content-center">
                            <th colSpan={3} className={"text-center"} >Nie dodano żadnej jednostki</th>
                        </tr>
                    }
                    {field.value.map((item: any, index:number) => {
                        return(
                            <React.Fragment key={"s"+index}>
                                <tr className="d-flex flex-row justify-content-center align-items-center border bg-light">
                                    <th className="w-25 text-center p-2 border-end ">{index}</th>
                                    <th className="w-75 text-center p-2">
                                        {item.value}
                                    </th>
                                    <th className="d-inline-flex p-2">
                                        <button type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    const val = field.value;
                                                    val.splice(index,1)
                                                    props.form.setValue(props.name, val, {shouldValidate:true, shouldDirty:true, shouldTouched:true})
                                                }
                                        }
                                        >
                                            -
                                        </button>
                                    </th>
                                </tr>
                            </React.Fragment>
                        )})}
                    </tbody>
                </table>

                <Select minMenuHeight={300}
                        menuPlacement="auto"
                        // value={{label:"", value:""}}
                        className={"bg-primary text-white "}
                        placeholder={"Wybierz opcję lub wyszukaj"}
                        styles={{
                            control: (provided, state) => ({
                                ...provided,
                                boxShadow: "none",
                                border: "none",
                                backgroundColor: "inherit",
                                color:"inherit",
                                width:"100%"
                            }),
                            placeholder:(provided:any) => ({
                                ...provided,
                                color:'inherit',
                                textAlign:"center"
                            }),
                            input:(provided:any) => ({
                                ...provided,
                                color:'inherit',
                            }),
                            menu: provided => ({...provided, zIndex: 9999, color:"black"})
                        }}
                        options={administrationUnits.filter(element => !field.value.map((item)=>item.value).includes(element))?.map(value => ({label: value, value})) ?? {label:"", value:""}}
                       {...field}
                        value={null}
                        onChange={(selectedOption)=>{
                            // field.onChange([...field.value, {value:`${selectedOption.label}`}])
                            props.form.setValue(props.name, [...field.value, {value:`${selectedOption.label}`}], {shouldValidate:true, shouldDirty:true, shouldTouched:true})


                        }}
                />
                {props.form.formState.errors[props.name] &&
                    props.form.formState.errors[props.name] &&
                    <ErrorCode code=
                                   {props.form.formState.errors[props.name].message}
                    />
                }

            </>)}/>
        </div>
    )
}


export default BlockList