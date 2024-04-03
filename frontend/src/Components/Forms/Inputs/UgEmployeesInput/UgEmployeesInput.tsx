import React from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import {administrationUnits} from "../../../../resources/administrationUnits";
import ErrorCode from "../../../LoginPage/ErrorCode";
import Select from "react-select";

type Props = {
    className: string,
    label: string,
    name: string,
    form?:UseFormReturn
    required?: boolean,
}
function UgEmployeesInput(props: Props) {
    const requiredMsg = "Dodaj przynajmniej jedno zadanie"
    const disabled = props.form!.formState.errors[props.name] && props.form!.formState.errors[props.name]!.message != requiredMsg
    return (
        <div className={props.className + " p-3 d-flex flex-column justify-content-center"}>
            <Controller name={props.name} control={props.form!.control}
                        defaultValue={[]}
                        rules={{
                            required: props.required ?? requiredMsg, validate: {
                                notEmpty: (value:{value: { value:string }}) => {
                                        if (Object.values(value).some((row: { value:string })=>Object.values(row).some((val)=>val===""))) {
                                            return "Uzupełnij wszystkie pola";
                                        }
                                    return true;
                                }
                            }
                        }}
                        render={({field}) => (
                <>
                    <div className="w-100">
                        <div className="text-white text-center bg-primary">
                            <div>
                                <div className="p-2">{props.label}</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-white text-center bg-secondary">
                                <div className="d-flex flex-row center">
                                    <div
                                        className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end col-1">
                                        <b>Lp.</b>
                                    </div>
                                    <div
                                        className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end col-4">
                                        <b>Jednostka</b>
                                    </div>
                                    <div
                                        className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end col-3">
                                        <b>L.pracowników</b>
                                    </div>
                                    <div
                                        className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end col-3">
                                        <b>L.studentów</b>
                                    </div>
                                    <div
                                        className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end col-1"/>
                                </div>
                            </div>
                            {!field.value.length &&
                                <div className="d-flex flex-row bg-light p-2 justify-content-center">
                                    <div className={"text-center"}>Nie dodano żadnej jednostki</div>
                                </div>
                            }
                            {field.value.map((item:{value:string, noOfEmployees:string, noOfStudents:string}, index:number) => (
                                <div className={"d-flex"} key={index}>
                                    <div
                                        className="d-flex justify-content-center align-items-center p-2 border-end col-1">{index}</div>
                                    <div
                                        className="d-flex justify-content-center align-items-center p-2 border-end text-center col-4">
                                        <span>{item.value}</span>
                                    </div>
                                    <div
                                        className="col-3 d-flex justify-content-center align-items-center p-2 border-end text-center">
                                            <textarea style={{resize: "none"}}
                                                      {...field}
                                                      className="text-center placeholder-glow w-100"
                                                      value={item.noOfEmployees}
                                                      onChange={(e) => {
                                                          const sanitizedValue = parseInt(e.target.value);
                                                          var val = field.value;
                                                          console.log(sanitizedValue)
                                                          if (!isNaN(sanitizedValue) && sanitizedValue < 9999) {
                                                              val[index].noOfEmployees = sanitizedValue

                                                          } else {
                                                              val[index].noOfEmployees = '0'
                                                          }
                                                          props.form!.setValue(props.name, val, {
                                                              shouldDirty: true,
                                                              shouldTouch: true,
                                                              shouldValidate: true
                                                          })
                                                          field.onChange(val)
                                                      }}
                                                      placeholder="0"
                                            />
                                    </div>

                                    <div
                                        className="col-3 d-flex justify-content-center align-items-center p-2 border-end text-center">
                                        <textarea style={{resize: "none"}}
                                                  {...field}
                                                  className="text-center placeholder-glow w-100"
                                                  value={item.noOfStudents}
                                                  onChange={(e) => {
                                                      const sanitizedValue = parseInt(e.target.value);
                                                      var val = field.value;
                                                      console.log(sanitizedValue)
                                                      if (!isNaN(sanitizedValue) && sanitizedValue < 9999) {
                                                          val[index].noOfStudents = sanitizedValue

                                                      } else {
                                                          val[index].noOfStudents = '0'
                                                      }
                                                      props.form!.setValue(props.name, val, {
                                                          shouldDirty: true,
                                                          shouldTouch: true,
                                                          shouldValidate: true
                                                      })
                                                      field.onChange(val)
                                                  }}
                                                  placeholder="0"
                                        />
                                    </div>
                                    <div
                                        className="col-1 d-flex justify-content-center align-items-center p-2">
                                        <button type="button"
                                                className="btn btn-info"
                                                onClick={() => {
                                                    const val = field.value;
                                                    val.splice(index, 1)
                                                    props.form!.setValue(props.name, val, {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                        shouldTouch: true
                                                    })
                                                }
                                                }
                                        >
                                            -
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                    <Select minMenuHeight={300}
                            menuPlacement="auto"
                            isDisabled={disabled}
                            className={`bg-info text-white`}
                            placeholder={disabled ? "": "Wybierz opcję lub wyszukaj"}
                            styles={{
                                control: (provided, state) => ({
                                    ...provided,
                                    boxShadow: "none",
                                    border: "none",
                                    backgroundColor: "inherit",
                                    color: "inherit",
                                    width: "100%"
                                }),
                                placeholder: (provided: any) => ({
                                    ...provided,
                                    color: 'inherit',
                                    textAlign: "center"
                                }),
                                input: (provided: any) => ({
                                    ...provided,
                                    color: 'inherit',
                                }),
                                menu: provided => ({...provided, zIndex: 9999, color: "black"})
                            }}
                            options={administrationUnits.filter(element => !field.value.map((item:{value:[]}) => item.value).includes(element))?.map(value => ({
                                label: value,
                                value
                            })) ?? {label: "", value: ""}}
                            {...field}
                            value={null}
                            onChange={(selectedOption) => {
                                props.form!.setValue(props.name, [...field.value, {value: `${selectedOption!.label}`, noOfEmployees:"", noOfStudents:""}], {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                    shouldTouch: true
                                })


                            }}
                    />
                    {props.form!.formState.errors[props.name] &&
                        <ErrorCode code=
                                       {props.form!.formState.errors[props.name]!.message}
                        />
                    }
                </>)}/>
        </div>
    )
}


export default UgEmployeesInput