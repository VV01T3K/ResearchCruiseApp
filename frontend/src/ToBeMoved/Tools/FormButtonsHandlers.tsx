import { FieldValues } from 'react-hook-form';
import Api from '../../api/Api';
import { useContext } from 'react';
import { FormContext } from '@contexts/FormContext';
import { FormContextFields } from '@app/pages/FormPage/Wrappers/FormTemplate';
import { putFormADraft, putFormBDraft } from '@api/requests/Put';
import { useNavigate } from 'react-router-dom';
import { Path } from './Path';
import { cruiseApplicationIdFromLocation } from '@hooks/cruiseApplicationIdFromLocation';
import cruiseApplicationFromLocation from '@hooks/cruiseApplicationFromLocation';

export const handleSave = () => {
  const navigate = useNavigate();
  const formContext = useContext(FormContext);
  const app = cruiseApplicationFromLocation();
  return () => {
    const putForm =
      formContext?.type == 'A'
        ? putFormADraft(
            formContext!.getValues(),
            formContext.newOnCopy ? undefined : app?.id
          )
        : putFormBDraft(app?.id, formContext!.getValues());
    putForm.then(() => {
      navigate(Path.CruiseApplications);
    });
  };
};
export const handleDownload = (data: FieldValues) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  return URL.createObjectURL(blob);
};
export const fileName = (formType: string) => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Adding 1 because months are zero-indexed
  const year = currentDate.getFullYear();
  return `Formularz_${formType}_${day}.${month}.${year}`;
};

export const handlePrint = () => {
  const styles = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style')
  )
    .map((style) => style.outerHTML)
    .join('');

  const header_str = `
    <html>
      <head>
        <title>${document.title}</title>
        ${styles} <!-- Skopiowane style -->
      </head>
      <body>
  `;
  const footer_str = '</body></html>';
  const new_str = document.getElementById('form')?.innerHTML;

  if (new_str) {
    const printIframe = document.createElement('iframe');
    printIframe.style.width = '100%';
    printIframe.style.height = '100vh';
    printIframe.style.border = 'none';
    printIframe.style.position = 'absolute';

    document.body.appendChild(printIframe);

    const iframeDoc = printIframe.contentWindow?.document;
    iframeDoc?.open();
    iframeDoc?.write(header_str + new_str + footer_str);
    iframeDoc?.close();

    printIframe.contentWindow?.focus();
    printIframe.contentWindow?.print();

    document.body.removeChild(printIframe);
  }
};

export const handleSubmit = () => {
  const formContext = useContext(FormContext);

  //SetBusyWithMessage("Trwa wysyłanie")
  Api.post('/formsA/' + formContext!.type, formContext?.getValues());
  // .then(()=> {setTimeout(()=>
  // {
  //         navigate("/ViewForms")},1000)
  // })
};
