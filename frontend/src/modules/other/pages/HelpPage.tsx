import { useForm } from '@tanstack/react-form';
import BuildingFillIcon from 'bootstrap-icons/icons/building-fill.svg?react';
import EnvelopeFillIcon from 'bootstrap-icons/icons/envelope-fill.svg?react';
import GlobeAmericasIcon from 'bootstrap-icons/icons/globe-americas.svg?react';
import TelephoneFillIcon from 'bootstrap-icons/icons/telephone-fill.svg?react';
import WindowStackIcon from 'bootstrap-icons/icons/window-stack.svg?react';
import { z } from 'zod';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { AppLink } from '@/core/components/AppLink';
import { AppInput } from '@/core/components/inputs/AppInput';
import { CompanyInfoCard } from '@/other/components/CompanyInfoCard';

import { useBackendVersionQuery } from '../hooks/BackendVersionApiHook';

const validationSchema = z.object({
  title: z.string().nonempty('Tytuł nie może być pusty'),
  content: z.string().nonempty('Treść nie może być pusta'),
});

export function HelpPage() {
  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
    },
    validators: {
      onChange: validationSchema,
    },
    onSubmit: ({ value }) => {
      window.open(
        `mailto:rejsy.help@ug.edu.pl?subject=${encodeURIComponent(value.title)}&body=${encodeURIComponent(value.content)}`
      );
    },
  });
  const backendVersion = useBackendVersionQuery();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }

  return (
    <AppLayout
      title="Pomoc"
      description="W razie problemów z aplikacją prosimy o kontakt przez maile lub formularz po lewej stronie."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl text-center font-semibold">Obsługa problemów związanych z aplikacją</h2>
          <p className="mt-4 text-center">
            W razie problemów związanych z aplikacją prosimy o maila na adres{' '}
            <AppLink href="mailto:rejsy.help@ug.edu.pl">rejsy.help@ug.edu.pl</AppLink>.
          </p>
          <form className="space-y-4 p-4 flex flex-col" onSubmit={handleSubmit}>
            <form.Field
              name="title"
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  type="text"
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  label="Tytuł"
                  required
                />
              )}
            />

            <form.Field
              name="content"
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  label="Wiadomość"
                  className="h-48"
                  type="textarea"
                  required
                />
              )}
            />

            <div className="mt-8">
              <AppButton type="submit" className="w-full">
                Otwórz maila z tytułem i wiadomością
              </AppButton>
            </div>
          </form>
        </div>
        <div className="space-y-8">
          <CompanyInfoCard icon={<BuildingFillIcon />} title="Biuro Armatora z jednostką r/v Oceanograf">
            <p className="font-semibold">Wydział Oceanografii i Geografii</p>
            <p>al. Marszałka Józefa Piłsudzkiego 46</p>
            <p>81-378 Gdynia</p>
          </CompanyInfoCard>
          <CompanyInfoCard icon={<TelephoneFillIcon />} title="Telefon">
            <AppLink href="tel:+48585236631">+48 58 523 66 31</AppLink>
          </CompanyInfoCard>
          <CompanyInfoCard icon={<GlobeAmericasIcon />} title="Strona WWW">
            <AppLink href="https://oceanograf.ug.edu.pl">https://oceanograf.ug.edu.pl</AppLink>
          </CompanyInfoCard>
          <CompanyInfoCard icon={<EnvelopeFillIcon />} title="Email">
            <AppLink href="mail:office.oceanograf@ug.edu.pl">office.oceanograf@ug.edu.pl</AppLink>
          </CompanyInfoCard>
          <CompanyInfoCard icon={<WindowStackIcon />} title="Wersja aplikacji">
            <div className="text-sm text-gray-500 grid grid-cols-2 gap-1">
              <div>Wersja frontendu:</div>
              <div className="font-bold text-black">{APP_VERSION}</div>
              <div>Wersja backendu:</div>
              <div className="font-bold text-black">{backendVersion.data}</div>
            </div>
          </CompanyInfoCard>
        </div>
      </div>
    </AppLayout>
  );
}
