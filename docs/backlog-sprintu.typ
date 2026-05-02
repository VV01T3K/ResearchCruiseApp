#import "template.typ": template
#show: template.with("Scrum: Backlog sprintu", "1.0.0", datetime(day: 18, month: 4, year: 2026))

= 1. O projekcie i produkcie
- *Projekt:* Opracowanie systemu do zarządzania rejsami statku RV Oceanograf dla Biura Armatora Uniwersytetu Gdańskiego.
- *Produkt:* Aplikacja internetowa wspierająca organizację i obsługę rejsów statku należącego do Biura Armatora Uniwersytetu Gdańskiego. Narzędzie jest przeznaczone zarówno dla pracowników Biura Armatora, jak i kadry uczelni planującej rejsy badawcze. Umożliwia ono m.in. wypełnianie niezbędnych formularzy oraz koordynację harmonogramu rejsów.

= 2. Oszacowanie rozmiaru backlogu produktu
Oszacowanie backlogu produktu zostało przeprowadzone podczas sesji Planning Poker z udziałem całego zespołu.
W trakcie sesji zespół przeanalizował wszystkie istotne elementy backlogu. Każdy element został omówiony, a członkowie zespołu mieli możliwość zadawania pytań doprecyzowujących w celu lepszego zrozumienia zakresu prac. Szacowanie odbywało się przy użyciu Story Points zgodnych z ciągiem Fibonacciego (z opcją połówki). Po omówieniu zadania każdy członek zespołu wybierał swoją estymację.
W przypadku rozbieżności:

- następowała dyskusja zespołowa
- ewentualnie przeprowadzano ponowne głosowanie

#image("sprint-backlog/poker.png", width: 100%)

#pagebreak()

= 3. Założenia i dobór zakresu sprintu
 - *Nazwa Sprintu*: Rozwój formularzy i nowych kafelków
 - *Długość Sprintu*: 3 tygodnie
 - *Data Rozpoczęcia*: 22.04.2026
 - *Data Zakończenia*: 12.05.2026
 - *Zespół Deweloperski*: 4 osoby
 - *Pojemność Zespołu*: 4 osoby \* średnio 4h/tydzień \* 3 tygodnie = 48h
 - *Rezerwa na inne prace*: Zakładamy ~15-20% rezerwy na spotkania Scrumowe (Planowanie, Weekly, Review, Retrospektywa) oraz spotkania z klientem i  opiekunem projektu (8 h)
 - *Zakładana średnia szybkość zespołu*: Zakładamy, że średnia szybkość zespołu wyniesie 20 SP.
 - *Wybór elementów do Sprintu*: 
 - Raport wykorzystania urządzeń badawczych - 5 SP
 - Dodatkowa rola: Dziekanat - 2 SP
 - Weryfikacja pól w formularzach - 1 SP
 - Podpowiedzi w formularzach - 1 SP
 - Kafelek raportu wykorzystania statku - 8 SP
 - Nadpisywanie pól formularzy przez Biuro Armatora - 3 SP
= 4. Cel sprintu
Celem sprintu jest zaimplementowanie funkcjonalności:  nowego kafelka, raportu i poprawy elementów formularzy - wskazane przez Armatora.

= 5-6. Backlog sprintu i kryteria akceptacji
Link do backlogu: #link("https://github.com/VV01T3K/ResearchCruiseApp/issues")[`https://github.com/VV01T3K/ResearchCruiseApp/issues`]\
Piorytet reprezentowany jest przez pozycję od góry w tabeli sprintu (na górze najważniejsze, na dole najmniej)\
Lista elementów backlogu produktu:
#image("sprint-backlog/task1.png", width: 80%)
#image("sprint-backlog/task2.png", width: 80%)
#image("sprint-backlog/task3.png", width: 80%)
#image("sprint-backlog/task4.png", width: 80%)
#image("sprint-backlog/task5.png", width: 80%)
#image("sprint-backlog/task6.png", width: 80%)

#pagebreak()

Lista zadań:
#image("sprint-backlog/board.png", width: 100%)

= 7. Definicja ukończenia

Aby uznać element backlogu za ukończony, muszą zostać spełnione następujące warunki:
- Kod źródłowy powstały w wyniku realizacji zadania został umieszczony w repozytorium projektu.
- Jeśli możliwe, zostały napisane testy jednostkowe dla nowego kodu źródłowego.
- Uruchomiono wszystkie skonfigurowane w projekcie narzędzia odpowiedzialne za formatowanie oraz sprawdzanie poprawności kodu źródłowego (np. prettier, eslint, csharpier).
- Wszystkie poprzednio utworzone testy jednostkowe oraz testy integracyjne zakończyły się sukcesem.
- Kod został przejrzany oraz zaakceptowany przez przynajmniej jednego członka zespołu.
- Dokumentacja została zaktualizowana o zmiany wprowadzone w kodzie źródłowym.
- Zmiany zostały zmergowane do gałęzi staging.