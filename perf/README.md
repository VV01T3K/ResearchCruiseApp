# Pomiary wydajności listy zgłoszeń (old vs new)

Narzędzia do porównania widoku **Zgłoszenia** (`/applications`) w dwóch wersjach aplikacji:

| wariant | wersja | lista | API listy | logowanie |
|---|---|---|---|---|
| `old` | tag `v2.5.1` | wszystkie zgłoszenia naraz, filtrowanie/sortowanie w przeglądarce | `GET /api/CruiseApplications` | tokeny w `localStorage` |
| `new` | branch `staging` | strony po 20 (kursor/keyset), doczytywanie przy przewijaniu, wirtualizacja wierszy, filtrowanie/sortowanie na serwerze | `GET /v2/applications?pageSize=20&cursor=…` | refresh token w ciasteczku HttpOnly |

Katalog `perf/` jest samowystarczalny: nie importuje nic z kodu aplikacji i działa bez zmian na obu wersjach.
Różnice opisują parametry (`--variant old|new` ustawia domyślne wartości dla danej wersji).
Nie jest wpięty w CI ani w testy e2e.

| plik | rola |
|---|---|
| `seed.mjs` | deterministyczny seeder danych testowych (SQL, niezależny od brancha) |
| `measure-ui.mjs` | pomiary w przeglądarce (Playwright, Chromium, headless) → `results/results.csv` |
| `measure-api.mjs` | pomiary samego endpointu listy → `results/api-results.csv` |
| `aggregate.mjs` | mediana / p95 / odchylenie standardowe + wykresy → `results/summary.csv`, `results/api-summary.csv`, `results/charts/` |
| `lib/` | parametry, logowanie, statystyki, CSV |

> **Ważne:** porównanie `new` obejmuje **paginację i wirtualizację wierszy** (TanStack Virtual, w DOM jest tylko
> ok. 10–20 widocznych wierszy). W pracy warto to napisać wprost.

---

## 1. Jednorazowe przygotowanie

Wymagane: Docker Desktop, .NET 10 SDK, Node.js ≥ 20, Bun 1.3 (staging) i pnpm 10 (v2.5.1).
Jeśli używasz `mise`, wersje są w `mise.toml` na każdym branchu.

```powershell
cd perf
npm install
npx playwright install chromium
```

`perf/` nie jest śledzony przez gita, więc przy `git checkout` zostaje na miejscu.
Jeśli wolisz trzymać go poza repozytorium, podaj ścieżki do plików z repo jawnie (patrz „Parametry”).

### Baza danych i konta

Jedna baza służy obu wariantom. Przygotuj ją **na branchu `staging`**, bo ma nowszy schemat.
Stara wersja działa na nim bez zmian: w trybie Production v2.5.1 nie uruchamia migracji,
a jedyne różnice to dodatkowy indeks i dwie nowe tabele.

```powershell
git checkout staging
docker compose -f docker/docker-compose.infra.yml up -d db
# pierwszy start w trybie Development: migracje + role + konta z users.json (hasła losowe, wypisane w logu)
dotnet run --project backend/ResearchCruiseApp
```

W logu szukaj linii `Seed User Created: admin@gmail.com - <hasło>`, potem zatrzymaj backend (Ctrl+C).
Zapisz hasło w zmiennej środowiskowej, w kodzie go nie ma:

```powershell
$env:PERF_PASSWORD = "<hasło admina z logu>"
```

Na Linuksie/WSL możesz zamiast tego uruchomić `mise run seed`. Utworzy wtedy `credentials.log`
w katalogu głównym repo, a skrypty odczytają go automatycznie.

### Dane testowe

```powershell
cd perf
node seed.mjs --n 1000      # usuwa poprzednie dane perf i wstawia dokładnie 1000 zgłoszeń
node seed.mjs --remove      # sprzątanie
```

Seeder działa bezpośrednio na SQL Serverze, więc jest niezależny od brancha.
Dane zależą tylko od `SEED` (domyślnie 42) i `REFERENCE_DATE` (domyślnie 2026-09-01), nie od daty uruchomienia.
Te same N dają identyczne dane, a mniejsze N jest podzbiorem większego.
Rozkład danych:

