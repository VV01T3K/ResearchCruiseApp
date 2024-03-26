import React from "react";
import {UseFormReturn} from "react-hook-form";
import Select, {SingleValue} from "react-select";


type Props = {
    inputName: string,
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
            placeHolder={"Wybierz"}
            options = {[
                { label: "Krajowa", value: "domestic" },
                { label: "Międzynarodowa", value: "international" }
            ]}
            onChange={(selectedOption: SingleValue<{ label: string, value: string }>)=> {
                if (selectedOption) {
                    props.form.setValue(props.inputName, selectedOption.value)
                }
            }}
        />
    )
}