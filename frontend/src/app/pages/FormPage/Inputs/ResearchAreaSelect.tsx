import {FieldValues} from 'react-hook-form';
import FieldWrapper from './FieldWrapper';
import {SelectWrapper} from '../Wrappers/ReactSelectWrapper';
import {FormField} from './FormYearSelect';

export type ResearchArea = {
    name: string,
    id: string
}

type Props = FormField & {
    initValues?: ResearchArea[]
}


function ResearchAreaSelect(props: Props) {
    function findLabel(field: FieldValues) {
        const item = props.initValues?.find(item => item.id === field.value);
        if (item) {
            return item.name;
        }
        return '';
    }

    const optionsMapper = props.initValues?.map(
        (value, _) => (
            {
                label: value.name,
                value: value.id,
            }
        ));

    const render = ({ field }: FieldValues) => {
        const currentValue = field.value ? { label: findLabel(field), value: field.value } : null;

        return (
            <SelectWrapper fieldName={props.fieldName} value={currentValue} options={optionsMapper} />
        );
    };

    const fieldProps = {
        ...props,
        rules: { required: 'Wybierz obszar' },
        render: render,
    };

    return (
        <FieldWrapper {...fieldProps} />
    );
}


export default ResearchAreaSelect;