- 30 kierowników (`--managers`), aktywność w przybliżeniu zipfowska (kilka osób składa dużo zgłoszeń);
- daty złożenia z 4 lat przed datą referencyjną; rok rejsu to zwykle rok następny;
- status zależny od roku rejsu: stare rejsy są w większości rozliczone, przyszłe w trakcie akceptacji;
- okres optymalny/dopuszczalny (80%) albo dokładne daty (20%);
- **bez rejsów**: kolumna „Data rejsu” jest pusta, co nie wpływa na porównanie.

Administrator nie widzi **cudzych wersji roboczych**: to reguła aplikacji, taka sama w obu wersjach.
Lista ma więc ok. 7–8% mniej wierszy niż N (np. 185 dla N = 200).

---

## 2. Uruchomienie aplikacji w trybie produkcyjnym

Oba warianty używają tych samych portów: backend `http://localhost:3000`, frontend `http://localhost:4173`.
Adres API jest wkompilowywany we frontend przy budowaniu i domyślnie wynosi `http://localhost:3000`.

### new (staging)

```powershell
git checkout staging
bun install

# backend (Release, Production)
dotnet publish backend/ResearchCruiseApp/ResearchCruiseApp.csproj -c Release -o "$env:TEMP\rca-new"
$env:ASPNETCORE_ENVIRONMENT = "Production"
$env:ASPNETCORE_URLS = "http://localhost:3000"
$env:FrontendUrl = "http://localhost:4173"
$env:SmtpSettings__UseFakeSmtp = "true"
$env:SmtpSettings__FakeSmtpDirectory = "$env:TEMP\rca-fake-emails"
dotnet "$env:TEMP\rca-new\ResearchCruiseApp.dll"
```

W drugim oknie PowerShell:

```powershell
cd frontend
bun run build
bun run preview --port 4173 --strictPort
```

### old (v2.5.1)

Zatrzymaj backend i frontend wersji `new`, potem:

```powershell
git checkout v2.5.1
pnpm install --frozen-lockfile

dotnet publish backend/ResearchCruiseApp/ResearchCruiseApp.csproj -c Release -o "$env:TEMP\rca-old"
$env:ASPNETCORE_ENVIRONMENT = "Production"
$env:ASPNETCORE_URLS = "http://localhost:3000"
$env:FrontendUrl = "http://localhost:4173"
dotnet "$env:TEMP\rca-old\ResearchCruiseApp.dll"
```

```powershell
cd frontend
pnpm run build
pnpm run preview --port 4173 --strictPort
```

Kontrola, czy wszystko działa: `http://localhost:4173/applications` po zalogowaniu pokazuje listę.

> Logowanie: obie wersje w konfiguracji produkcyjnej logują każde zapytanie SQL na konsolę (poziom `Information`),
> tak jak przy prawdziwym wdrożeniu. Jeśli chcesz to wyłączyć, ustaw **w obu wariantach** to samo, np.
> `$env:Logging__LogLevel__Default = "Warning"`, i opisz to w pracy.

---

## 3. Pomiary

Typowa procedura: dla każdego N zaseeduj dane, zmierz `new`, potem przełącz się na `old` i powtórz.
Seed trwa sekundy i jest deterministyczny, więc wygodniej jest zmierzyć **wszystkie N na jednym branchu**,
a potem przełączyć branch i powtórzyć te same N. Wyniki dopisują się do jednego CSV.

```powershell
cd perf
$variant = "new"   # po przełączeniu na v2.5.1: "old"
foreach ($n in 100, 1000, 3000, 10000, 20000) {
  node seed.mjs --n $n
  node measure-ui.mjs  --variant $variant --n $n
  node measure-api.mjs --variant $variant --n $n
}
```

Warianty ograniczania wydajności (każda kombinacja to osobny zestaw wierszy w CSV):

```powershell
node measure-ui.mjs --variant new --n 3000 --network fast4g
node measure-ui.mjs --variant new --n 3000 --network slow4g --cpu 4
node measure-ui.mjs --variant old --n 20000 --scenarios initial_load,filter_change --runs 10
```

Szacunkowy czas: każdy przebieg każdego scenariusza to świeży kontekst przeglądarki i pełne wejście na stronę,
czyli 5 scenariuszy × (30 + 3) przebiegów = 165 wczytań listy na jedno N.
Dla `old` przy dużym N jedno wczytanie trwa kilkadziesiąt sekund. Zmniejsz wtedy `--runs`
albo wybierz scenariusze przez `--scenarios`.

### Agregacja

