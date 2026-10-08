# Kontekst do kontynuacji pracy (handoff)

Plik dla nowej sesji Claude Code na innym komputerze. Przeczytaj go w całości na
starcie, potem `README.md` i `METODYKA.md` w tym katalogu.

## O co chodzi

Praca inżynierska (Politechnika Gdańska, szablon `szablonPG`, LaTeX, po polsku)
o rozwoju ResearchCruiseApp. Rozdział „Zrealizowane prace” zawiera m.in. sekcje
o paginacji listy zgłoszeń i badaniu wydajności. Ten katalog `perf/` to
narzędzia i wyniki tego badania.

Porównanie listy zgłoszeń:

- **old** = tag `v2.5.1` (commit 7187a38d): legacy API `/api/CruiseApplications`,
  wszystko pobierane naraz, filtrowanie/sortowanie w przeglądarce, auth w localStorage;
- **new** = branch `staging`: paginacja kursorowa (keyset) `GET /v2/applications`
  + wirtualizacja wierszy (TanStack Virtual), filtrowanie/sortowanie po stronie serwera.

Ustalenia (2026-10-02): osobny seeder SQL w `perf/` (bez rejsów, 30 kierowników,
deterministyczny seed 42, data referencyjna 2026-09-01), filtr „Rok rejsu” = 2025,
sortowanie „Data”, **bez zmian w kodzie aplikacji**. N ∈ {100, 1000, 3000, 5000, 10000};
3 rozgrzewki + 30 pomiarów; old przy N = 10000 nie wyrenderował listy w limicie czasu.

## Stan

- Narzędzia gotowe: `seed.mjs`, `measure-ui.mjs`, `measure-api.mjs`, `aggregate.mjs`,
  `lib/`. Instrukcja uruchamiania (PowerShell) w `README.md`, metodyka w `METODYKA.md`.
- **Wyniki finalne (bez throttlingu, sieć none, CPU ×1): `results/final/`**
  - `key-metrics.md` / `.csv`: tabela kluczowych metryk old / new (mediany),
  - `summary.csv`, `api-summary.csv`: pełne statystyki,
  - `charts/`: wykresy PNG + SVG, `log-y/`: te same wykresy w skali logarytmicznej.
- Surowe pomiary: `results/results.csv`, `results/api-results.csv`; backupy:
  `results/raw-backup-*`, `results-backup-new/`; `results/dry-run/` to próbny przebieg.
- Szacowanie gzip zostało wyrzucone z pracy (tylko zdanie w „dalszych pracach”).

### Odłożone na później (decyzja użytkownika z 2026-10-06)

Seria z throttlingiem, obie wersje:
`--network slow4g --cpu 4 --runs 10 --scenarios initial_load,filter_change,sort_change`,
N = 1000 i 5000 (ok. 1 h łącznie z przełączaniem branchy). Agregacja z
`--key-network slow4g --key-cpu 4` dla tabeli kluczowych metryk.
**Pomiary uruchamia użytkownik sam.** Nie odpalaj pełnych kampanii pomiarowych
bez prośby, pomagaj w interpretacji i poprawkach narzędzi.

## Stan pisania pracy

Sekcje napisane wspólnie: Paginacja → Backend (keyset), Frontend: doczytywanie
stron, Frontend: wirtualizacja; Badanie wydajności → wstęp, metodyka, tabela
środowiska, dane testowe, scenariusze (+ lista metryk, testy API).

**Dalej:** Wyniki (wykres po wykresie, na podstawie `results/final/`), potem Wnioski.

Pliki `.tex` pracy **nie są w tym repo**, użytkownik wklei je albo przyniesie osobno.
Struktura: plik główny z `\input{rozdzialy/01_wstep.tex}` … `04_podsumowanie.tex`;
makro `\uwaga{…}` na notatki robocze; `secnumdepth=3`, `tocdepth=2`.

Ostatnia rozmowa (2026-10-06): wydzielenie sekcji „Paginacja listy zgłoszeń”
(i ewentualnie „Badanie wydajności”) do osobnych plików przez
`\input{rozdzialy/03_zrealizowane_prace/paginacja.tex}` (ścieżka względem pliku
głównego; `\input`, nie `\include`). Wskazany błąd struktury: pusty
`\subsection{Implementacja}` tuż przed `\subsection{Backend}`. Propozycja: usunąć
go i nazwać „Backend: paginacja kursorowa”, spójnie z „Frontend: …”.

## Preferencje użytkownika

- Rozmowa po polsku.
- **Recenzja szkiców pracy = tylko konkretne zmiany** („zamień X → Y”, „dopisz po
  zdaniu …: …”), krótko, w punktach. Nie odsyłaj całego poprawionego tekstu;
  użytkownik pisze sam i nie chce szukać różnic. Pisanie od zera nowej sekcji
  (na prośbę) w całości jest OK.
- Repo: Conventional Commits, zasady w `AGENTS.md` w katalogu głównym.

## Uruchomienie na nowym komputerze

```bash
git fetch origin && git switch thesis/perf-handoff
cd perf && npm ci && npx playwright install chromium
```

Hasło admina: `PERF_PASSWORD` albo `../credentials.log` (log seedowania kont,
nie jest w repo). Szczegóły w `README.md` §1–3.
