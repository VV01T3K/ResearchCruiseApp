# Metodyka pomiarów – szczegółowy opis

Dokument opisuje dokładnie, co i jak mierzono, na podstawie kodu skryptów w `perf/`
(`seed.mjs`, `measure-ui.mjs`, `measure-api.mjs`, `aggregate.mjs`, `lib/`).
Jest materiałem źródłowym do rozdziału pracy: można z niego wybierać i skracać.
Liczby w przykładach pochodzą z `results/final/`.

---

## 1. Przedmiot porównania

| | **old** | **new** |
|---|---|---|
| wersja | tag `v2.5.1` | branch `staging` |
| pobieranie danych | jedno żądanie `GET /api/CruiseApplications` zwraca **wszystkie** widoczne zgłoszenia | `GET /v2/applications?pageSize=20&cursor=…` zwraca stronę 20 zgłoszeń; kolejne strony doczytywane, gdy użytkownik zbliży się do końca listy (*infinite scroll*) |
| paginacja | brak | kursorowa (*keyset*): kursor = wartość sortowania + `Id` ostatniego elementu; zapytanie `WHERE (Number < @n OR (Number = @n AND Id < @id)) ORDER BY Number DESC, Id DESC` z `TOP(21)`, bez `OFFSET` |
| filtrowanie i sortowanie | w przeglądarce (TanStack Table) na danych w pamięci | na serwerze (parametry zapytania), wynik od pierwszej strony |
| renderowanie wierszy | wszystkie wiersze w DOM | **wirtualizacja** (TanStack Virtual): w DOM tylko wiersze widoczne w oknie + 5 zapasowych |

Wersja new różni się od old **dwiema** technikami naraz: paginacją (mniej danych) i wirtualizacją
(mniej elementów DOM). Pomiary pokazują ich łączny efekt.
Część metryk pozwala jednak przypisać efekt jednej z nich (np. liczba węzłów DOM po przewinięciu
całej listy w new pozostaje stała mimo wczytania wszystkich danych – to zasługa wirtualizacji).

Zaobserwowane cechy wersji old, istotne dla interpretacji:
- od N ≈ 3000 lista jest przy wejściu pobierana **dwukrotnie** (dwa identyczne żądania), co podwaja transfer i obciążenie serwera;
- przy N = 10 000 lista nie wyświetliła się w żadnej z prób (rozdz. 8).

---

## 2. Środowisko pomiarowe

Wszystkie komponenty działały na jednym komputerze, więc pomiary nie zawierają opóźnień sieci zewnętrznej.

| element | wartość |
|---|---|
| procesor | AMD Ryzen 5 9600X (6 rdzeni / 12 wątków) |
| pamięć | DDR5 6000 MT/s CL30; maszyna wirtualna WSL2: 15 GB RAM, 12 vCPU |
| system | Windows (host) → WSL2 (jądro 6.18) → kontener deweloperski (Linux) |
| baza danych | Microsoft SQL Server 2022 (RTM-CU27, 16.0.4295.3), kontener Docker |
| backend | ASP.NET Core, .NET SDK 10.0.401, `dotnet publish -c Release`, środowisko `Production`, Kestrel na `http://localhost:3000` |
| frontend | build produkcyjny Vite (`build`), serwowany przez `vite preview` na `http://localhost:4173` |
| przeglądarka | Chromium 153.0.8010.12 (dostarczony z Playwright 1.63.0), tryb *headless* |
| narzędzia pomiarowe | Node.js 24.21, Playwright 1.63.0 |

Uwagi:
- Obie wersje uruchamiano z tymi samymi ustawieniami portów i z **tej samej bazy danych**
  (schemat staging; v2.5.1 działa na nim bez zmian – różnica to jeden indeks i dwie niezwiązane tabele).
- Backend w obu wersjach loguje każde polecenie SQL na konsolę (domyślna konfiguracja produkcyjna, poziom `Information`).
- Żaden z serwerów nie kompresuje odpowiedzi (brak `Content-Encoding`).
- W trakcie pomiarów komputer nie był używany do innych zadań, usypianie było wyłączone.
- Pomiary wykonano bez ograniczania sieci i CPU (`NETWORK=none`, `CPU=1`).