```powershell
node aggregate.mjs                    # results/summary.csv, results/api-summary.csv, results/charts/
node aggregate.mjs --log-y true       # oś Y logarytmiczna: przy dużych N wartości new nie „przyklejają się” do zera
node aggregate.mjs --individual true  # dodatkowo osobny plik na każdy panel (pojedyncze rysunki do pracy)
```

`summary.csv` ma jeden wiersz na (variant, n, network, cpu, scenario, metryka):
`runs, ok, timeout, error, skipped, count, median, p95, std, mean, min, max`.
Statystyki liczone są tylko z przebiegów `status=ok`; liczby pozostałych statusów są w tych samych wierszach.
Wykresy (PNG i SVG; SVG można wstawić bezpośrednio do LaTeX-a):

- `charts/overview-<sieć>-cpu<CPU>`: jedna figura na konfigurację sieci i CPU, 9 paneli
  (pierwszy wiersz, TBT, sterta JS, węzły DOM, transfer API przy wejściu, przewinięcie do końca i jego transfer, filtr, sortowanie).
  Każdy panel to mediana old i new w funkcji N (oś X logarytmiczna), z wąsem do p95. Jednostka jest dobierana automatycznie (ms/s, kB/MB);
- `charts/api-overview`: 4 panele pomiaru API (czas całkowity, TTFB, rozmiar, rozmiar po gzip) dla
  `old: cała lista`, `new: 1. strona`, `new: ostatnia pełna strona`, `new: wszystkie strony`.

Linia trendu ma sens od 3 wartości N. Przy mniejszej liczbie N panele pokazują słupki old/new obok siebie dla każdego N.

---

## 4. Scenariusze i metryki (`results/results.csv`)

Kolumny stałe: `variant, n, network, cpu, scenario, run, timestamp, status (ok|timeout|error|skipped), timed_out, note`.

| scenariusz | co się dzieje | główna metryka (`duration_ms`) |
|---|---|---|
| `initial_load` | wejście na `/applications` | czas do ostatniej zmiany DOM listy po ostatniej odpowiedzi API (`list_ready_ms`) |
| `scroll_pages` | przewijanie, aż 60. wiersz znajdzie się w oknie (new: wymaga 3 stron; old: te same 60 wierszy) | czas od startu przewijania |
| `scroll_all` | przewijanie do samego końca listy (new: wczytuje wszystkie strony) | czas; przy przekroczeniu `SCROLL_ALL_TIMEOUT_MS` (5 min) `status=timeout`, `rows_reached` mówi, dokąd dotarło |
| `filter_change` | filtr „Rok rejsu” = 2025 | czas od kliknięcia do ustabilizowania listy (brak żądań w toku i brak zmian DOM przez 500 ms; liczy się moment ostatniej zmiany) |
| `sort_change` | sortowanie po kolumnie „Data” | jak wyżej |

Metryki:

- `first_row_ms`: pierwszy wiersz w DOM (MutationObserver wstrzyknięty przed skryptami aplikacji; `performance.now()` = ms od startu nawigacji);
- `fcp_ms`, `lcp_ms`: First / Largest Contentful Paint;
- `tbt_ms`, `long_tasks`: suma (czas − 50 ms) długich zadań w oknie scenariusza (dla `initial_load` od nawigacji do końca pomiaru, z 1 s odczekania na spóźnione zadania);
- `js_heap_used_bytes` oraz `…_after_gc_bytes`: CDP `Performance.getMetrics` przed i po wymuszonym GC;
- `dom_nodes`: żywe węzły DOM po GC (CDP); `dom_elements`: elementy podpięte do dokumentu;
- `api_requests`, `api_transfer_bytes` (nagłówki + ciało na łączu, `request.sizes()`), `api_body_bytes`, `api_items`: tylko żądania endpointu listy w oknie scenariusza;
- `total_requests`, `total_transfer_bytes`: wszystkie żądania w oknie scenariusza (dla `initial_load` także zasoby strony);
- `rows_rendered`: wiersze w DOM na końcu; `rows_reached`: ostatni wiersz, który znalazł się w oknie.

Uwagi do interpretacji:

- w `new` przy dojściu do 60. wiersza infinite scroll zwykle już **prefetchuje 4. stronę** (sentinel ma margines 200 px). To zachowanie aplikacji, widoczne w `api_requests`;
- w `old` scenariusze przewijania i filtrowania nie wysyłają żądań, bo wszystko jest już w pamięci; ich koszt to praca przeglądarki;
- `scroll_all` pokazuje, że paginacja **nie zmniejsza łącznej pracy**, tylko ją rozkłada w czasie. Porównaj sumę transferu i czas pełnego przeglądu z `initial_load` w `old`;
- jeśli w `old` dla `initial_load` widzisz `api_requests = 2`, to stara aplikacja pobiera listę dwukrotnie (zauważone przy próbnym przebiegu). To jej rzeczywisty koszt, ale warto o nim wspomnieć.

