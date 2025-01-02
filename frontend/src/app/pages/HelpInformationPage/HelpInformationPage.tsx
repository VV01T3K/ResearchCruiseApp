import Page from '../../../ToBeMoved/Pages/Page';
import PageTitle from '@components/Page/PageTitle';
import {createRef} from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const HelpForm = () => {
  const titleRef = createRef<HTMLInputElement>();
  const contentRef = createRef<HTMLTextAreaElement>();
  const onClickAction = () =>
    (window.location.href = `mailto:help@rejsy.ug.edu.pl?subject=${encodeURIComponent(titleRef.current?.value ?? '')}&body=${encodeURIComponent(contentRef.current?.value ?? '')}`);
  return (
    <div className={'d-flex flex-column'}>
      Tytuł:
      <input
        ref={titleRef}
        type={'text'}
        className={'field-common w-100'}
      ></input>
      Wiadomość:
      <TextareaAutosize
        ref={contentRef}
        style={{ minBlockSize: 80 }}
        maxRows={10}
        className={'field-common w-100'}
      ></TextareaAutosize>
      <button className={'btn btn-primary w-100'} onClick={onClickAction}>
        Otwórz Email
      </button>
    </div>
  );
};
export default function HelpInformationPage() {
  return (
    <Page className='common-page '>
      <PageTitle title='Pomoc' />
      <div className={'p-3 d-flex flex-column mh-100'}>
        <div
          className={
            'h5 p-4 justify-content-center align-items-center text-center align-self-center h-100'
          }
        >
          <>Kontakt</>
        </div>
        <div className={'d-flex flex-row flex-wrap h-100'}>
          <div className={'col-12 col-md-6 border-start p-2'}>
            <div className={'h4'}>
              Biuro Armatora z jednostką r/v Oceanograf.
            </div>
            <p>
              <h6 className={'fw-bold'}>Wydział Oceanografii i Geografii</h6>
              al. Marszałka Józefa Piłsudskiego 46 81-378 Gdynia
              <h6 className={'fw-bold'}>Telefon:</h6> +48 58 523 66 31
              <h6 className={'fw-bold'}>Strona WWW:</h6>
              https://oceanograf.ug.edu.pl/?lang=pl
              <h6 className={'fw-bold'}>E-mail:</h6>
              office.oceanograf@ug.edu.pl
            </p>
          </div>
          <div className={'col-12 col-md-6 border-start p-2'}>
            <div className={'h4'}>Obsługa i problemy związane z aplikacją.</div>
            <h6 className={'fw-bold'}>E-mail:</h6>
            <p>help@rejsy.ug.edu.pl</p>
            <h6 className={'fw-bold'}>FAQ:</h6>
            <p>help@rejsy.ug.edu.pl</p>
            <HelpForm />
          </div>
        </div>

        <div
          className={
            'h5 p-4 justify-content-center align-items-center text-center align-self-center h-100'
          }
        >
          <>
            Dokładniejsze informacje o pomocy zostaną dodane w przyszłej
            aktualizacji
          </>
        </div>
      </div>
    </Page>
  );
}