---

## 3. Dane testowe

Dane generuje `seed.mjs` bezpośrednio w bazie SQL (niezależnie od wersji aplikacji),
zastępując poprzednie dane testowe. Generator jest **deterministyczny**:
każde zgłoszenie *i* powstaje z własnego generatora liczb pseudolosowych (mulberry32) zainicjowanego
wartością wyliczoną z (ziarno = 42, *i*), a daty liczone są od stałej daty referencyjnej 2026-09-01.
Dla danego N dane są więc identyczne przy każdym uruchomieniu i w obu wersjach,
a zbiór dla mniejszego N jest podzbiorem zbioru dla większego.

Rozkład danych:
- **30 kierowników** (stała liczba, jak w rzeczywistości), z aktywnością zbliżoną do rozkładu Zipfa
  (waga *k*-tego kierownika ∝ 1/k^0,8): kilka osób składa wiele zgłoszeń, większość – nieliczne;
- data złożenia: losowo z 4 lat przed datą referencyjną; rok rejsu: rok złożenia + 1 (75%) lub ten sam;
- status zależny od roku rejsu względem daty referencyjnej (rejsy przeszłe w większości rozliczone,
  przyszłe – w trakcie akceptacji), z wagami podanymi w `seed.mjs`;
- okres rejsu: przedział optymalny i dopuszczalny (80%) albo dokładne daty (20%); długość 1–30 dni;
- numery zgłoszeń rosną zgodnie z datą złożenia (kolumna `IDENTITY`);
- brak przypisanych rejsów oraz pustych kolekcji formularza A (zadania, publikacje, umowy) – patrz ograniczenia.

Mierzono N ∈ {100, 1000, 3000, 5000, 10 000}.
Użytkownik pomiarowy (administrator) **nie widzi cudzych wersji roboczych** – reguła aplikacji, identyczna w obu wersjach –
dlatego lista zawiera mniej wierszy niż N:

| N | 100 | 1000 | 3000 | 5000 | 10 000 |
|---|---:|---:|---:|---:|---:|
| widoczne wiersze | 94 | 916 | 2754 | 4601 | 9189 |

---

## 4. Uwierzytelnianie (poza pomiarem)

Logowanie odbywa się **raz, przed pomiarami**, przez API (`POST /account/login` w old, `POST /v2/auth/login` w new)
danymi konta administratora utworzonego przez seed aplikacji. Sesja jest przekazywana do każdego nowego kontekstu przeglądarki:

- **old**: skrypt startowy (`addInitScript`) zapisuje tokeny w `localStorage['authDetails']` przed uruchomieniem aplikacji
  – dokładnie tak, jak robi to sama aplikacja po zalogowaniu;
- **new**: aplikacja przy starcie wywołuje `POST /v2/auth/refresh` (refresh token w ciasteczku HttpOnly).
  Ponieważ refresh token jest rotowany przy każdym użyciu, a endpoint ma limit 10 żądań/min,
  to jedno żądanie jest obsługiwane lokalnie przez Playwright (`context.route`) odpowiedzią z tokenem uzyskanym przy logowaniu.
  Wszystkie pozostałe żądania (`/v2/users/me`, lista, kierownicy) trafiają do prawdziwego backendu.

Skutek dla pomiaru: w new jedno żądanie startowe (refresh) ma czas bliski zeru, w old analogicznego żądania nie ma.
Token jest odnawiany przez ponowne logowanie, gdy do jego wygaśnięcia zostaje < 5 min.

---

## 5. Pomiary w przeglądarce (`measure-ui.mjs`)

### 5.1. Izolacja i powtórzenia

- Jedna instancja Chromium na całe uruchomienie skryptu; **każde wykonanie każdego scenariusza** odbywa się
  w **nowym kontekście przeglądarki** (odpowiednik nowego profilu incognito): pusta pamięć podręczna HTTP,
  puste `localStorage`, brak ciasteczek, nowa strona. Kontekst jest zamykany po scenariuszu.