## 5. Pomiar API (`results/api-results.csv`)

| przypadek | wariant | znaczenie |
|---|---|---|
| `list_full` | old | cała lista jednym żądaniem |
| `page_first`, `page_middle`, `page_last` | new | pierwsza, środkowa i ostatnia **pełna** strona (domyślne sortowanie po numerze); ostatnia, krótsza strona jest pomijana, żeby nie zafałszować porównania |
| `filtered_first`, `filtered_last` | new | `year=2025&sortBy=date&descending=false`, pierwsza i ostatnia pełna strona |
| `all_pages` | new | przejście przez wszystkie strony (`--all-pages-runs`, domyślnie 5) = koszt odczytu całej listy |

Kolumny: `ttfb_ms` (otrzymanie nagłówków), `total_ms`, `bytes_raw`, `bytes_gzip`, `bytes_wire`, `content_encoding`, `items`, `requests`.
**Żaden backend nie kompresuje odpowiedzi** (`bytes_wire = bytes_raw`, puste `content_encoding`).
`bytes_gzip` to rozmiar po kompresji gzip (zlib, poziom 6) wyliczony lokalnie, czyli zysk, jaki dałoby włączenie kompresji.

### OFFSET czy kursor? Plan zapytania

`new` **nie używa OFFSET**. Paginacja jest typu keyset: kursor zawiera wartość sortowania i `Id` ostatniego elementu,
a zapytanie ma postać

```sql
SELECT TOP(@pageSize + 1) ... FROM CruiseApplications c ...
WHERE c.Number < @cursorNumber OR (c.Number = @cursorNumber AND c.Id < @cursorId)
ORDER BY c.Number DESC, c.Id DESC
```

Dla sortowania po numerze istnieje indeks `IX_CruiseApplications_Number_Id`, więc `page_last` nie powinna być wolniejsza niż `page_first`.
Dla sortowania po dacie albo roku i dla filtrów indeksu nie ma. Tam serwer może skanować i sortować przy każdej stronie,
co sprawdzają przypadki `filtered_first` i `filtered_last`.

SQL Server nie ma `EXPLAIN ANALYZE`. Odpowiednikiem jest **rzeczywisty plan wykonania**:

1. Treść zapytania: backend w konfiguracji produkcyjnej loguje każde polecenie EF Core (`Executed DbCommand …`) na konsolę.
   Wywołaj listę z filtrem i sortowaniem (np. przez `measure-api.mjs` albo w przeglądarce) i skopiuj SQL z logu.
   Parametry są zamaskowane jako `?`; wpisz wartości ręcznie (kursor to base64 JSON-a `{"SortValue":…,"Id":…}`).
2. Plan: w SSMS / Azure Data Studio włącz „Include Actual Execution Plan” (Ctrl+M) albo w `sqlcmd`:
   ```sql
   SET STATISTICS IO, TIME ON;
   SET STATISTICS XML ON;   -- rzeczywisty plan jako XML
   -- tu wklejone zapytanie
   ```
   ```powershell
   docker exec -it researchcruiseapp-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "<hasło z appsettings>" -C -d ResearchCruiseApp
   ```
   Interesujące są: `Index Seek` vs `Clustered Index Scan`, operator `Sort`, `logical reads` z `STATISTICS IO`.
3. Lista ładuje formularz A z wieloma kolekcjami (`Include`) w jednym zapytaniu bez `AsSplitQuery`.
   Zaseedowane formularze nie mają zadań, publikacji ani umów, więc złączenia zwracają po jednym wierszu na zgłoszenie.
   Przy prawdziwych danych zapytanie byłoby cięższe w obu wersjach.

---

## 6. Jak sprawdzić, czy masz te same wyniki

Czasy zależą od komputera, ale część wartości jest **deterministyczna** i powinna wyjść u Ciebie identycznie:

