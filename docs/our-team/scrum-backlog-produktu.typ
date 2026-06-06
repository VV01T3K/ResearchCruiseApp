#import "template.typ": template
#show: template.with("Scrum: Backlog produktu", "1.0.0", datetime(day: 29, month: 3, year: 2026))

= 1. O projekcie i produkcie
- *Projekt:* Opracowanie systemu do zarządzania rejsami statku RV Oceanograf dla Biura Armatora Uniwersytetu Gdańskiego.
- *Produkt:* Aplikacja internetowa wspierająca organizację i obsługę rejsów statku należącego do Biura Armatora Uniwersytetu Gdańskiego. Narzędzie jest przeznaczone zarówno dla pracowników Biura Armatora, jak i kadry uczelni planującej rejsy badawcze. Umożliwia ono m.in. wypełnianie niezbędnych formularzy oraz koordynację harmonogramu rejsów.

= 2. Persony użytkowników

- *Persona 1: Kierownik Naukowy* - pracownik Uniwersytetu Gdańskiego odpowiedzialny za przygotowanie i organizację rejsu badawczego dla interesariuszy. W systemie uzupełnia wszystkie wymagane formularze, które następnie trafiają do Biura Armatora. Jest także osobą kontaktową dla studentów zainteresowanych udziałem w rejsie w celach naukowych (np. realizacja prac inżynierskich, magisterskich czy doktorskich).
- Imię i nazwisko: Katarzyna Kowalska
- Wiek: 60 lat
- Wykształcenie: wyższe
- Stanowisko: Kierownik Katedry na wydziale Oceanografii Uniwersytetu Gdańskiego
- Stan cywilny, rodzinny: mężatka, 2 dzieci
- Zainteresowania: podróże, żeglarstwo
- zaawansowanie w korzystaniu z IT: umiarkowane
- Problemy: 
  - czasochłonne wypełnianie formularzy
  - obawy o bezpieczeństwo (ryzyko podszycia się pod użytkownika)
  - lęk przed zbyt skomplikowanym interfejsem
- Potrzeby: 
  - prosty i intuicyjny interfejs
  - możliwość wypełnienia formularzy w aplikacji i przesłania ich do Biura Armatora

- *Persona 2: Armator* - pracownik Biura Armatora Uniwersytetu Gdańskiego odpowiedzialny za zarządzanie rejsami statku. Korzysta z aplikacji, aby dodawać nowe rejsy, modyfikować istniejące oraz przeglądać wszystkie zaplanowane wyprawy.
- Imię i nazwisko: Piotr Nowak
- Wiek: 35 lat
- Wykształcenie: wyższe
- Stanowisko: Pracownik biura Armatora Uniwersytetu Gdańskiego
- Stan cywilny, rodzinny: żonaty, 1 dziecko
- Zainteresowania: kolarstwo, wyścigi samochodowe 
- Zaawansowanie w korzystaniu z IT: średnio zaawansowane
- Problemy: 
  - brak scentralizowanego systemu do zarządzania rejsami
  - trudności w przeszukiwaniu i edytowaniu danych o rejsach
- Potrzeby:
  - szybki w obsłudze interfejs
  - możliwość dodawania nowych rejsów oraz edytowania istniejących
  - wygodny dostęp do harmonogramu rejsu 
  - możliwość przeszukiwania rejsów według różnych kryteriów (np. daty, celu rejsu, liczby uczestników)
  
= 3. Scenariusze użycia produktu

- *Scenariusz 1.* Proces planowania, realizacji i rozliczenia rejsu z perspektywy kierownika naukowego.

  Kierownik naukowy po uzyskaniu zgody przełożonego (poza systemem) zgłasza chęć odbycia rejsu w następnym roku kalendarzowym wypełniając formularz A. W zgłoszeniu podaje informacje dotyczące:
  - kierownika rejsu i jego zastępcy 
  - terminu rejsu, czasu wykorzystania statku
  - pozwoleń na przeprowadzenie badań
  - rejonu prowadzenia badań
  - celu rejsu
  - uczestników rejsu
  - umów, zadań i powiązanych z tematyką rejsu publikacji
  
  Pod koniec roku kalendarzowego odbywa się spotkanie z udziałem wnioskodawców, przedstawicieli Biura Armatora oraz członków Zespołu ds. Rozwoju Jednostki Naukowo-Badawczej R/V Oceanograf, podczas którego wprowadzane są korekty do harmonogramu rejsów.
  
  Najpóźniej 7 dni przed ostatecznym terminem ujętym w harmonogramie rejsu, kierownik naukowy wprowadza zmiany w formularzu A oraz dodatkowe informacje w nowo powstałym formularzu B (zawierający poprawione informacje z formularza A). W skład wchodzą: 
  - wykorzystanie sprzętu badawczego
  - pozostawienie na jakiś czas lub zebranie go z poprzedniego rejsu / poprzednich rejsów
  - plan wchodzenia/wychodzenie z portu
  - realizacja zadań
  - lista sprzętu i aparatury badawczej
  - elementy techniczne statku wykorzystywane podczas rejsu
  
  Najpóźniej 14 dni po zrealizowanym rejsie kierownik naukowy wypełnia formularz C zawierający informacje o zebranym materiale badawczym, pozyskane dane do raportu przyznawania środków z Ministerstwa Edukacji i Nauki, opis podsumowujący rejs.

