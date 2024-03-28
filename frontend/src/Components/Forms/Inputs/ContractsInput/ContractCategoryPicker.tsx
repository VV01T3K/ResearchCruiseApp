import React from "react";
import {ControllerRenderProps, FieldValues, UseFormReturn} from "react-hook-form";
import Select, {SingleValue} from "react-select";
import {Contract} from "./ContractsInput";



type Props = {
    name: string,
    row: Contract,
    field: ControllerRenderProps<FieldValues, string>,
    form: UseFormReturn
}


export default function ContractCategoryPicker(props: Props) {
    return (
        <Select
            minMenuHeight={300}
            className="d-flex col-12 justify-content-center"
            menuPlacement="auto"
            placeholder="Wybierz"
            styles={{
                control: (provided, state)=> ({
                    ...provided,
                    boxShadow: "none",
                    border: "1px solid grey",
                    width: "100%",
                    "border-radius": "2px",
                    padding: "0px"
                }),
                menu: provided => ({
                    ...provided,
                    zIndex: 9999
                })
            }}
            options = {[
                { label: "Krajowa", value: "domestic" },
                { label: "Międzynarodowa", value: "international" }
            ]}
            value={
                props.row.category &&
                {
                    label: props.row.category == "domestic" ? "Krajowa" : "Międzynaraodowa",
                    value: props.row.category
                }
            }
            onChange={(selectedOption: SingleValue<{ label: string, value: string }>)=> {
                if (selectedOption) {
                    props.row.category = selectedOption.value
                    props.form.setValue(
                        props.name,
                        props.field.value,
                        {
                            shouldTouch: true,
                            shouldValidate: true,
                            shouldDirty: true
                        }
                    )
                }
            }}
        />
    )
}