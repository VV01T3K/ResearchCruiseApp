import { AppLayout } from '@/core/components/AppLayout';
import { PriorityInformationCell } from '@/other/components/PriorityInformationCell';
import { PriorityInformationRow } from '@/other/components/PriorityInformationRow';

export function PriorityInformationPage() {
  return (
    <AppLayout title="Informacje o priorytetyzacji" variant="defaultWithoutCentering">
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
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2} className="bg-slate-300 font-semibold">
                1. Prace naukowe:
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Praca licencjacka</PriorityInformationCell>
              <PriorityInformationCell>20 punktów</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Praca magisterska</PriorityInformationCell>
              <PriorityInformationCell>50 punktów</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Praca doktorska</PriorityInformationCell>
              <PriorityInformationCell>100 punktów</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>
                Przygotowanie do projektu naukowego lub badawczo-rozwojowego
              </PriorityInformationCell>
              <PriorityInformationCell>
                100 punktów – w przypadku braku decyzji o finansowaniu (tzn. wniosek projektowy ma być dopiero składany)
                150 punktów – w przypadku otrzymania decyzji o finansowaniu (ale jeszcze przed oficjalnym rozpoczęciem
                realizacji projektu)
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2} className="bg-slate-300 font-semibold">
                2. Realizacja projektu w ramach:
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>1) NCN, NCBiR oraz inne krajowe</PriorityInformationCell>
              <PriorityInformationCell>
                50 punktów za każde pełne 100 000 przyznanego dla UG finansowania
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>
                2) zagraniczne (np. ERC, programy ramowe UE, fundusze norweskie)
              </PriorityInformationCell>
              <PriorityInformationCell>
                80 punktów za każde pełne 100 000 przyznanego dla UG finansowania
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>3) projekty wewnętrzne UG</PriorityInformationCell>
              <PriorityInformationCell>30 punktów za projekt</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Uwaga:</PriorityInformationCell>
              <PriorityInformationCell>
                Dotyczy jedynie projektów zatwierdzonych do finansowania oficjalną decyzją uzyskaną z instytucji
                finansującej. Ponadto, na etapie aplikowania, we wniosku projektowym musiało być wpisane, że badania
                będą pPriorityInformationRowadzone na r/v Oceanograf i w jakim wymiarze czasowym.
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2} className="bg-slate-300 font-semibold">
                3. Realizacja innych projektów:
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Projekt komercyjny</PriorityInformationCell>
              <PriorityInformationCell>
                Do indywidualnego rozpatrzenia UWAGA: W przypadku rezygnacji z części zamówionych wcześniej dni
                rejsowych (np. gdy uda się zrealizować zamierzone prace wcześniej, ze względu na odpowiednie warunki
                pogodowe), te „wolne” dni rejsowe z powrotem trafiają do puli do rozdysponowania i mają prawo ubiegać
                się o te dni w pierwszej kolejności KiePriorityInformationRownicy Naukowi rejsów, którzy to ze względu
                na uzyskany niski wynik w priorytetyzacji nie otrzymali możliwości odbycia pierwotnie zgłaszanego w
                formularzu A rejsu.
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Dydaktyka</PriorityInformationCell>
              <PriorityInformationCell>
                Najwyższy priorytet („na sztywno” ustalone konkretne przedziały czasowe w roku)
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>
                Realizacja własnego zadania badawczego, ukierunkowanego na powstanie publikacji naukowej
              </PriorityInformationCell>
              <PriorityInformationCell>
                100 punktów UWAGA: Zgłaszanie rejsu w ramach tego zadania wymaga przedstawienia krótkiego (1 strona A4)
                opisu zadania badawczego, uwzględniającego cel i założenia, metody, ramy czasowe oraz łączną liczbę dni
                rejsowych przewidzianą na pełną realizację zadania (zakończoną napisaniem publikacji naukowej do
                czasopisma z listy JCR). Obowiązkowo należy również podać roboczy tytuł, czasopismo (liczba punktów
                ministerialnych) oraz rok złożenia planowanej publikacji naukowej.
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Inne</PriorityInformationCell>
              <PriorityInformationCell>Do indywidualnego rozpatrzenia</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2} className="bg-slate-300 font-semibold">
                4. Współpraca zewnętrzna na podstawie umowy:
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Międzynarodowa</PriorityInformationCell>
              <PriorityInformationCell>300 punktów</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Krajowa</PriorityInformationCell>
              <PriorityInformationCell>150 punktów</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Brak współpracy</PriorityInformationCell>
              <PriorityInformationCell>-</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Uwaga:</PriorityInformationCell>
              <PriorityInformationCell>
                Na potrzeby priorytetyzacji za współpracę międzynarodową/krajową/uniwersytecką rozumie się fakt, że co
                najmniej jedna osoba z instytucji zagranicznej/krajowej będzie uczestniczyć w zgłaszanym rejsie.
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2} className="bg-slate-300 font-semibold">
                5. Zespoły badawcze:
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Uczestnictwo naukowców spoza UG </PriorityInformationCell>
              <PriorityInformationCell>(punkty uwzględnione już w pkt. 4)</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>
                Uczestnictwo osób z 3 lub więcej jednostek organizacyjnych UG
              </PriorityInformationCell>
              <PriorityInformationCell>100 punktów</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Uczestnictwo osób z 2 jednostek organizacyjnych UG</PriorityInformationCell>
              <PriorityInformationCell>50 punktów</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Uczestnictwo osób jedynie z 1 jednostki organizacyjnej </PriorityInformationCell>
              <PriorityInformationCell>-</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2} className="bg-slate-300 font-semibold">
                6. Historia publikacji:
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>
                A) Publikacje z ubiegłych 5-lat, związane bezpośrednio tematycznie z zadaniami do realizacji na
                planowanym rejsie, opublikowane przez zespół zaangażowany w realizację rejsu, z afiliacją UG (należy
                podać publikacje, wpisując dla każdej z nich: autorów, rok wydania, tytuł, nazwę czasopisma i nr, DOI i
                liczbę punktów ministerialnych).
              </PriorityInformationCell>
              <PriorityInformationCell>
                0,5 x suma liczby punktów ministerialnych za wszystkie publikacje
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>
                B) Publikacje z listy powyżej oraz inne niezwiązane tematycznie z zadaniami do realizacji na planowanym
                rejsie, autorstwa zespołu zaangażowanego w realizację rejsu, ALE zawierające dopisek w treści publikacji
                (w wersji polskiej lub w innym języku), że „badania w ramach niniejszej publikacji były
                pPriorityInformationRowadzone z pokładu RV Oceanograf” (należy podać publikacje, wpisując dla każdej z
                nich: autorów, rok wydania, tytuł, nazwę czasopisma i nr, DOI i liczbę punktów ministerialnych).
              </PriorityInformationCell>
              <PriorityInformationCell>
                suma liczby punktów ministerialnych za wszystkie publikacje
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2} className="bg-slate-300 font-semibold">
                7. Efekty rejsu:
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>
                Powstanie prac(y) dyplomowa(wych) (licencjackie lub magisterskie)
              </PriorityInformationCell>
              <PriorityInformationCell>
                20 punktów – praca licencjacka 50 punktów – praca magisterska UWAGA: Powstałe i obronione prace muszą
                zawierać dopisek, że badania były realizowane (próbki były pobierane) z pokładu R/V Oceanograf. Punkty
                uwzględnianie w priorytetyzacji pod warunkiem, że KiePriorityInformationRownik Naukowy zgłaszanego rejsu
                był promotorem tych prac.
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Powstanie pracy doktorskiej</PriorityInformationCell>
              <PriorityInformationCell>
                200 punktów – praca doktorska UWAGA: Powstałe i obronione prace muszą zawierać dopisek, że badania były
                realizowane (próbki były pobierane) z pokładu R/V Oceanograf. Punkty uwzględnianie w priorytetyzacji pod
                warunkiem, że KiePriorityInformationRownik Naukowy zgłaszanego rejsu był promotorem tej pracy LUB
                autorem tej pracy i jednocześnie pracownikiem UG.
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>
                Przygotowanie do projektu naukowego lub badawczo-rozwojowego
              </PriorityInformationCell>
              <PriorityInformationCell>
                100 punktów, jeżeli w ramach zrealizowanego pod to zadanie rejsu powstała publikacja naukowa za co
                najmniej 100 punktów ministerialnych LUB jeżeli po zrealizowanym pod to zadanie rejsie
                KiePriorityInformationRownik Naukowy rejsu uzyskał finansowanie projektu w przeciągu kolejnych 2 lat od
                daty rejsu.
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Realizacja projektu naukowego lub badawczo-rozwojowego</PriorityInformationCell>
              <PriorityInformationCell>
                0,5 x liczba punktów ministerialnych uzyskanych za publikację naukową powstałą w ramach (z)realizowanego
                projektu
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Do realizacji projektu komercyjnego</PriorityInformationCell>
              <PriorityInformationCell>-</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Dydaktyka</PriorityInformationCell>
              <PriorityInformationCell>-</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>
                Do realizacji własnego zadania badawczego, ukierunkowanego na powstanie publikacji naukowej
              </PriorityInformationCell>
              <PriorityInformationCell>
                0,5 x liczba punktów ministerialnych uzyskanych za publikację naukową powstałą po zrealizowaniu własnego
                zadania badawczego.
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>
                Inne…. (opcja do wpisania innego efektu, np. testowanie nowych technologii, urządzeń itp.)
              </PriorityInformationCell>
              <PriorityInformationCell>Do indywidualnego rozpatrzenia</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>Uwaga:</PriorityInformationCell>
              <PriorityInformationCell>
                Punkty za publikacje w ramach punktu 7 (powyższa tabela) są liczone dodatkowo względem punktów
                uzyskiwanych w ramach punktu 6 (Historia publikacji) i wskazują one na „efektywność planowania” danego
                KiePriorityInformationRownika Naukowego.
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2} className="bg-slate-300 font-semibold">
                8. Zadania badawcze z wniosku SPUB:
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell>
                Jeżeli dane zadanie w ramach realizacji którego odbywa się rejs zostało zgłoszone we wniosku SPUB
              </PriorityInformationCell>
              <PriorityInformationCell>Dodatkowo 100 punktów.</PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2} className="bg-slate-300 font-semibold">
                9. Uwagi końcowe:
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2}>
                1. W przypadku rezygnacji z części zamówionych wcześniej dni rejsowych (np. gdy uda się zrealizować
                zamierzone prace wcześniej, ze względu na odpowiednie warunki pogodowe), te „wolne” dni rejsowe z
                powrotem trafiają do puli do rozdysponowania i mają prawo ubiegać się o te dni w pierwszej kolejności
                KiePriorityInformationRownicy Naukowi rejsów, którzy to ze względu na uzyskany niski wynik w
                priorytetyzacji nie otrzymali możliwości odbycia pierwotnie zgłaszanego w formularzu A rejsu.
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2}>
                2. Kwestia j.w. dotyczy również wolnych dni rejsowych w harmonogramie, które to pojawiły się po tym, jak
                KiePriorityInformationRownik Naukowy zrezygnował ze „swojego” rejsu.
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2}>
                3. Na potwierdzenie tego, że dany projekt naukowy lub naukowo-badawczy jest rzeczywiście realizowany w
                danym momencie (ramy czasowe) i we wniosek projektowy zostało wpisane, że badania będą realizowane z
                pokładu r/v Oceanograf, w Biurze Armatora należy przedstawić odpowiednie dokumenty (wniosek projektowy,
                decyzja o finansowaniu)
              </PriorityInformationCell>
            </PriorityInformationRow>
            <PriorityInformationRow>
              <PriorityInformationCell colSpan={2}>
                4. W ramach realizacji własnego zadania badawczego, podczas składania formularza A należy dodatkowo
                przedstawić w Biurze Armatora krótki (ok. 1 strona A4) opis zadania badawczego, uwzględniający cel i
                założenia, metody, ramy czasowe oraz łączną liczbę dni rejsowych przewidzianą na pełną realizację
                zadania (zakończoną napisaniem publikacji naukowej do czasopisma z listy JCR). Obowiązkowo należy
                również podać roboczy tytuł, czasopismo (liczba punktów ministerialnych) oraz rok złożenia planowanej
                publikacji naukowej. DOSTOSOWAĆ DO NOWYCH WARUNKÓW
              </PriorityInformationCell>
            </PriorityInformationRow>
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
