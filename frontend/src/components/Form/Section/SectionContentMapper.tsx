import React from 'react';
import { FormSectionType } from '../../../types/Form/Section/FormSectionType';

export const SectionContentMapper = (sections: FormSectionType[]) =>
  sections.map((section: FormSectionType, index) => (
    <section.Content key={index} index={index + 1} />
  ));
