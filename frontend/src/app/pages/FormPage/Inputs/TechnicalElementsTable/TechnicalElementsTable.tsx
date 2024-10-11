import { FieldProps } from '@app/pages/FormPage/Inputs/FormRadio';
import { useContext } from 'react';
import { ElementsColumn } from '@app/pages/FormPage/Inputs/TechnicalElementsTable/TechnicalElementsTableFields';
import { BottomMenuWithAddButton, OrdinalNumber, RemoveRowButton } from '@app/pages/FormPage/Inputs/TableParts';
import { FieldValues } from 'react-hook-form';
import { SingleValue } from 'react-select';
import { FieldTableWrapper } from '@app/pages/FormPage/Wrappers/FieldTableWrapper';
import { fileExists } from '@app/pages/FormPage/Inputs/ContractsTable/ContractsTable';
import { FieldContext } from '@contexts/FieldContext';
import { FormContext } from '@contexts/FormContext';
import { notEmptyArray } from '@app/pages/FormPage/Inputs/PublicationsTable/PublicationsTable';
import FieldWrapper from '@app/pages/FormPage/Inputs/FieldWrapper';


export type TechnicalElements = {
    bowStarboard: boolean,
    aftStarboard: boolean,
    aftPortSide: boolean,
    mainCrane: boolean,
    bomSTBS: boolean,
    bomPS: boolean,
    cableRope35kN: boolean,
    cableRope5kN: boolean,
    mainGantry: boolean,
    STBSAuxiliaryGate: boolean,
    STBSTrawlElevator: boolean,
    PSTrawlElevator: boolean,
    workboat: boolean,
    observatory: boolean

}

const technicalElementsDefault = {
    bowStarboard: false,
    aftStarboard: false,
    aftPortSide: false,
    mainCrane: false,
    bomSTBS: false,
    bomPS: false,
    cableRope35kN: false,
    cableRope5kN: false,
    mainGantry: false,
    STBSAuxiliaryGate: false,
    STBSTrawlElevator: false,
    PSTrawlElevator: false,
    workboat: false,
    observatory: false,
};

type TechnicalElementsProps = FieldProps


const technicalElementsTableContent = () => [
    () => (<OrdinalNumber label={'Elementy techniczne'} />),
    ElementsColumn,
    RemoveRowButton,
];

export const FieldContextWrapper = (Render: React.JSXElementConstructor<any>) => ({ field }: FieldValues) => (
    <FieldContext.Provider value={field}>
        <Render />
    </FieldContext.Provider>
);

function TechnicalElementsTable(props: TechnicalElementsProps) {


    const formContext = useContext(FormContext);


    const mdColWidths = [5, 90, 5];
    const mdColTitles = ['Lp.', 'Elementy techniczne', ''];
    const colTitle = '';
    const bottomMenu =
        <BottomMenuWithAddButton newOption={technicalElementsDefault as SingleValue<any>} />;
    const emptyText = 'Nie dodano żadnych elementów';
    const { Render } = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, technicalElementsTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName));


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: {
                notEmptyArray: notEmptyArray<Crew>,
                fileExists: fileExists,
            },
        },
        render: FieldContextWrapper(Render),
    };

    return (
        <FieldWrapper {...fieldProps} />
    );
}


export default TechnicalElementsTable;