#pagebreak()

- *Scenariusz 2.* Proces oceny punktowej i priorytetyzacji rejsów przez Biuro Armatora.

  Po upływie terminu składania zgłoszeń (formularz A) Armator przystępuje do oceny rejsów, uzupełniając tabelę punktową służącą ich priorytetyzacji. W ocenie uwzględniane są m.in.: typ pracy dyplomowej, uzyskane finansowanie, liczba zaangażowanych jednostek organizacyjnych oraz realizacja projektów naukowych lub badawczo-rozwojowych.

  Następnie odbywa się spotkanie z kierownikami naukowymi oraz członkami Zespołu ds. Rozwoju Jednostki, podczas którego eliminowane są rejsy o zbyt niskiej punktacji lub kolidujące z innymi w harmonogramie.

- *Scenariusz 3.* Proces generowania raportu ze statystykami przez Biuro Armatora.

  Po zakończeniu roku kalendarzowego Armator generuje raport wykorzystania statku na podstawie danych zgromadzonych w harmonogramie. Raport obejmuje zestawienie liczby dni spędzonych w porcie oraz dni rejsowych, a także podział rejsów według ich typu (np. naukowo-badawcze, komercyjne, reprezentacyjne). Dane są agregowane automatycznie na podstawie zapisów w systemie i prezentowane w formie czytelnych statystyk, które mogą być wykorzystane do analizy działalności statku oraz planowania kolejnych okresów.

= 4-5. Backlog produktu i kryteria akceptacji
  
Link do backlogu: #link("https://github.com/VV01T3K/ResearchCruiseApp/issues")[`https://github.com/VV01T3K/ResearchCruiseApp/issues`]\
 
Rozmiary zadań:
 - XS - Proste zadanie, jedno działanie lub drobna zmiana w systemie.
 - S - Niewielkie zadanie wymagające kilku kroków, ograniczona liczba zmian w systemie.
 - M - Zadanie średniej złożoności, może wymagać zmiany kilku modułów, testowania i koordynacji.
 - L - Złożone zadanie wymagające pracy w wielu miejscach systemu.
 - XL - Bardzo złożone, wielomodułowe zadanie lub większa nowa funkcjonalność.

Sortowanie listy elementów w backlogu odbywa się według priorytetu:

 - P2 - Drobny problem lub ulepszenie. Nie wpływa istotnie na działanie systemu. Może zostać zrealizowany, gdy będą dostępne zasoby.
 - P1 - Problem o umiarkowanym wpływie na system. Nie jest pilny i może zostać rozwiązany w późniejszym czasie, bez dużego wpływu na użytkowników.
 - P0 - Istotny problem lub funkcjonalność, która znacząco wpływa na działanie systemu. Powinien zostać rozwiązany w pierwszej kolejności, ale nie blokuje całkowicie pracy.

 Następnym ważnym czynnikiem, który powoduje, że zadanie trafia wyżej na liście priorytetów jest większa potrzeba klienta na daną funkcjonalność.
 
 
#pagebreak()

 Lista elementów utworzonego backlogu produktu na następną iteracje:
 #image("scrum-product-backlog/1.png", width: 100%)

 
 Lista wszystkich issues:
 #image("scrum-product-backlog/2.png", width: 100%)

#pagebreak()
 Kryteria akceptacji dla wybranych zadań:
 #image("scrum-product-backlog/3.png", width: 60%)
 #image("scrum-product-backlog/4.png", width: 60%)
 #image("scrum-product-backlog/5.png", width: 60%)
 #image("scrum-product-backlog/6.png", width: 60%)
#pagebreak()


 Ogólne kryteria akceptacji / gotowości do wdrożenia:
 - Wszystkie zaplanowane funkcje zostały zaimplementowane zgodnie ze specyfikacją.
 - Wszystkie historyjki użytkowników mają spełnione kryteria akceptacji.
 - Brak błędów krytycznych lub blokujących działanie systemu.
 - Interfejs jest spójny i zgodny z wymaganiami UX.
 - Wszystkie krytyczne ścieżki użytkownika działają bez błędów.
 - System działa w akceptowalnym czasie reakcji dla wszystkich kluczowych funkcji.
  
  = 6. Definicja ukończenia

Aby uznać element backlogu za ukończony, muszą zostać spełnione następujące warunki:
- Kod źródłowy powstały w wyniku realizacji zadania został umieszczony w repozytorium projektu.
- Jeśli możliwe, zostały napisane testy jednostkowe dla nowego kodu źródłowego.
- Uruchomiono wszystkie skonfigurowane w projekcie narzędzia odpowiedzialne za formatowanie oraz sprawdzanie poprawności kodu źródłowego (np. prettier, eslint, csharpier).
- Wszystkie poprzednio utworzone testy jednostkowe oraz testy integracyjne zakończyły się sukcesem.
- Kod został przejrzany oraz zaakceptowany przez przynajmniej jednego członka zespołu.
- Dokumentacja została zaktualizowana o zmiany wprowadzone w kodzie źródłowym.
- Zmiany zostały zmergowane do gałęzi staging.

