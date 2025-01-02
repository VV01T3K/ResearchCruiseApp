import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import TextArea from "@app/pages/FormPage/Inputs/TextArea";


export const spubDataFieldNames = {
    spubReportData: 'spubReportData'
};

export const SPUBDataSection = () => SectionWrapper(
    {
        shortTitle: 'Dodatkowe dane',
        longTitle: 'Dodatkowe dane do raportu SPUB',
        sectionFieldNames: spubDataFieldNames,
        children:
            <TextArea className="single-field"
                      fieldLabel="Dane"
                      placeholder={'Wpisać czy podczas rejsu były pozyskane dane do ekspertyzy lub do oceny oddziaływań na środowisko przy współpracy z otoczeniem gospodarczym i biznesowym lub w celach popularnonaukowych, edukacyjnych...'}
                      fieldName={spubDataFieldNames.spubReportData}
                      required="Opisz cel"
            />
    },
);