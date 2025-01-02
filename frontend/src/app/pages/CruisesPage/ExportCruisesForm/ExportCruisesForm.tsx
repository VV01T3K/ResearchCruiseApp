import {ExportCruisesFormValues} from "ExportCruisesFormValues";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {getCruisesAsCsv} from "@api/requests";
import TextInput from "@components/Form/CommonInput/TextInput";
import {ErrorMessageIfPresentNoContext} from "@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext";
import SuccessMessage from "../../../../ToBeMoved/Pages/CommonComponents/SuccessMessage";
import {exportCruisesFormDefaultValues} from "@helpers/exportCruisesFormDefaultValues";

export const ExportCruisesForm = () => {
  const exportCruisesForm = useForm<ExportCruisesFormValues>({
    defaultValues: exportCruisesFormDefaultValues
  });

  const [exporting, setExporting] = useState(false);
  const [exportingError, setExportingError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setExportingError('');
    setSuccess(false);
    setExporting(true);

    getCruisesAsCsv(exportCruisesForm.getValues().year)
      .then(response => {
        const downloadLink = document.createElement('a');
        downloadLink.href = response.data.content;
        downloadLink.setAttribute('download', response.data.name);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      })
      .catch(error => {
        setExportingError(error.message);
      });
  };

  return (
    <div className='d-flex flex-wrap py-2 w-100'>
      <div className='d-flex row flex-wrap w-100 rounded-2 justify-content-end'>
        <TextInput
          form={exportCruisesForm}
          label='Rok rejsu'
          name='year'
          disabled={exporting}
          maxLength={4}
          validationPattern={/^[0-9]{4}$/}
          validationPatternMessage={"Niepoprawny rok"}
        />

        <div className='d-flex w-100 mt-1 justify-content-end'>
          <a
            className={`btn btn-primary ${exporting ? 'disabled' : ''}`}
            type='submit'
            style={{ fontSize: 'inherit' }}
            onClick={exportCruisesForm.handleSubmit(handleSubmit)}
          >
            Eksportuj
          </a>
        </div>

        <div className='d-flex col-12 justify-content-end'>
          {exportingError !== '' && (
            <ErrorMessageIfPresentNoContext
              className='w-100'
              message={exportingError}
            />
          )}
          {success && (
            <SuccessMessage
              className='w-100'
              message='Rejsy wyeksportowane do pliku'
            />
          )}
        </div>
      </div>
    </div>
  );
};