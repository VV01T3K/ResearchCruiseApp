import {SectionContentMapper} from './Section/SectionContentMapper';
import {FormSectionType} from 'Form/Section/FormSectionType';

export const FormContent = (props: { sections: FormSectionType[] }) => (
    <div className="form-page-content" id={'form'}>
        {SectionContentMapper(props.sections)}
    </div>
);