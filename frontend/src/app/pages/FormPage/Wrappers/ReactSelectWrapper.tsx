import {Ref, useContext, useState} from 'react';
import Select, {CSSObjectWithLabel, GroupBase, OptionsOrGroups, SingleValue} from 'react-select';
import {FieldValues} from 'react-hook-form';
import {FormContext} from '@contexts/FormContext';

export const readyFieldOptions = { shouldDirty: true, shouldValidate: true };

export type SelectSingleValue = SingleValue<{ label: string, value: string }> | SingleValue<{
    label: string,
    value: FieldValues
}> | SingleValue<{
    label: string,
    value: () => {}
}>
export type SelectOptions = OptionsOrGroups<SelectSingleValue, GroupBase<SelectSingleValue>> | undefined

type SelectWrapperProps = {
    fieldName?: string,
    options: SelectOptions,
    placeHolder?: string,
    disabled?: boolean
    className?: string,
    classNamePrefix?: string,
    onChange?: (value: SelectSingleValue) => void,
    defaultValue?: SelectSingleValue,
    ref?:Ref<any>,
    value?: FieldValues | SelectSingleValue | GroupBase<SelectSingleValue>
}
export const SelectWrapper = (props: SelectWrapperProps) => {
    const [inputValue, setInputValue] = useState('');

    const commonSelectProps = {
        menuPortalTarget: document.body,
        // workaround for invalid caret position
        styles: {
            input: (provided: CSSObjectWithLabel) => ({
                ...provided,
                caretColor: inputValue ? 'black' : 'transparent',
            }),
        },
    };

    const formContext = useContext(FormContext);
    const setSelectedValue = (selectedOption: SelectSingleValue) => {
        formContext!.setValue(props.fieldName!, selectedOption?.value, readyFieldOptions);
    };
    return (
        <Select ref={props.ref} {...commonSelectProps} placeholder={props.placeHolder ?? 'Wyszukaj'}
                noOptionsMessage={() => 'Brak wyników'}
                inputValue={inputValue} onInputChange={(e) => setInputValue(e)} value={props.value}
                {...props} className={'select ' + props.className} classNamePrefix={props.classNamePrefix ?? 'select'}
                isDisabled={props.disabled ?? formContext?.readOnly} onChange={props.onChange ?? setSelectedValue}
                menuPlacement="auto" defaultValue={props.defaultValue}
        />
    );
};