- Rozmiar okna: 1920×1080 (poniżej 768 px aplikacja przełącza się na widok mobilny).
- Dla każdej strony tworzona jest sesja protokołu Chrome DevTools (CDP) z włączonymi domenami `Performance` i `Network`.
- **Kolejność**: pętla zewnętrzna po przebiegach, wewnętrzna po scenariuszach
  (przebieg 1: initial_load, scroll_pages, scroll_all, filter_change, sort_change; przebieg 2: …).
  Powolne zmiany warunków (temperatura, procesy w tle) rozkładają się dzięki temu równo na wszystkie scenariusze.
- **Rozgrzewka**: pierwsze 3 przebiegi (wszystkie scenariusze) są wykonywane, ale **nie zapisywane** –
  niezależnie od wyniku (nie jest to odrzucanie najgorszych wyników). Usuwa to wpływ „zimnego startu”:
  kompilacji JIT w .NET, pustej pamięci podręcznej bazy i pul połączeń.
- Następnie **30 przebiegów pomiarowych**; każdy wynik zapisywany jest jako osobny wiersz CSV.

### 5.2. Instrumentacja strony

Przed załadowaniem jakiegokolwiek skryptu aplikacji (Playwright `addInitScript`) w stronie uruchamiany jest kod, który:

1. rejestruje `PerformanceObserver` (z `buffered: true`) dla typów:
   - `longtask` – zapisuje początek i czas trwania każdego zadania wątku głównego dłuższego niż 50 ms,
   - `largest-contentful-paint` – zapisuje czas ostatniego zgłoszonego kandydata LCP,
   - `paint` – zapisuje czas `first-contentful-paint`;
2. rejestruje `MutationObserver` na całym dokumencie (zmiany drzewa i tekstu), który:
   - zapisuje moment, w którym w DOM **po raz pierwszy** pojawia się element pasujący do selektora wiersza,
   - przy każdej zmianie wewnątrz kontenera listy (`table tbody`) zapisuje znacznik „ostatniej zmiany listy”.

Wszystkie znaczniki czasu to `performance.now()`, czyli **milisekundy od startu nawigacji** dokumentu.

Selektor wiersza (wspólny dla obu wersji): `table tbody tr:not([aria-hidden]):not([role="presentation"])` –
wyklucza wiersze-odstępy wirtualizacji i wiersz z wyzwalaczem doczytywania w new.

### 5.3. Ruch sieciowy

Skrypt nasłuchuje zdarzeń Playwright `request`, `requestfinished` i `requestfailed`:
- **żądania listy** rozpoznawane są po adresie (old: `/api/CruiseApplications` bez dalszej ścieżki;
  new: `/v2/applications` bez dalszej ścieżki – np. `/v2/applications/managers` nie jest liczone);
- dla każdego zakończonego żądania: rozmiar przesłany = `request.sizes()` → `responseBodySize + responseHeadersSize`
  (bajty na łączu, z nagłówkami);
- dla żądań listy dodatkowo: rozmiar ciała po zdekodowaniu, liczba elementów w odpowiedzi
  (długość tablicy w old, długość `items` w new) oraz informacja, czy odpowiedź zapowiada kolejną stronę (`nextCursor`);
- licznik żądań listy „w toku” służy do wykrywania końca operacji.

Metryki sieciowe scenariusza to **różnica** liczników między początkiem a końcem okna pomiaru scenariusza.

### 5.4. Kryterium „lista ustabilizowana”

Operację uznaje się za zakończoną, gdy jednocześnie:
1. nie ma żadnego żądania listy w toku,
2. od ostatniego zdarzenia sieciowego dotyczącego listy minęło ≥ 500 ms,
3. od ostatniej zmiany DOM w kontenerze listy minęło ≥ 500 ms,
4. (dla filtra/sortowania) nastąpiła co najmniej jedna zmiana listy **po** wykonaniu akcji.

Stan sprawdzany jest co 50 ms. **Czasem zakończenia jest moment ostatniej zmiany DOM listy**, a nie moment
spełnienia warunku – 500-milisekundowe okno ciszy nie jest wliczane do wyniku.

