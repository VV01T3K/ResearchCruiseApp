import {FieldProps} from '@app/pages/FormPage/Inputs/FormRadio';
import {ElementsColumn} from '@app/pages/FormPage/Inputs/TechnicalElementsTable/TechnicalElementsTableFields';
import {FieldValues} from 'react-hook-form';
import {FieldTableWrapper} from '@app/pages/FormPage/Wrappers/FieldTableWrapper';
import {FieldContext} from '@contexts/FieldContext';
import FieldWrapper from '@app/pages/FormPage/Inputs/FieldWrapper';


export type TechnicalElements = {
    bowStarboard: string,
    aftStarboard: string,
    aftPortSide: string,
    mainCrane: string,
    bomSTBS: string,
    bomPS: string,
    cableRope35kN: string,
    cableRope5kN: string,
    mainGantry: string,
    STBSAuxiliaryGate: string,
    STBSTrawlElevator: string,
    PSTrawlElevator: string,
    workboat: string,
    observatory: string

}

const technicalElementsDefault = [
    {
        bowStarboard: 'false',
        aftStarboard: 'false',
        aftPortSide: 'false',
        mainCrane: 'false',
        bomSTBS: 'false',
        bomPS: 'false',
        cableRope35kN: 'false',
        cableRope5kN: 'false',
        mainGantry: 'false',
        STBSAuxiliaryGate: 'false',
        STBSTrawlElevator: 'false',
        PSTrawlElevator: 'false',
        workboat: 'false',
        observatory: 'false',
    },
];

type TechnicalElementsProps = FieldProps


const technicalElementsTableContent = () => [
    ElementsColumn,
];

export const FieldContextWrapper = (Render: React.JSXElementConstructor<any>) => ({ field }: FieldValues) => (
    <FieldContext.Provider value={field}>
        <Render />
    </FieldContext.Provider>
);

function TechnicalElementsTable(props: TechnicalElementsProps) {

    const mdColWidths = [100];
    const mdColTitles = ['Elementy techniczne'];
    const colTitle = '';
    const emptyText = 'Nie dodano żadnych elementów';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, technicalElementsTableContent,
        null, emptyText, [1]);


    const fieldProps = {
        ...props,
        defaultValue: technicalElementsDefault,
        rules: {
            required: false,
        },
        render: FieldContextWrapper(Render),
    };

    return (
        <FieldWrapper {...fieldProps} />
    );
}


export default TechnicalElementsTable;
