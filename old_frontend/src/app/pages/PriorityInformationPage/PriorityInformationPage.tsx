import Page from "../../../ToBeMoved/Pages/Page"
import PageTitle from "../../../components/Page/PageTitle"

function PriorityInformationPage() {
  const TableRow = (props: { type: string | undefined; points: string | undefined }) => (
    <tr>
      <td className={"priority-cell px-3"}>{props.type}</td>
      <td className={"priority-cell px-3"}>{props.points}</td>
    </tr>
  )

  const TableWideRow = (props: { info: string | undefined }) => (
    <tr>
      <td colSpan={2} className={"priority-cell px-3"}>
        {props.info}
      </td>
    </tr>
  )

  const TableHeader = (props: { header: string | undefined }) => (
    <tr>
      <td colSpan={2} className={"priority-section-header"}>
        {props.header}:
      </td>
    </tr>
  )

  return (
    <Page className={"form-page"}>
      <PageTitle title={"Informacje o priorytetyzacji"} />
      <div className="table-striped w-100 p-5  overflow-y-scroll-override">
        <table className={"priority-table"}>
          <thead>
            <tr>
              <th className={"priority-header"}>Rodzaj zadania z formularza</th>
              <th className={"priority-header"}>Przyznawane punkty</th>
            </tr>
          </thead>
          <tbody>
            <TableHeader header="1. Prace naukowe"></TableHeader>
            <TableRow type="Praca licencjacka" points="20 punktów"></TableRow>
            <TableRow type="Praca magisterska" points="50 punktów"></TableRow>
            <TableRow type="Praca doktorska" points="100 punktów"></TableRow>
            <TableRow
              type="Przygotowanie do projektu naukowego lub badawczo-rozwojowego"
              points={
                "100 punktów – w przypadku braku decyzji o finansowaniu (tzn. wniosek projektowy ma być dopiero składany)\n" +
                "150 punktów – w przypadku otrzymania decyzji o finansowaniu (ale jeszcze przed oficjalnym rozpoczęciem realizacji projektu)"
              }
            ></TableRow>
            <TableHeader header="2. Realizacja projektu w ramach"></TableHeader>
            <TableRow
              type="1)	NCN, NCBiR oraz inne krajowe"
              points="50 punktów za każde pełne 100 000 przyznanego dla UG finansowania"
            ></TableRow>
            <TableRow
              type="2)	zagraniczne (np. ERC, programy ramowe UE, fundusze norweskie)"
              points="80 punktów za każde pełne 100 000 przyznanego dla UG finansowania"
            ></TableRow>
            <TableRow type="3)	projekty wewnętrzne UG" points="30 punktów za projekt"></TableRow>
            <TableRow
              type={"Uwaga:"}
              points={
                "Dotyczy jedynie projektów zatwierdzonych do finansowania oficjalną decyzją uzyskaną z instytucji finansującej. Ponadto, na etapie aplikowania, we wniosku projektowym musiało być wpisane, że badania będą prowadzone na r/v Oceanograf i w jakim wymiarze czasowym."
              }
            ></TableRow>
            <TableHeader header={"3. Realizacja innych projektów"}></TableHeader>
            <TableRow
              type={"Projekt komercyjny"}
              points={
                "Do indywidualnego rozpatrzenia\n\n" +
                "UWAGA: W przypadku rezygnacji z części zamówionych wcześniej dni rejsowych (np. gdy uda się zrealizować zamierzone prace wcześniej, ze względu na odpowiednie warunki pogodowe), te „wolne” dni rejsowe z powrotem trafiają do puli do rozdysponowania i mają prawo ubiegać się o te dni w pierwszej kolejności Kierownicy Naukowi rejsów, którzy to ze względu na uzyskany niski wynik w priorytetyzacji nie otrzymali możliwości odbycia pierwotnie zgłaszanego w formularzu A rejsu."
              }
            ></TableRow>
            <TableRow
              type={"Dydaktyka"}
              points={
                "Najwyższy priorytet („na sztywno” ustalone konkretne przedziały czasowe w roku)"
              }
            ></TableRow>
            <TableRow
              type={
                "Realizacja własnego zadania badawczego, ukierunkowanego na powstanie publikacji naukowej"
              }
              points={
                "100 punktów \n\n" +
                "UWAGA: Zgłaszanie rejsu w ramach tego zadania wymaga przedstawienia krótkiego (1 strona A4) opisu zadania badawczego, uwzględniającego cel i założenia, metody, ramy czasowe oraz łączną liczbę dni rejsowych przewidzianą na pełną realizację zadania (zakończoną napisaniem publikacji naukowej do czasopisma z listy JCR). Obowiązkowo należy również podać roboczy tytuł, czasopismo (liczba punktów ministerialnych) oraz rok złożenia  planowanej publikacji naukowej."
              }
            ></TableRow>
            <TableRow type={"Inne"} points={"Do indywidualnego rozpatrzenia"}></TableRow>
            <TableHeader header={"4. Współpraca zewnętrzna na podstawie umowy"}></TableHeader>
            <TableRow type={"Międzynarodowa"} points={"300 punktów"}></TableRow>
            <TableRow type={"Krajowa"} points={"150 punktów"}></TableRow>
            <TableRow type={"Brak współpracy"} points={"-"}></TableRow>
            <TableRow
              type={"Uwaga:"}
              points={
                "Na potrzeby priorytetyzacji za współpracę międzynarodową/krajową/uniwersytecką rozumie się fakt, że co najmniej jedna osoba z instytucji zagranicznej/krajowej będzie uczestniczyć w zgłaszanym rejsie."
              }
            ></TableRow>
            <TableHeader header={"5. Zespoły badawcze"}></TableHeader>
            <TableRow
              type={"Uczestnictwo naukowców spoza UG "}
              points={"(punkty uwzględnione już w pkt. 4)"}
            ></TableRow>
            <TableRow
              type={"Uczestnictwo osób z 3 lub więcej jednostek organizacyjnych UG"}
              points={"100 punktów"}
            ></TableRow>
            <TableRow
              type={"Uczestnictwo osób z 2 jednostek organizacyjnych UG"}
              points={"50 punktów"}
            ></TableRow>
            <TableRow
              type={"Uczestnictwo osób jedynie z 1 jednostki organizacyjnej "}
              points={"-"}
            ></TableRow>
            <TableHeader header={"6. Historia publikacji"}></TableHeader>
            <TableRow
              type={
                "A) Publikacje z ubiegłych 5-lat, związane bezpośrednio tematycznie z zadaniami do realizacji na planowanym rejsie, opublikowane przez zespół zaangażowany w realizację rejsu, z afiliacją UG (należy podać publikacje, wpisując dla każdej z nich: autorów, rok wydania, tytuł, nazwę czasopisma i nr, DOI i liczbę punktów ministerialnych)."
              }
              points={"0,5 x suma liczby punktów ministerialnych za wszystkie publikacje"}
            ></TableRow>
            <TableRow
              type={
                "B) Publikacje z listy powyżej oraz inne niezwiązane tematycznie z zadaniami do realizacji na planowanym rejsie, autorstwa zespołu zaangażowanego w realizację rejsu, ALE zawierające dopisek w treści publikacji (w wersji polskiej lub w innym języku), że „badania w ramach niniejszej publikacji były prowadzone z pokładu RV Oceanograf” (należy podać publikacje, wpisując dla każdej z nich: autorów, rok wydania, tytuł, nazwę czasopisma i nr, DOI i liczbę punktów ministerialnych)."
              }
              points={"suma liczby punktów ministerialnych za wszystkie publikacje"}
            ></TableRow>
            <TableHeader header={"7. Efekty rejsu"}></TableHeader>
            <TableRow
              type={"Powstanie prac(y) dyplomowa(wych) (licencjackie lub magisterskie)"}
              points={
                "20 punktów – praca licencjacka\n" +
                "50 punktów – praca magisterska\n\n" +
                "UWAGA: Powstałe i obronione prace muszą zawierać dopisek, że badania były realizowane (próbki były pobierane) z pokładu R/V Oceanograf.\n" +
                "Punkty uwzględnianie w priorytetyzacji pod warunkiem, że Kierownik Naukowy zgłaszanego rejsu był promotorem tych prac."
              }
            ></TableRow>
            <TableRow
              type={"Powstanie pracy doktorskiej"}
              points={
                "200 punktów – praca doktorska\n\n" +
                "UWAGA: Powstałe i obronione prace muszą zawierać dopisek, że badania były realizowane (próbki były pobierane) z pokładu R/V Oceanograf.\n" +
                "Punkty uwzględnianie w priorytetyzacji pod warunkiem, że Kierownik Naukowy zgłaszanego rejsu był promotorem tej pracy LUB autorem tej pracy i jednocześnie pracownikiem UG."
              }
            ></TableRow>
            <TableRow
              type={"Przygotowanie do projektu naukowego lub badawczo-rozwojowego"}
              points={
                "100 punktów, jeżeli w ramach zrealizowanego pod to zadanie rejsu powstała publikacja naukowa za co najmniej 100 punktów ministerialnych\n" +
                "LUB jeżeli po zrealizowanym pod to zadanie rejsie Kierownik Naukowy rejsu uzyskał finansowanie projektu w przeciągu kolejnych 2 lat od daty rejsu.\n"
              }
            ></TableRow>
            <TableRow
              type={"Realizacja projektu naukowego lub badawczo-rozwojowego"}
              points={
                "0,5 x liczba punktów ministerialnych uzyskanych za publikację naukową powstałą w ramach (z)realizowanego projektu"
              }
            ></TableRow>
            <TableRow type={"Do realizacji projektu komercyjnego"} points={"-"}></TableRow>
            <TableRow type={"Dydaktyka"} points={"-"}></TableRow>
            <TableRow
              type={
                "Do realizacji własnego zadania badawczego, ukierunkowanego na powstanie publikacji naukowej"
              }
              points={
                "0,5 x liczba punktów ministerialnych uzyskanych za publikację naukową powstałą po zrealizowaniu własnego zadania badawczego."
              }
            ></TableRow>
            <TableRow
              type={
                "Inne…. (opcja do wpisania innego efektu, np. testowanie nowych technologii, urządzeń itp.)"
              }
              points={"Do indywidualnego rozpatrzenia"}
            ></TableRow>
            <TableRow
              type={"Uwaga:"}
              points={
                "Punkty za publikacje w ramach punktu 7 (powyższa tabela) są liczone dodatkowo względem punktów uzyskiwanych w ramach punktu 6 (Historia publikacji) i wskazują one na „efektywność planowania” danego Kierownika Naukowego."
              }
            ></TableRow>
            <TableHeader header={"8. Zadania badawcze z wniosku SPUB"}></TableHeader>
            <TableRow
              type={
                "Jeżeli dane zadanie w ramach realizacji którego odbywa się rejs zostało zgłoszone we wniosku SPUB"
              }
              points={"Dodatkowo 100 punktów."}
            ></TableRow>
            <TableHeader header={"9. Uwagi końcowe"}></TableHeader>
            <TableWideRow
              info={
                "1. W przypadku rezygnacji z części zamówionych wcześniej dni rejsowych (np. gdy uda się zrealizować zamierzone prace wcześniej, ze względu na odpowiednie warunki pogodowe), te „wolne” dni rejsowe z powrotem trafiają do puli do rozdysponowania i mają prawo ubiegać się o te dni w pierwszej kolejności Kierownicy Naukowi rejsów, którzy to ze względu na uzyskany niski wynik w priorytetyzacji nie otrzymali możliwości odbycia pierwotnie zgłaszanego w formularzu A rejsu."
              }
            ></TableWideRow>
            <TableWideRow
              info={
                "2. Kwestia j.w. dotyczy również wolnych dni rejsowych w harmonogramie, które to pojawiły się po tym, jak Kierownik Naukowy zrezygnował ze „swojego” rejsu."
              }
            ></TableWideRow>
            <TableWideRow
              info={
                "3. Na potwierdzenie tego, że dany projekt naukowy lub naukowo-badawczy jest rzeczywiście realizowany w danym momencie (ramy czasowe) i we wniosek projektowy zostało wpisane, że badania będą realizowane z pokładu r/v Oceanograf, w Biurze Armatora należy przedstawić odpowiednie dokumenty (wniosek projektowy, decyzja o finansowaniu)"
              }
            ></TableWideRow>
            <TableWideRow
              info={
                "4. W ramach realizacji własnego zadania badawczego, podczas składania formularza A należy dodatkowo przedstawić w Biurze Armatora krótki (ok. 1 strona A4) opis zadania badawczego, uwzględniający cel i założenia, metody, ramy czasowe oraz łączną liczbę dni rejsowych przewidzianą na pełną realizację zadania (zakończoną napisaniem publikacji naukowej do czasopisma z listy JCR). Obowiązkowo należy również podać roboczy tytuł, czasopismo (liczba punktów ministerialnych) oraz rok złożenia  planowanej publikacji naukowej.   DOSTOSOWAĆ DO NOWYCH WARUNKÓW"
              }
            ></TableWideRow>
          </tbody>
        </table>
      </div>
    </Page>
  )
}

export default PriorityInformationPage