### 5.5. Scenariusze

Każdy scenariusz (poza `initial_load`) zaczyna się od wejścia na stronę i odczekania na ustabilizowanie listy (5.4);
ta część **nie jest mierzona**. Pomiar obejmuje wyłącznie samą czynność.

#### `initial_load` – wejście na listę
1. Nawigacja na `/applications` (oczekiwanie tylko na rozpoczęcie ładowania dokumentu, `waitUntil: 'commit'`).
2. Oczekiwanie na pierwszy wiersz w DOM (limit 180 s), potem na ustabilizowanie listy.
3. Dodatkowe odczekanie 1 s na spóźnione wpisy `longtask` i LCP.
4. Odczyt metryk.

Okno pomiaru obejmuje wszystko od startu nawigacji: pobranie HTML i skryptów aplikacji, jej uruchomienie,
żądania uwierzytelniające i profilu, pobranie listy i jej wyrenderowanie.

#### `scroll_pages` – przewinięcie do 60. wiersza
Przewijanie okna o 500 px w krokach; po każdym kroku skrypt czeka na dwie klatki animacji
(`requestAnimationFrame` ×2), po czym sprawdza stan. Koniec: **dolna krawędź 60. wiersza listy znajduje się w oknie**
(indeks wiersza: atrybut `data-index` w new, pozycja w DOM w old). W new wymaga to doczytania kolejnych stron
(praktycznie aplikacja doczytuje wtedy już stronę 4. – wyzwalacz ma margines 200 px).
Czas = od rozpoczęcia przewijania do kroku, w którym warunek został spełniony.

#### `scroll_all` – przewinięcie do końca listy (pełny przegląd)
Jak wyżej, krok 2000 px. Koniec, gdy jednocześnie: okno jest na samym dole dokumentu, żadne żądanie listy nie
jest w toku, przez 2 × 500 ms nic się nie zmieniło **i** ostatnia odpowiedź API potwierdza, że kolejnych stron nie ma
(new: brak `nextCursor`; old: cała lista w jednej odpowiedzi).
Czas = od rozpoczęcia przewijania do ostatniego kroku, który przesunął widok lub wydłużył dokument.
Limit: 300 s.
Jeśli w new doczytywanie zatrzyma się mimo niepełnej listy, skrypt przewija o jeden ekran w górę i ponownie w dół
(jak użytkownik); liczba takich zdarzeń zapisywana jest w kolumnie `note` (`stalls=N`).

Scenariusz pokazuje koszt **pełnego** przeglądu listy: w new paginacja nie zmniejsza łącznej pracy, tylko ją rozkłada.

#### `filter_change` – zmiana filtra
Kliknięcie nagłówka kolumny „Rok rejsu” (otwarcie menu – poza pomiarem), odczekanie, aż pozycja menu „2025”
stanie się aktywna, a następnie **w jednym zadaniu JavaScript strony**: zapis znacznika czasu i `click()` na pozycji.
Czas = od kliknięcia do ostatniej zmiany DOM listy (kryterium 5.4).
W old filtr działa na danych w pamięci; w new wywołuje zapytanie do serwera i podmienia listę na pierwszą stronę wyniku.

#### `sort_change` – zmiana sortowania
Jak wyżej, dla kolumny „Data”; klikana jest pierwsza aktywna pozycja „Sortuj rosnąco/malejąco”
(w obu wersjach daje to sortowanie rosnące po dacie złożenia).

### 5.6. Metryki (kolumny `results/results.csv`)

