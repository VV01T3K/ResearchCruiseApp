import React from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import ErrorCode from "../../../LoginPage/ErrorCode";


type Props = {
    className: string,
    label: string,
    name:string,
    form?: UseFormReturn,
    required? :boolean
}

function BlockListInput(props: Props){


    return (
        <div className={props.className + " p-3 d-flex flex-column justify-content-center"}>
            <Controller name={props.name}  control={props.form!.control}
                        defaultValue={[]}
                        rules = {{required:props.required ?? true,validate: {
                            notEmpty: (value) => {
                                for (const key in value) {
                                    if (value.hasOwnProperty(key) && (value[key].value === "" || value[key].count === "")) {
                                        return "Uzupełnij wszystkie pola";
                                    }
                                }
                                return true;
                            }}
                            }}
                        render={({field})=>(
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
                                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end col-1">
                                        <b>Lp.</b>
                                    </div>
                                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end col-7">
                                        <b>Instytucja</b>
                                    </div>
                                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end col-3">
                                        <b>Liczba gości</b>
                                    </div>
                                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end col-1"/>
                                </div>
                            </div>
                        {!field.value.length &&
                            <div className="d-flex flex-row bg-light p-2 justify-content-center">
                                <div className={"text-center"}>Nie dodano żadnej jednostki</div>
                            </div>
                        }
                        {field.value.map((item:{value:string, count:string}, index:number) => (
                            <div className={"d-flex"} key={index}>
                                    <div className="d-flex justify-content-center align-items-center p-2 border-end col-1">{index}</div>
                                    <div className="d-flex justify-content-center align-items-center p-2 border-end text-center col-7">
                                        <textarea
                                            {...field}
                                            value={item.value}
                                            style={{resize: "none"}}
                                            className="w-100 h-100"
                                            onChange={(e) => {
                                                if (e.target.value.length < 100) {
                                                    var val = field.value;
                                                    val[index].value = e.target.value
                                                    props.form!.setValue(props.name, val, {
                                                        shouldDirty: true,
                                                        shouldTouch: true,
                                                        shouldValidate: true
                                                    })
                                                    field.onChange(val)
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="col-3 d-flex justify-content-center align-items-center p-2 border-end text-center">
                                        <textarea style={{resize: "none"}}
                                                  {...field}
                                                  className="text-center placeholder-glow w-100"
                                                  value={item.count}
                                                  onChange={(e) => {
                                                      const sanitizedValue = parseInt(e.target.value);
                                                      var val = field.value;
                                                      console.log(sanitizedValue)
                                                      if (!isNaN(sanitizedValue) && sanitizedValue < 9999) {
                                                          val[index].count = sanitizedValue

                                                      } else {
                                                          val[index].count = '0'
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
                                    <div className="col-1 d-flex justify-content-center align-items-center p-2">
                                        <button type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    const val = field.value;
                                                    val.splice(index, 1)
                                                    props.form!.clearErrors(props.name)
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

                    <button
                        className={`btn btn-primary ${props.form!.formState.errors[props.name] ? "disabled " : ""}`}
                        type="button"
                        onClick={()=>{props.form!.setValue(props.name, [...field.value, {value:``, count:''}],
                            {shouldValidate:true, shouldDirty:true, shouldTouch:true})}}
                    >
                        +
                    </button>
                </>
            )}/>
            {
                props.form!.formState.errors[props.name] &&
                <ErrorCode
                    code={props.form!.formState.errors[props.name]!.message}
                />
            }
        </div>
    )
}


export default  BlockListInput