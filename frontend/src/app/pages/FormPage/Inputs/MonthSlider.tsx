import {useContext, useEffect, useState} from 'react';
import Slider from 'rc-slider';
import './MonthSlider.css';
import {FieldValues} from 'react-hook-form';
import FieldWrapper from './FieldWrapper';
import {readyFieldOptions} from '../Wrappers/ReactSelectWrapper';
import {FormContext} from '@contexts/FormContext';

const maxValue = (array: number[]): number => {
    return Math.max.apply(null, array);
}

const minValue = (array: number[]): number => {
    return Math.min.apply(null, array);
}

type Props = {
    className?: string,
    fieldLabel: string,
    fieldName: string,
    range?: [number, number],
    fieldNameToAlsoSet?: string
}

type MonthRange = [string, string]

const MonthSlider = (props: Props) => {
    const formContext = useContext(FormContext);

    const months = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik',
        'Listopad', 'Grudzień', null, // begin of next's year
    ];

    const labels = [
        '1. połowy stycznia',
        '2. połowy stycznia',
        '1. połowy lutego',
        '2. połowy lutego',
        '1. połowy marca',
        '2. połowy marca',
        '1. połowy kwietnia',
        '2. połowy kwietnia',
        '1. połowy maja',
        '2. połowy maja',
        '1. połowy czerwca',
        '2. połowy czerwca',
        '1. połowy lipca',
        '2. połowy lipca',
        '1. połowy sierpnia',
        '2. połowy sierpnia',
        '1. połowy września',
        '2. połowy września',
        '1. połowy października',
        '2. połowy października',
        '1. połowy listopada',
        '2. połowy listopada',
        '1. połowy grudnia',
        '2. połowy grudnia',
    ];

    const [minVal, maxVal] = props.range ? props.range.map((value) => Number(value)) : [0, 24];
    const onChange = (selectedOption: MonthRange) => {
        if (Number(selectedOption[0]) >= minVal && Number(selectedOption[1]) <= maxVal) {
            formContext!.setValue(props.fieldName, selectedOption?.map((value) => String(value)), readyFieldOptions);
            if (props.fieldNameToAlsoSet) {
                formContext!.setValue(props.fieldNameToAlsoSet, formContext!.getValues(props.fieldName), {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                });
            }
        }
    };

    type MonthsMarks = {
        [key: number]: string | null;
    };

    // User can select every half of the month
    const monthsMarks = months.reduce((acc: MonthsMarks, month) => {
        acc[2 * months.indexOf(month)] = month;
        return acc;
    }, {});


    const render = ({ field }: FieldValues) => {
        const MonthLabel = () => (
            <label className={` text-center`}>
                Wybrano okres:
                od początku {field.value && labels[minValue(field.value)] + ' '}
                do końca {field.value && labels[maxValue(field.value) - 1]}.
            </label>
        );

        const sliderOptions = {
            pushable: true,
            allowCross: false,
            range: true,
            min: 0,
            max: 24,
            marks: monthsMarks,
        };

        // workaround for context rendering
        const [value, setValue] = useState(formContext?.getValues(props.fieldName));
        useEffect(() => {
            setValue(formContext?.getValues(props.fieldName));
        }, [formContext]);

        return (
            <div className={'ps-3 pe-3'}>
                <Slider
                    {...field} onChange={(e: number[]) => {
                    if (e[0] >= minVal && e[1] <= maxVal) {
                        setValue(e?.map((value) => String(value)));
                    }
                }
                }
                    {...sliderOptions} disabled={formContext?.readOnly}
                    value={value?.map((value: string) => Number(value))} onChangeComplete={onChange}
                />
                <MonthLabel />
            </div>
        );
    };
    const fieldProps = {
        ...props,
        rules: {
            required: 'Wybierz jedną z opcji',
            validate: {},
        },
        render: render,
        defaultValue: ['0', '24'],
    };

    return (<FieldWrapper {...fieldProps} />);
};


export default MonthSlider;