import { createFileRoute } from '@tanstack/react-router';
import BuildingFillIcon from 'bootstrap-icons/icons/building-fill.svg?react';
import TelephoneFillIcon from 'bootstrap-icons/icons/telephone-fill.svg?react';
import GlobeAmericasIcon from 'bootstrap-icons/icons/globe-americas.svg?react';
import EnvelopeFillIcon from 'bootstrap-icons/icons/envelope-fill.svg?react';
import { AppLink } from '@core/components/AppLink';
import { AppLabelInput } from '@core/components/AppLabelInput';
import { useForm } from '@tanstack/react-form';
import { AppLabelTextArea } from '@core/components/AppLabelTextarea';
import { z } from 'zod';
import { AppButton } from '@core/components/AppButton';
import { guardAgainstUnauthenticated } from '@core/guards';

export const Route = createFileRoute('/help')({
  component: RouteComponent,
  beforeLoad: guardAgainstUnauthenticated,
});

const emailSchema = z.object({
  title: z.string().nonempty('Tytuł nie może być pusty'),
  content: z.string().nonempty('Treść nie może być pusta'),
});

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
    validators: {
      onChange: emailSchema,
    },
    onSubmit: ({ value }) => {
      window.open(
        `mailto:help@rejsy.ug.edu.pl?subject=${encodeURIComponent(value.title)}&body=${encodeURIComponent(value.content)}`
      );
    },
  });

  function CompanyInfoCard({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
  }) {
    return (
      <div className="flex gap-4">
        <div className="grid place-items-center">
          <div className="bg-gray-200 rounded-xl grid place-items-center p-4 aspect-square w-16">
            {icon}
          </div>
        </div>
        <div>
          <p className="font-bold text-lg">{title}</p>
          {children ? <div className="mt-2">{children}</div> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full min-h-screen backdrop-blur-md relative">
      <div className="max-w-screen-2xl mx-auto px-4 py-16 bg-gray-50 rounded-xl mt-[25vh]">
        <header>
          <h1 className="text-3xl font-bold text-center mb-2">Pomoc</h1>
          <p className="text-gray-600 font-semibold text-center">
            W razie problemów z aplikacją prosimy o kontakt przez maile lub
            formularz po lewej stronie.
          </p>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl text-center font-semibold">
              Obsługa problemów związanych z aplikacją
            </h2>
            <p className="mt-4 text-center">
              W razie problemów związanych z aplikacją prosimy o maila na adres{' '}
              <AppLink to="mailto:help@rejsy.ug.edu.pl">
                help@rejsy.ug.edu.pl
              </AppLink>
              .
            </p>
            <form
              className="space-y-4 p-4 flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <form.Field
                name="title"
                children={(field) => (
                  <AppLabelInput
                    name={field.name}
                    value={field.state.value}
                    type="text"
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label="Tytuł"
                    required
                  />
                )}
              />

              <form.Field
                name="content"
                children={(field) => (
                  <AppLabelTextArea
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    label="Wiadomość"
                    className="h-48"
                    required
                  />
                )}
              />

              <div className="mt-8">
                <AppButton type="submit" className="w-full" variant="blue">
                  Otwórz maila z tytułem i wiadomością
                </AppButton>
              </div>
            </form>
          </div>
          <div className="space-y-8">
            <CompanyInfoCard
              icon={<BuildingFillIcon />}
              title="Biuro Armatora z jednostką r/v Oceanograf"
            >
              <p className="font-semibold">Wydział Oceanografii i Geografii</p>
              <p>al. Marszałka Józefa Piłsudzkiego 46</p>
              <p>81-378 Gdynia</p>
            </CompanyInfoCard>
            <CompanyInfoCard icon={<TelephoneFillIcon />} title="Telefon">
              <AppLink to="tel:+48585236631">+48 58 523 66 31</AppLink>
            </CompanyInfoCard>
            <CompanyInfoCard icon={<GlobeAmericasIcon />} title="Strona WWW">
              <AppLink to="office.oceanograf@ug.edu.pl">
                office.oceanograf@ug.edu.pl
              </AppLink>
            </CompanyInfoCard>
            <CompanyInfoCard icon={<EnvelopeFillIcon />} title="Email">
              <AppLink to="mail:office.oceanograf@ug.edu.pl">
                office.oceanograf@ug.edu.pl
              </AppLink>
            </CompanyInfoCard>
          </div>
        </div>
      </div>
    </div>
  );
}
