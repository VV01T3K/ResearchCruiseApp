import { AppPage } from '@core/components/AppPage';
import { allowOnly } from '@core/helpers';
import { cn } from '@lib/utils';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/priorityinformation')({
  component: RouteComponent,
  beforeLoad: allowOnly.authenticated(),
});

function RouteComponent() {
  function Row({ children }: { children: React.ReactNode }) {
    return <tr className="hover:bg-slate-100">{children}</tr>;
  }

  function Cell({
    children,
    colSpan,
    className,
  }: {
    children: React.ReactNode;
    colSpan?: number;
    className?: string;
  }) {
    return (
      <td
        className={cn(
          'p-4 border-b border-r first:border-l border-slate-600',
          className
        )}
        colSpan={colSpan}
      >
        <p className="block text-sm text-slate-800">{children}</p>
      </td>
    );
  }

  return (
    <AppPage
      title="Informacje o priorytetyzacji"
      variant="defaultWithoutCentering"
    >
      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-clip-border">
        <table className="w-full text-left table-auto">
          <thead>
            <tr>
              <th className="p-4 border border-slate-600 text-center bg-slate-300 text-lg">
                <p className="block">Rodzaj zadania z formularza</p>
              </th>
              <th className="p-4 border border-slate-600 text-center bg-slate-300 text-lg">
                <p className="block">Przyznawane punkty</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <Row>
              <Cell colSpan={2} className="bg-slate-300 font-semibold">
                1. Prace naukowe:
              </Cell>
            </Row>
            <Row>
              <Cell>Praca licencjacka</Cell>
              <Cell>20 punktów</Cell>
            </Row>
            <Row>
              <Cell>Praca magisterska</Cell>
              <Cell>50 punktów</Cell>
            </Row>
            <Row>
              <Cell>Praca doktorska</Cell>
              <Cell>100 punktów</Cell>
            </Row>
            <Row>
              <Cell>
                Przygotowanie do projektu naukowego lub badawczo-rozwojowego
              </Cell>
              <Cell>
                100 punktów – w przypadku braku decyzji o finansowaniu (tzn.
                wniosek projektowy ma być dopiero składany) 150 punktów – w
                przypadku otrzymania decyzji o finansowaniu (ale jeszcze przed
                oficjalnym rozpoczęciem realizacji projektu)
              </Cell>
            </Row>
            <Row>
              <Cell colSpan={2} className="bg-slate-300 font-semibold">
                2. Realizacja projektu w ramach:
              </Cell>
            </Row>
            <Row>
              <Cell>1) NCN, NCBiR oraz inne krajowe</Cell>
              <Cell>
                50 punktów za każde pełne 100 000 przyznanego dla UG
                finansowania
              </Cell>
            </Row>
            <Row>
              <Cell>
                2) zagraniczne (np. ERC, programy ramowe UE, fundusze norweskie)
              </Cell>
              <Cell>
                80 punktów za każde pełne 100 000 przyznanego dla UG
                finansowania
              </Cell>
            </Row>
            <Row>
              <Cell>3) projekty wewnętrzne UG</Cell>
              <Cell>30 punktów za projekt</Cell>
            </Row>
            <Row>
              <Cell>Uwaga:</Cell>
              <Cell>
                Dotyczy jedynie projektów zatwierdzonych do finansowania
                oficjalną decyzją uzyskaną z instytucji finansującej. Ponadto,
                na etapie aplikowania, we wniosku projektowym musiało być
                wpisane, że badania będą prowadzone na r/v Oceanograf i w jakim
                wymiarze czasowym.
              </Cell>
            </Row>
            <Row>
              <Cell colSpan={2} className="bg-slate-300 font-semibold">
                3. Realizacja innych projektów:
              </Cell>
            </Row>
            <Row>
              <Cell>Projekt komercyjny</Cell>
              <Cell>
                Do indywidualnego rozpatrzenia UWAGA: W przypadku rezygnacji z
                części zamówionych wcześniej dni rejsowych (np. gdy uda się
                zrealizować zamierzone prace wcześniej, ze względu na
                odpowiednie warunki pogodowe), te „wolne” dni rejsowe z powrotem
                trafiają do puli do rozdysponowania i mają prawo ubiegać się o
                te dni w pierwszej kolejności Kierownicy Naukowi rejsów, którzy
                to ze względu na uzyskany niski wynik w priorytetyzacji nie
                otrzymali możliwości odbycia pierwotnie zgłaszanego w formularzu
                A rejsu.
              </Cell>
            </Row>
            <Row>
              <Cell>Dydaktyka</Cell>
              <Cell>
                Najwyższy priorytet („na sztywno” ustalone konkretne przedziały
                czasowe w roku)
              </Cell>
            </Row>
            <Row>
              <Cell>
                Realizacja własnego zadania badawczego, ukierunkowanego na
                powstanie publikacji naukowej
              </Cell>
              <Cell>
                100 punktów UWAGA: Zgłaszanie rejsu w ramach tego zadania wymaga
                przedstawienia krótkiego (1 strona A4) opisu zadania badawczego,
                uwzględniającego cel i założenia, metody, ramy czasowe oraz
                łączną liczbę dni rejsowych przewidzianą na pełną realizację
                zadania (zakończoną napisaniem publikacji naukowej do czasopisma
                z listy JCR). Obowiązkowo należy również podać roboczy tytuł,
                czasopismo (liczba punktów ministerialnych) oraz rok złożenia
                planowanej publikacji naukowej.
              </Cell>
            </Row>
            <Row>
              <Cell>Inne</Cell>
              <Cell>Do indywidualnego rozpatrzenia</Cell>
            </Row>
            <Row>
              <Cell colSpan={2} className="bg-slate-300 font-semibold">
                4. Współpraca zewnętrzna na podstawie umowy:
              </Cell>
            </Row>
            <Row>
              <Cell>Międzynarodowa</Cell>
              <Cell>300 punktów</Cell>
            </Row>
            <Row>
              <Cell>Krajowa</Cell>
              <Cell>150 punktów</Cell>
            </Row>
            <Row>
              <Cell>Brak współpracy</Cell>
              <Cell>-</Cell>
            </Row>
            <Row>
              <Cell>Uwaga:</Cell>
              <Cell>
                Na potrzeby priorytetyzacji za współpracę
                międzynarodową/krajową/uniwersytecką rozumie się fakt, że co
                najmniej jedna osoba z instytucji zagranicznej/krajowej będzie
                uczestniczyć w zgłaszanym rejsie.
              </Cell>
            </Row>
            <Row>
              <Cell colSpan={2} className="bg-slate-300 font-semibold">
                5. Zespoły badawcze:
              </Cell>
            </Row>
            <Row>
              <Cell>Uczestnictwo naukowców spoza UG </Cell>
              <Cell>(punkty uwzględnione już w pkt. 4)</Cell>
            </Row>
            <Row>
              <Cell>
                Uczestnictwo osób z 3 lub więcej jednostek organizacyjnych UG
              </Cell>
              <Cell>100 punktów</Cell>
            </Row>
            <Row>
              <Cell>Uczestnictwo osób z 2 jednostek organizacyjnych UG</Cell>
              <Cell>50 punktów</Cell>
            </Row>
            <Row>
              <Cell>
                Uczestnictwo osób jedynie z 1 jednostki organizacyjnej{' '}
              </Cell>
              <Cell>-</Cell>
            </Row>
            <Row>
              <Cell colSpan={2} className="bg-slate-300 font-semibold">
                6. Historia publikacji:
              </Cell>
            </Row>
            <Row>
              <Cell>
                A) Publikacje z ubiegłych 5-lat, związane bezpośrednio
                tematycznie z zadaniami do realizacji na planowanym rejsie,
                opublikowane przez zespół zaangażowany w realizację rejsu, z
                afiliacją UG (należy podać publikacje, wpisując dla każdej z
                nich: autorów, rok wydania, tytuł, nazwę czasopisma i nr, DOI i
                liczbę punktów ministerialnych).
              </Cell>
              <Cell>
                0,5 x suma liczby punktów ministerialnych za wszystkie
                publikacje
              </Cell>
            </Row>
            <Row>
              <Cell>
                B) Publikacje z listy powyżej oraz inne niezwiązane tematycznie
                z zadaniami do realizacji na planowanym rejsie, autorstwa
                zespołu zaangażowanego w realizację rejsu, ALE zawierające
                dopisek w treści publikacji (w wersji polskiej lub w innym
                języku), że „badania w ramach niniejszej publikacji były
                prowadzone z pokładu RV Oceanograf” (należy podać publikacje,
                wpisując dla każdej z nich: autorów, rok wydania, tytuł, nazwę
                czasopisma i nr, DOI i liczbę punktów ministerialnych).
              </Cell>
              <Cell>
                suma liczby punktów ministerialnych za wszystkie publikacje
              </Cell>
            </Row>
            <Row>
              <Cell colSpan={2} className="bg-slate-300 font-semibold">
                7. Efekty rejsu:
              </Cell>
            </Row>
            <Row>
              <Cell>
                Powstanie prac(y) dyplomowa(wych) (licencjackie lub
                magisterskie)
              </Cell>
              <Cell>
                20 punktów – praca licencjacka 50 punktów – praca magisterska
                UWAGA: Powstałe i obronione prace muszą zawierać dopisek, że
                badania były realizowane (próbki były pobierane) z pokładu R/V
                Oceanograf. Punkty uwzględnianie w priorytetyzacji pod
                warunkiem, że Kierownik Naukowy zgłaszanego rejsu był promotorem
                tych prac.
              </Cell>
            </Row>
            <Row>
              <Cell>Powstanie pracy doktorskiej</Cell>
              <Cell>
                200 punktów – praca doktorska UWAGA: Powstałe i obronione prace
                muszą zawierać dopisek, że badania były realizowane (próbki były
                pobierane) z pokładu R/V Oceanograf. Punkty uwzględnianie w
                priorytetyzacji pod warunkiem, że Kierownik Naukowy zgłaszanego
                rejsu był promotorem tej pracy LUB autorem tej pracy i
                jednocześnie pracownikiem UG.
              </Cell>
            </Row>
            <Row>
              <Cell>
                Przygotowanie do projektu naukowego lub badawczo-rozwojowego
              </Cell>
              <Cell>
                100 punktów, jeżeli w ramach zrealizowanego pod to zadanie rejsu
                powstała publikacja naukowa za co najmniej 100 punktów
                ministerialnych LUB jeżeli po zrealizowanym pod to zadanie
                rejsie Kierownik Naukowy rejsu uzyskał finansowanie projektu w
                przeciągu kolejnych 2 lat od daty rejsu.
              </Cell>
            </Row>
            <Row>
              <Cell>
                Realizacja projektu naukowego lub badawczo-rozwojowego
              </Cell>
              <Cell>
                0,5 x liczba punktów ministerialnych uzyskanych za publikację
                naukową powstałą w ramach (z)realizowanego projektu
              </Cell>
            </Row>
            <Row>
              <Cell>Do realizacji projektu komercyjnego</Cell>
              <Cell>-</Cell>
            </Row>
            <Row>
              <Cell>Dydaktyka</Cell>
              <Cell>-</Cell>
            </Row>
            <Row>
              <Cell>
                Do realizacji własnego zadania badawczego, ukierunkowanego na
                powstanie publikacji naukowej
              </Cell>
              <Cell>
                0,5 x liczba punktów ministerialnych uzyskanych za publikację
                naukową powstałą po zrealizowaniu własnego zadania badawczego.
              </Cell>
            </Row>
            <Row>
              <Cell>
                Inne…. (opcja do wpisania innego efektu, np. testowanie nowych
                technologii, urządzeń itp.)
              </Cell>
              <Cell>Do indywidualnego rozpatrzenia</Cell>
            </Row>
            <Row>
              <Cell>Uwaga:</Cell>
              <Cell>
                Punkty za publikacje w ramach punktu 7 (powyższa tabela) są
                liczone dodatkowo względem punktów uzyskiwanych w ramach punktu
                6 (Historia publikacji) i wskazują one na „efektywność
                planowania” danego Kierownika Naukowego.
              </Cell>
            </Row>
            <Row>
              <Cell colSpan={2} className="bg-slate-300 font-semibold">
                8. Zadania badawcze z wniosku SPUB:
              </Cell>
            </Row>
            <Row>
              <Cell>
                Jeżeli dane zadanie w ramach realizacji którego odbywa się rejs
                zostało zgłoszone we wniosku SPUB
              </Cell>
              <Cell>Dodatkowo 100 punktów.</Cell>
            </Row>
            <Row>
              <Cell colSpan={2} className="bg-slate-300 font-semibold">
                9. Uwagi końcowe:
              </Cell>
            </Row>
            <Row>
              <Cell colSpan={2}>
                1. W przypadku rezygnacji z części zamówionych wcześniej dni
                rejsowych (np. gdy uda się zrealizować zamierzone prace
                wcześniej, ze względu na odpowiednie warunki pogodowe), te
                „wolne” dni rejsowe z powrotem trafiają do puli do
                rozdysponowania i mają prawo ubiegać się o te dni w pierwszej
                kolejności Kierownicy Naukowi rejsów, którzy to ze względu na
                uzyskany niski wynik w priorytetyzacji nie otrzymali możliwości
                odbycia pierwotnie zgłaszanego w formularzu A rejsu.
              </Cell>
            </Row>
            <Row>
              <Cell colSpan={2}>
                2. Kwestia j.w. dotyczy również wolnych dni rejsowych w
                harmonogramie, które to pojawiły się po tym, jak Kierownik
                Naukowy zrezygnował ze „swojego” rejsu.
              </Cell>
            </Row>
            <Row>
              <Cell colSpan={2}>
                3. Na potwierdzenie tego, że dany projekt naukowy lub
                naukowo-badawczy jest rzeczywiście realizowany w danym momencie
                (ramy czasowe) i we wniosek projektowy zostało wpisane, że
                badania będą realizowane z pokładu r/v Oceanograf, w Biurze
                Armatora należy przedstawić odpowiednie dokumenty (wniosek
                projektowy, decyzja o finansowaniu)
              </Cell>
            </Row>
            <Row>
              <Cell colSpan={2}>
                4. W ramach realizacji własnego zadania badawczego, podczas
                składania formularza A należy dodatkowo przedstawić w Biurze
                Armatora krótki (ok. 1 strona A4) opis zadania badawczego,
                uwzględniający cel i założenia, metody, ramy czasowe oraz łączną
                liczbę dni rejsowych przewidzianą na pełną realizację zadania
                (zakończoną napisaniem publikacji naukowej do czasopisma z listy
                JCR). Obowiązkowo należy również podać roboczy tytuł, czasopismo
                (liczba punktów ministerialnych) oraz rok złożenia planowanej
                publikacji naukowej. DOSTOSOWAĆ DO NOWYCH WARUNKÓW
              </Cell>
            </Row>
          </tbody>
        </table>
      </div>
    </AppPage>
  );
}
