import React from "react";
import FormSection, {SectionProps} from "./FormSection";

export type FormSectionType = {
    Content: (props: SectionProps) => React.JSX.Element,
    id: string,
    shortTitle: string,
    longTitle: string,
    sectionFieldNames?: { [key: string]: string }
}
export function SectionIdFromTitle(title: String){
    return "section_" + title.replace(/[^A-Za-z]/g, '');
}

export type SectionFieldNames = {
    [key: string]: string;
};

export type SectionWrapperProps = {
    shortTitle: string,
    longTitle: string,
    children: React.ReactNode,
    sectionFieldNames?: SectionFieldNames
}

export const SectionWrapper = (props: SectionWrapperProps): FormSectionType => {
    const id = SectionIdFromTitle(props.shortTitle)
    const longTitle = props.longTitle
    const children = props.children
    const Content = (props: SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            {children}
        </FormSection>
    )
    return {
        Content,
        id,
        shortTitle: props.shortTitle,
        longTitle: longTitle,
        sectionFieldNames: props.sectionFieldNames
    }
}

