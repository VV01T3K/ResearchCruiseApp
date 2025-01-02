// TODO: Extract methods
import {useContext} from 'react';
import {FormContext} from '@contexts/FormContext';
import {FormSectionType} from 'Form/Section/FormSectionType';
import {FormType} from '../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation';

import {extendedUseLocation} from '@hooks/extendedUseLocation';

function FormTitleWithNavigation() {
  const formContext = useContext(FormContext);

  function scrollSmoothTo(elementId: string) {
    const element = document.getElementById(elementId);
    element?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  const FormTitle = () => {
    const locationState = extendedUseLocation()?.state;
    return (
      <div className={'form-page-title'}>
        {[FormType.A, FormType.B, FormType.C].includes(formContext!.type) &&
          `Formularz ${formContext!.type}`}
        {formContext!.type == FormType.ApplicationDetails &&
          `Szczegóły zgłoszenia`}
        {formContext!.type == FormType.CruiseDetails &&
          (locationState?.cruise ? 'Szczegóły rejsu' : 'Nowy rejs')}
      </div>
    );
  };

  const showRequiredSections = !formContext?.readOnly;

  const isSectionInvalid = (section: FormSectionType) =>
    section.sectionFieldNames
      ? Object.values(section.sectionFieldNames).some(
          (fieldName) => formContext?.formState.errors[fieldName]
        )
      : false;

  const SectionLink = (props: { section: FormSectionType; index: number }) => (
    <div
      className={'form-page-navigation-button'}
      onClick={() => scrollSmoothTo(props.section.id)}
    >
      {props.index + 1 + '. '}
      {props.section.shortTitle}
      {showRequiredSections && (isSectionInvalid(props.section) ? '*' : '')}
    </div>
  );

  const SectionLinks = () => (
    <div className={'form-page-navigation'}>
      {formContext!.sections.map((section, index) => (
        <SectionLink key={index} section={section} index={index} />
      ))}
    </div>
  );

  return (
    <div className={'form-title-with-navigation'}>
      <SectionLinks />
      <FormTitle />
    </div>
  );
}

export default FormTitleWithNavigation;
