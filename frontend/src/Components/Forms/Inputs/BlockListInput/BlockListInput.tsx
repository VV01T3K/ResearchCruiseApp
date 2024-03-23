import React from "react";
import {Controller, get, useFieldArray} from "react-hook-form";
import Style from "./BlockListInput.module.css"
import CSSModules from "react-css-modules";
import ErrorCode from "../../../LoginPage/ErrorCode";


type Props = {
    className: string,
    label: string,
    name,
    form?
}

function BlockListInput(props: Props){


    return (
        <div className={props.className + " p-3 d-flex flex-column justify-content-center"}>
            <Controller name={props.name}  control={props.form!.control}
                        defaultValue={[]}
                        rules = {{validate: {
                            notEmpty: (value) => {
                                for (const key in value) {
                                    if (value.hasOwnProperty(key) && value[key].value === "") {
                                        return "Uzupełnij wszystkie pola";
                                    }
                                }
                                return true;
                            }}
                            }}
                        render={({field})=>(
                            <>
            <table className="table-striped w-100">
                <thead className="text-white text-center" style={{"backgroundColor":"#052d73"}}>
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
                    {field.value.map((item, index) => (
                        <React.Fragment key={index}>
                            <tr className="d-flex flex-row justify-content-center align-items-center border bg-light">
                                <th className="w-25 text-center p-2 border-end ">{index}</th>
                                <th className="w-75 text-center p-2">
                                    <input
                                     {...field}
                                        value={field.value[index].value}
                                           type="text"
                                           className="w-100"
                                           onChange={(e)=> {
                                               var val = field.value;
                                               val[index].value = e.target.value
                                               field.onChange(val)
                                           }}
                                    />
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
                    ))}
                </tbody>
            </table>

            <button className={`btn btn-primary ${props.form.formState.errors[props.name] ? "disabled " : ""}`}
                    type="button"
                    onClick={(selectedOption)=>{
                        props.form.setValue(props.name, [...field.value, {value:``}], {shouldValidate:true, shouldDirty:true, shouldTouched:true})


                    }}
            >
                +
            </button>
                            </>)}/>
            {
                props.form.formState.errors[props.name] &&

                <ErrorCode
                    code={props.form.formState.errors[props.name].message}
                />
            }
        </div>
    )
}


export default  CSSModules(BlockListInput, Style)