| kolumna | definicja | źródło | scenariusze |
|---|---|---|---|
| `duration_ms` | czas trwania czynności (patrz 5.5); w `initial_load` równy `list_ready_ms` | znaczniki `performance.now()` | wszystkie |
| `first_row_ms` | od startu nawigacji do **wstawienia** pierwszego wiersza do DOM | MutationObserver | initial_load |
| `list_ready_ms` | od startu nawigacji do ostatniej zmiany DOM listy (lista kompletna i stabilna) | MutationObserver | initial_load |
| `fcp_ms` | First Contentful Paint | PerformanceObserver `paint` | initial_load |
| `lcp_ms` | Largest Contentful Paint (ostatni kandydat) | PerformanceObserver `largest-contentful-paint` | initial_load |
| `tbt_ms` | suma (czas − 50 ms) długich zadań (> 50 ms) rozpoczętych w oknie scenariusza | PerformanceObserver `longtask` | wszystkie |
| `long_tasks` | liczba długich zadań w oknie scenariusza | jw. | wszystkie |
| `js_heap_used_bytes` | zajęta sterta JavaScript na końcu scenariusza | CDP `Performance.getMetrics` → `JSHeapUsedSize` | wszystkie |
| `js_heap_used_after_gc_bytes` | jw. po wymuszonym odśmiecaniu (`HeapProfiler.collectGarbage`) | CDP | wszystkie |
| `dom_nodes` | liczba żywych węzłów DOM (z tekstowymi) po odśmiecaniu | CDP → `Nodes` | wszystkie |
| `dom_elements` | liczba elementów podpiętych do dokumentu | `document.getElementsByTagName('*').length` | wszystkie |
| `api_requests` | liczba żądań listy w oknie scenariusza | zdarzenia sieciowe | wszystkie |
| `api_transfer_bytes` | bajty odpowiedzi listy na łączu (ciało + nagłówki) | `request.sizes()` | wszystkie |
| `api_body_bytes` | bajty ciała odpowiedzi listy po zdekodowaniu | `response.body()` | wszystkie |
| `api_items` | liczba zgłoszeń w odpowiedziach listy | parsowanie JSON | wszystkie |
| `total_requests`, `total_transfer_bytes` | wszystkie żądania w oknie (w initial_load także HTML, JS, CSS, obrazy) | zdarzenia sieciowe | wszystkie |
| `rows_rendered` | liczba wierszy w DOM na końcu | selektor wiersza | wszystkie |
| `rows_reached` | numer ostatniego wiersza, którego dolna krawędź znalazła się w oknie | pozycje elementów | scroll_* |
| `status` | `ok` / `timeout` / `error` (wyjątek, np. przekroczony limit oczekiwania) / `skipped` | – | – |
| `note` | dodatkowe informacje (np. `rows 2754->693`, `stalls=N`, treść błędu) | – | – |

Okno scenariusza dla TBT/long tasks: `initial_load` – od nawigacji do momentu odczytu (po 1 s odczekania);
przewijanie – od startu przewijania do jego końca; filtr/sortowanie – od kliknięcia do ostatniej zmiany listy.

---

## 6. Pomiary API (`measure-api.mjs`)

Bezpośrednie żądania HTTP do endpointu listy, **bez przeglądarki** (moduł `http` Node.js), z nagłówkiem
`Authorization: Bearer <token>` i `Accept-Encoding: gzip, deflate, br`.
Jedno połączenie *keep-alive* używane dla wszystkich żądań (bez kosztu zestawiania TCP).
Żądania wysyłane są **sekwencyjnie**, nigdy równolegle.

### Przypadki

| przypadek | wersja | żądanie |
|---|---|---|
| `list_full` | old | `GET /api/CruiseApplications` – cała lista |
| `page_first` | new | pierwsza strona, sortowanie domyślne (numer malejąco), `pageSize=20` |
| `page_middle` | new | strona ze środka listy (kursor zebrany wcześniej) |
| `page_last` | new | **ostatnia pełna** strona (ostatnia, krótsza strona jest pomijana, by nie zaniżać czasu) |
| `filtered_first`, `filtered_last` | new | `year=2025&sortBy=date&descending=false` – pierwsza i ostatnia pełna strona |
| `all_pages` | new | przejście przez **wszystkie** strony po kolei (kolejny kursor z odpowiedzi) – koszt odczytu całej listy |

W new przed pomiarem skrypt jednokrotnie przechodzi przez wszystkie strony, aby zebrać kursory stron głębokich.

### Przebieg

3 przebiegi rozgrzewkowe (niezapisywane) + 30 pomiarowych; w każdym przebiegu przypadki wykonywane są po kolei
(przeplatanie jak w 5.1). `all_pages` wykonywany jest 5 razy, po zakończeniu pozostałych pomiarów (backend jest już rozgrzany).

