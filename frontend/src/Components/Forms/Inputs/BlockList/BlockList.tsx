import React from "react";
import { FieldError, FieldErrorsImpl, Merge, useFieldArray} from "react-hook-form";
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
    const {
        fields,
        append,
        remove
    } = useFieldArray({
        control: props.form!.control,
        name: props.name,

    });
    React.useEffect(() => {
        props.form!.setValue(props.name, "", {shouldTouch:true, shouldDirty:true});
    }, [])


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
        <div className={props.className + " p-3 d-flex flex-column justify-content-center"}>
            <table className="table-striped w-100">
                <thead className="text-white text-center" style={{"backgroundColor":"#052d73"}}>
                <tr className="d-flex flex-row center align-items-center w-100">
                    <th className="text-center p-2 w-100">{props.label}</th>
                </tr>
                </thead>

                <tbody>
                {!fields.length &&
                    <tr className="d-flex flex-row bg-light p-2 justify-content-center">
                        <th colSpan={3} className={"text-center"} >Nie dodano żadnej jednostki</th>
                    </tr>
                }
                {fields.map((item: any, index) => {
                    return(
                    <React.Fragment key={item.id}>
                        <tr className="d-flex flex-row justify-content-center align-items-center border bg-light">
                            <th className="w-25 text-center p-2 border-end ">{index}</th>
                            <th className="w-75 text-center p-2">
                                {item.value}
                            </th>
                            <th className="d-inline-flex p-2">
                                <button type="button"
                                        className="btn btn-primary"
                                        onClick={() => {remove(index);
                                        if(fields.length-1<=0)
                                            props.form!.setError(props.name, {
                                                type: 'manual',
                                                message: 'Wymagana przynajmniej jedna jednostka',
                                            });


                                        }}
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
                    // className={"text-white"}
                    menuPlacement="auto"
                placeholder={"Wybierz opcję lub wyszukaj"}
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            boxShadow: "none",
                            border: "none",
                            backgroundColor: "#052d73",
                            color: 'white',
                            width:"100%"
                        }),
                        placeholder:(provided:any) => ({
                            ...provided,
                            color:'white',
                            textAlign:"center"
                        }),
                        input:(provided:any) => ({
                            ...provided,
                            color:'white',
                        }),
                        menu: provided => ({...provided, zIndex: 9999})
                    }}
                    placeHolder={"Wybierz"}
                    // styles={{}}
                // @ts-ignore
                    options={administrationUnits.filter(element => !fields.map((item)=>item.value).includes(element))?.map(value => ({label: value, value}))}
                    value={""}
                    // closeMenuOnScroll={() => true}
                    onChange={(selectedOption) => {
                        // @ts-ignore
                        append({value:`${selectedOption.label}`});

                    }}
            />
            {props.form.formState.errors[props.name] &&
                <ErrorCode code=
                               {props.form.formState.errors[props.name].message}
                />
            }
        </div>
    )
}


export default BlockList