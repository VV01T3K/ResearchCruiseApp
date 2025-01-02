import React from 'react';
import {SectionContentProps} from './SectionContentProps';

export type FormSectionType = {
    Content: (props: SectionContentProps) => React.JSX.Element,
    id: string,
    shortTitle: string,
    longTitle: string,
    sectionFieldNames?: { [key: string]: string }
}