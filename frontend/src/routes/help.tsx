import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { allowOnly } from '@/lib/guards';
import { useForm } from '@tanstack/react-form';
import { Building2 as BuildingFillIcon } from 'lucide-react';
import { Mail as EnvelopeFillIcon } from 'lucide-react';
import { Globe2 as GlobeAmericasIcon } from 'lucide-react';
import { Phone as TelephoneFillIcon } from 'lucide-react';
import { AppWindow as WindowStackIcon } from 'lucide-react';
import { z } from 'zod';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppLink } from '@/components/shared/AppLink';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { CompanyInfoCard } from '@/components/shared/CompanyInfoCard';
import config from '@/config';

export const Route = createFileRoute('/help')({
  component: HelpPage,
  beforeLoad: allowOnly.authenticated(),
});

const validationSchema = z.object({
  title: z.string().nonempty('Tytuł nie może być pusty'),
  content: z.string().nonempty('Treść nie może być pusta'),
});

function HelpPage() {
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
  const backendVersion = useSuspenseQuery({
    queryKey: ['backendVersion'],
    queryFn: async () => {
      const response = await fetch(`${config.apiUrl}/version`);
      if (!response.ok) throw new Error(`Backend version request failed with status ${response.status}`);
      return response.json() as Promise<string>;
    },
    retry: false,
  });

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }

  return (
    <AppLayout
      title="Pomoc"
      description="W razie problemów z aplikacją prosimy o kontakt przez maile lub formularz po lewej stronie."
    >
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-center text-2xl font-semibold">Obsługa problemów związanych z aplikacją</h2>
          <p className="mt-4 text-center">
            W razie problemów związanych z aplikacją prosimy o maila na adres{' '}
            <AppLink href="mailto:rejsy.help@ug.edu.pl">rejsy.help@ug.edu.pl</AppLink>.
          </p>
          <form className="flex flex-col space-y-4 p-4" onSubmit={handleSubmit}>
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
            <div className="grid grid-cols-2 gap-1 text-sm text-gray-500">
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