| N | sprawdzenie | oczekiwane |
|---|---|---|
| 200 | `node seed.mjs --n 200` → `Per cruise year:` | `2022=8, 2023=23, 2024=56, 2025=49, 2026=41, 2027=23` |
| 200 | wiersze widoczne dla admina (`old`: `rows_rendered` w `initial_load`; `new`: `rows_reached` w `scroll_all`) | 185 |
| 200 | `new`, `initial_load`: `api_items` / `api_body_bytes` | 20 / 15 007 B |
| 200 | `new`, `scroll_all`: `api_items` (bez pierwszej strony) / `api_body_bytes` | 165 / 123 295 B |
| 200 | `new`, `measure-api` `all_pages`: `items` / `requests` | 185 / 10 |
| 200 | `old`, `measure-api` `list_full`: `items` / `bytes_raw` | 185 / ok. 152 000 B |
| 3000 | `node seed.mjs --n 3000` → `Per cruise year:` | `2022=61, 2023=384, 2024=745, 2025=742, 2026=670, 2027=398` |
| 3000 | `old`, `filter_change`, `note` | `rows 2754->693` |

Identyfikatory, numery i treść zgłoszeń pochodzą z seeda, więc liczby wierszy i elementów muszą się zgadzać dokładnie,
a rozmiary ciał odpowiedzi praktycznie co do bajta. Rozbieżność oznacza zwykle, że w bazie są inne zgłoszenia
(seeder ostrzega: `WARNING: … non-perf applications exist`).

Orientacyjne czasy z maszyny deweloperskiej (WSL2, 12 wątków, bez throttlingu, pojedyncze przebiegi):

| wariant | N | first_row_ms | filter_change | sort_change |
|---|---|---|---|---|
| new | 200 | ok. 570 | ok. 70 | ok. 75 |
| old | 200 | ok. 1300 | ok. 20 | ok. 65 |
| old | 3000 | ok. 6800 | ok. 210 | ok. 1900 |

---

## 7. Parametry

Każdy parametr można podać jako flagę (`--runs 10`) albo zmienną środowiskową (`$env:RUNS = "10"`); flaga ma pierwszeństwo.
Pełna lista dla UI: `node measure-ui.mjs --help`.

| parametr | domyślnie | uwagi |
|---|---|---|
| `VARIANT` | wymagany | `old` / `new`; ustawia domyślne `AUTH_MODE`, `LOGIN_PATH`, `API_MATCH`, `API_LIST_PATH` |
| `N` | wymagany | etykieta w CSV; **nie seeduje** (to robi `seed.mjs`) |
| `BASE_URL`, `PAGE_PATH`, `API_URL` | `http://localhost:4173`, `/applications`, `http://localhost:3000` | |
| `ROW_SELECTOR` | `table tbody tr:not([aria-hidden]):not([role="presentation"])` | ten sam w obu wersjach (wyklucza wiersze-odstępy wirtualizacji i sentinel infinite scrolla) |
| `API_MATCH` | old: `/\/api\/CruiseApplications(\?\|$)/i`, new: `/\/v2\/applications(\?\|$)/i` | podciąg lub `/regex/` |
| `RUNS`, `WARMUP` | 30, 3 | pierwsze `WARMUP` przebiegów nie trafia do CSV |
| `NETWORK` | `none` | `fast4g` (9 Mb/s, 165 ms RTT), `slow4g` (1,6 Mb/s, 562,5 ms RTT): presety Chrome DevTools |
| `CPU` | 1 | `Emulation.setCPUThrottlingRate` |
| `SCENARIOS` | wszystkie 5 | lista po przecinku |
| `FILTER_COLUMN` / `FILTER_OPTION` | `Rok rejsu` / `2025` | |
| `SORT_COLUMN` / `SORT_OPTION` | `Data` / `/^Sortuj (rosnąco\|malejąco)$/` | pierwsza aktywna pozycja; w obu wersjach daje sortowanie rosnące |
| `SCROLL_TARGET_ROWS`, `SCROLL_STEP_PX`, `SCROLL_ALL_STEP_PX` | 60, 500, 2000 | przewinięcie o krok na każdą klatkę animacji |
| `SCROLL_ALL_TIMEOUT_MS`, `LOAD_TIMEOUT_MS`, `QUIET_MS`, `SETTLE_MS` | 300000, 180000, 500, 1000 | |
| `VIEWPORT` | `1920x1080` | poniżej 768 px aplikacja przełącza się na widok mobilny |
| `RESULTS`, `API_RESULTS` | `results/results.csv`, `results/api-results.csv` | |
| `PERF_EMAIL` / `PERF_PASSWORD` | `admin@gmail.com` / – | bez hasła skrypt czyta `CREDENTIALS_FILE` (domyślnie `../credentials.log`) |
| `DB_CONNECTION_STRING` | z `APPSETTINGS_FILE` (`../backend/ResearchCruiseApp/appsettings.Development.json`) | tylko `seed.mjs`; podaj jawnie, jeśli `perf/` leży poza repo |
| `SEED`, `MANAGERS`, `REFERENCE_DATE` | 42, 30, `2026-09-01` | tylko `seed.mjs` |