### Metryki (kolumny `results/api-results.csv`)

| kolumna | definicja |
|---|---|
| `ttfb_ms` | od wysłania żądania do otrzymania **nagłówków** odpowiedzi (zegar `process.hrtime`) |
| `total_ms` | od wysłania żądania do odebrania ostatniego bajtu ciała |
| `bytes_raw` | rozmiar ciała odpowiedzi (JSON) |
| `bytes_gzip` | rozmiar ciała po kompresji gzip (zlib, poziom 6) wyliczony lokalnie – serwer nie kompresuje, więc to szacunek zysku z włączenia kompresji |
| `bytes_wire` | bajty ciała faktycznie odebrane (bez kompresji = `bytes_raw`) |
| `items`, `requests` | liczba zgłoszeń, liczba żądań (1, a w `all_pages` liczba stron) |

W `all_pages`: `total_ms` = czas całego przejścia, `ttfb_ms` = suma TTFB stron, rozmiary = sumy.

Ponieważ serwer składa całą odpowiedź przed wysłaniem nagłówków, `ttfb_ms ≈ total_ms`
(np. old, N = 10 000: 18 952 vs 18 963 ms) – czas to praktycznie wyłącznie praca serwera.

---

## 7. Agregacja i statystyka (`aggregate.mjs`)

- Grupy: (wersja, N, sieć, CPU, scenariusz) dla UI; (wersja, N, przypadek) dla API.
- Do statystyk wchodzą tylko przebiegi ze statusem `ok` (UI) lub HTTP 200 (API). Liczby pozostałych statusów
  są podawane w `summary.csv`.
- Dodatkowo jako `incomplete` (niewliczane) oznaczane są przebiegi, które nie osiągnęły celu mimo statusu `ok`:
  `scroll_all`, który dotarł do mniejszej liczby wierszy niż pozostałe przebiegi grupy, oraz każdy scenariusz
  zakończony bez żadnego wiersza w DOM. Surowe dane nie są modyfikowane.
- Statystyki: **mediana** i **95. percentyl** (kwantyl z interpolacją liniową między sąsiednimi wartościami
  posortowanej próby, pozycja = (n − 1)·q), **odchylenie standardowe próby** (mianownik n − 1),
  średnia, minimum, maksimum.
- Głównym miernikiem jest mediana (odporna na pojedyncze zakłócenia); p95 opisuje przypadki najgorsze.

---

## 8. Zdarzenia nietypowe w pomiarach

- **old, N = 10 000**: w żadnej próbie lista się nie wyświetliła – 5 prób z limitem 180 s i 2 próby z limitem 600 s
  (status `error`). Po nadejściu odpowiedzi (ok. 19 s) wątek główny strony był stale zajęty (100% CPU),
  liczba tworzonych węzłów DOM oscylowała między ok. 0,7 a 2,5 mln, a sterta JS między 1 a 2,6 GB,
  bez wyświetlenia wyniku. W zwykłej przeglądarce (Brave, ten sam komputer) lista pojawiła się raz po ok. 30 s,
  raz po ponad 100 s, przy ok. 4 GB pamięci karty. Endpoint API dla N = 10 000 działał poprawnie (ok. 19 s).
- **new, `scroll_all`**: w 4 z 60 przewinięć dużych list (po 30 dla N = 5000 i N = 10 000; przy mniejszych N – 0 z 90) doczytywanie kolejnych stron
  zatrzymało się przed końcem listy (w jednym przypadku nie wznowiło się mimo 479 przewinięć w górę i w dół przez 4 min).
  Przebiegi te nie są wliczane do statystyk (`incomplete`/`timeout`); wskazuje to na błąd mechanizmu doczytywania.

---

## 9. Ograniczenia i zastrzeżenia

1. **`first_row_ms` mierzy wstawienie do DOM, nie wyświetlenie.** Callback MutationObserver wykonuje się przed
   malowaniem klatki; faktyczne pojawienie się na ekranie następuje nieco później (zwykle o jedną klatkę).
