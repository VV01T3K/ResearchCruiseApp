import { Controller } from "react-hook-form";
import React from "react";
import FieldWrapper from "./FieldWrapper";

type Props = {
    className?: string;
    label: string;
    name: string;
    maxVal: number;
    newVal?: (arg0: number) => any;
    connectedName?: string;
    form?: any;
    notZero?: boolean;
};

function FloatInput(props: Props) {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const sanitizedValue = parseFloat(value); // Parsowanie wartości jako liczby zmiennoprzecinkowej
        if (!isNaN(sanitizedValue) && value.match(/^\d*\.?\d*$/)) {
            // Sprawdzenie, czy wartość jest poprawną liczbą z maksymalnie dwoma miejscami po przecinku
            props.form.setValue(props.name, sanitizedValue.toFixed(2).toString(), {
                shouldDirty: true,
                shouldValidate: true,
                shouldTouch: true,
            });

            if (props.connectedName && props.newVal) {
                props.form.setValue(
                    props.connectedName,
                    props.newVal(sanitizedValue).toFixed(2).toString(),
                    {
                        shouldDirty: true,
                        shouldValidate: true,
                        shouldTouch: true,
                    }
                );
            }
        } else {
            props.form.setValue(props.name, "0.00", {
                shouldDirty: true,
                shouldValidate: true,
                shouldTouch: true,
            });
        }
    };

    return (
        <FieldWrapper {...props}>
            <Controller
                render={({ field }) => (
                    <input
                        type="text" // Zmieniamy typ na text
                        className="text-center placeholder-glow"
                        value={field.value}
                        onChange={field.onChange} // Obsługa zdarzenia zmiany
                        onBlur={(e) => onChange(e)} // Obsługa zdarzenia stracenia focusu
                        placeholder="0"
                    />
                )}
                name={props.name}
                control={props.form.control}
                rules={{
                    required: "Pole nie może być puste",
                    validate: (value) => {
                        if (props.notZero) {
                            return Number(value) !== 0 || "Pole nie może mieć wartości 0.";
                        }
                        return undefined;
                    },
                }}
            />
        </FieldWrapper>
    );
}

export default FloatInput;