---

## 8. Metodyka (do adaptacji w pracy)

**Środowisko.** Backend (ASP.NET Core, build Release, środowisko Production), frontend (build produkcyjny Vite
serwowany przez `vite preview`) i baza SQL Server 2022 (kontener Docker) działają na tej samej maszynie co przeglądarka.
Wyklucza to wpływ sieci zewnętrznej, ale wszystkie procesy konkurują o te same zasoby.
Dlatego w czasie pomiarów inne aplikacje są zamknięte, a komputer zasilany z sieci.
Obie wersje korzystają z **tej samej bazy z identycznymi danymi**, wygenerowanymi deterministycznym seederem (stałe ziarno PRNG i stała data referencyjna),
dla N ∈ {100, 1000, 3000, 10 000, 20 000}.

**Narzędzie.** Pomiary wykonuje skrypt w Playwright sterujący Chromium w trybie headless (okno 1920×1080).
Metryki pochodzą z API przeglądarki (Performance Timeline: `largest-contentful-paint`, `longtask`, `paint`;
`MutationObserver` wstrzyknięty przed kodem aplikacji) oraz z protokołu Chrome DevTools
(`Performance.getMetrics`, `Network.emulateNetworkConditions`, `Emulation.setCPUThrottlingRate`).
Znaczniki czasu liczone są od startu nawigacji (`performance.now()`).

**Izolacja przebiegów.** Każdy przebieg każdego scenariusza odbywa się w nowym kontekście przeglądarki,
czyli z pustą pamięcią podręczną HTTP, pustym `localStorage` i bez ciasteczek.
Uwierzytelnienie przygotowywane jest raz, poza pomiarem: skrypt loguje się przez API, a sesję przekazuje do kontekstu.
W wersji old przez wpis w `localStorage`, w wersji new przez lokalną odpowiedź na żądanie odświeżenia tokenu,
bo refresh token jest rotowany przy każdym użyciu, a endpoint ma limit 10 żądań/min.
Pozostałe żądania, w tym pobranie listy, trafiają do prawdziwego backendu.

**Rozgrzewka i powtórzenia.** Pierwsze 3 przebiegi (rozgrzanie JIT .NET, puli połączeń, pamięci podręcznej bazy)
są odrzucane, potem wykonywanych jest 30 przebiegów. Scenariusze przeplatają się w ramach każdego przebiegu,
więc powolne zmiany warunków (temperatura, obciążenie tła) rozkładają się równo na wszystkie scenariusze.
Wyniki opisują mediana i 95. percentyl, które są odporne na pojedyncze odchylenia, oraz odchylenie standardowe.

**Ograniczanie zasobów.** Pomiary powtórzono bez ograniczeń oraz z emulacją sieci mobilnej
(„Fast 4G”: 9 Mb/s, RTT 165 ms; „Slow 4G”: 1,6 Mb/s, RTT 562,5 ms) i spowolnieniem CPU (×4),
aby przybliżyć warunki słabszych urządzeń.

**Kryterium końca operacji.** Operację (wczytanie, filtr, sortowanie) uznaje się za zakończoną,
gdy nie ma żądań do endpointu listy w toku i DOM listy nie zmienił się przez 500 ms.
Jako czas zakończenia przyjmowany jest moment ostatniej zmiany DOM, więc okno oczekiwania nie wlicza się do wyniku.
Przekroczenie limitu czasu jest zapisywane jako osobny status, a nie pomijane.

**Ograniczenia.** Wygenerowane formularze nie zawierają powiązanych kolekcji (zadań badawczych, publikacji, umów)
ani przypisanych rejsów, więc zapytania i odpowiedzi są lżejsze niż w produkcji.
Administrator nie widzi cudzych wersji roboczych, przez co lista ma mniej wierszy niż N.
Wersja new różni się od old nie tylko paginacją, ale też wirtualizacją renderowania wierszy.
Backend, baza i przeglądarka działają na jednym komputerze.