2. **LCP nie opisuje listy.** Przeglądarka uznaje za największy element tło lub pasek nawigacji, które pojawiają się
   przed listą; w old przy N = 3000/5000 LCP (ok. 0,47 s) jest *mniejsze* niż czas do pierwszego wiersza (6,8/11,1 s).
3. **TBT ma zmodyfikowaną definicję**: suma nadwyżek ponad 50 ms dla wszystkich długich zadań w oknie scenariusza,
   a nie – jak w Lighthouse – tylko między FCP a Time to Interactive.
4. **Przewijanie jest syntetyczne**: stały krok co dwie klatki plus narzut komunikacji Playwright ↔ przeglądarka
   (kilka ms na krok). Czasy przewijania należy porównywać między wersjami, a nie traktować jako czas użytkownika.
5. **Różnica uwierzytelniania** (rozdz. 4): w new żądanie odświeżenia sesji obsługiwane lokalnie.
6. **Różny rozmiar zasobów aplikacji**: wejście na stronę w old pobiera ok. 3,1 MB zasobów (bez listy), w new ok. 0,86 MB –
   przy małych N wpływa to na czasy wejścia niezależnie od paginacji.
7. **Wszystko na jednym komputerze**: przeglądarka, backend i baza współdzielą CPU i pamięć; brak opóźnień sieci.
8. **Dane uproszczone**: brak powiązanych kolekcji formularza A i rejsów – zapytania i odpowiedzi są lżejsze niż w produkcji
   (dotyczy obu wersji).
9. **Brak kompresji HTTP** w obu wersjach; `bytes_gzip` to wartość wyliczona.
10. **Wyniki bez ograniczania sieci i CPU** – warunki najkorzystniejsze dla old (duże odpowiedzi przesyłane lokalnie).

---

## 10. Które metryki zostawić w pracy

**Rdzeń (polecane):**

| metryka | co pokazuje |
|---|---|
| `first_row_ms` (lub `list_ready_ms`) w initial_load | czas oczekiwania użytkownika na listę |
| `tbt_ms` w initial_load | jak długo strona nie reaguje na działania użytkownika |
| `js_heap_used_bytes`, `dom_nodes` w initial_load | koszt pamięci i rozmiar DOM (efekt wirtualizacji) |
| `api_transfer_bytes` w initial_load | ilość danych pobieranych na starcie |
| `duration_ms` filter_change / sort_change | responsywność filtrowania i sortowania |
| `duration_ms` i `api_transfer_bytes` w scroll_all | łączny koszt pełnego przeglądu („paginacja rozkłada pracę”) |
| API: `total_ms` (list_full, page_first, page_last, all_pages) i `bytes_raw` | koszt po stronie serwera, stały czas strony niezależnie od głębokości |

**Do pominięcia lub jednego zdania:**

| metryka | powód |
|---|---|
| `fcp_ms`, `lcp_ms` | dotyczą „ramy” aplikacji, nie listy (pkt 9.2); FCP prawie stałe |
| `list_ready_ms` *lub* `first_row_ms` | w new identyczne; w old różnią się o czas dorenderowania – wystarczy jedna |
| `dom_elements` | prawie proporcjonalne do `dom_nodes` |
| `js_heap_used_after_gc_bytes` | wnioski takie same jak dla sterty przed GC |
| `long_tasks` | informacja zawarta w TBT |
| `api_body_bytes`, `api_items` | `api_transfer_bytes` wystarcza; `api_items` służy głównie do kontroli poprawności |
| `total_requests`, `total_transfer_bytes` | zawierają zasoby aplikacji (pkt 9.6), zaciemniają efekt listy |
| `scroll_pages` | podobny w obu wersjach (ok. 0,8–0,9 s); może posłużyć jako przykład, że przy przeglądaniu początku listy różnica jest niewielka |
| API: `ttfb_ms` | ≈ `total_ms` (rozdz. 6) |
| API: `bytes_wire` | = `bytes_raw` (brak kompresji) |
| API: `page_middle`, `filtered_*` | potwierdzają wnioski z `page_first`/`page_last`; jedno zdanie wystarczy |
