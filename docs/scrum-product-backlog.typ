#import "template.typ": template
#show: template.with("Scrum: Backlog produktu", "1.0.0", datetime(day: 29, month: 3, year: 2025))

= 1. O projekcie i produkcie
- *Projekt*: System zarządzania rejsami statku RV Oceanograf biura Armatora Uniwersytetu Gdańskiego.
- *Produkt*: Aplikacja webowa do zarządzania rejsami statku biura Armatora Uniwersytetu Gdańskiego. Produkt skierowany jest do Biura Armatora oraz pracowników uczelni, którzy chcą zorganizować badawczy rejs statkiem. Aplikacja umożliwia im wypełnienie wymaganych formularzy oraz zarządzanie terminami rejsów.

= 2. Persony użytkowników

- *Persona 1: Kierownik Naukowy* - pracownik Uniwersytetu Gdańskiego, który odpowiada za organizację rejsu badawczego dla interesariuszy. Wypełnia on w aplikacji wszystkie wymagane formularze, które następnie są przesyłane do Biura Armatora. Zgłaszają się do niego studenci chcący wziąć udział w rejsie, w celach naukowych, pisania pracy inżynierskiej, magisterskiej lub doktoranckiej.
- Imię i nazwisko: Jan Kowalski
- Wykształcenie: wyższe
- Stanowisko: Kierownik Katedry na wydziale Oceanografii Uniwersytetu Gdańskiego
- stan cywilny: żonaty, 2 dzieci
- wiek: 58 lat
- zainteresowania: kolarstwo, wyścigi samochodowe
- zaawansowanie w korzystaniu z IT: umiarkowane
- problemy: 
  - pracochłonny proces wypełniania formularzy
  - obawa, że ktoś się pod niego podszyje i wypełni formularze w jego imieniu
  - boi się że interfejs aplikacji będzie zbyt skomplikowany i nie będzie potrafił z niego korzystać
- potrzeby: 
  - prosty i intuicyjny interfejs
  - możliwość wypełnienia formularzy w aplikacji i przesłania ich do Biura Armatora

- *Persona 2: Amator* - pracownik biura Armatora Uniwersytetu Gdańskiego, który zarządza rejsami statku i chce mieć możliwość dodawania nowych rejsów oraz edytowania istniejących. Ma dostęp do aplikacji i może przeglądać wszystkie rejsy, które są w systemie.
- Imię i nazwisko: Anna Nowak
- Wykształcenie: wyższe
- Stanowisko: Pracownik biura Armatora Uniwersytetu Gdańskiego
- stan cywilny: mężatka, 1 dziecko
- wiek: 35 lat
- zainteresowania: podróże, jazda na nartach
- zaawansowanie w korzystaniu z IT: średnio zaawansowane
- problemy: 
  - brak scentralizowanego systemu do zarządzania rejsami
  - trudności w przeszukiwaniu i edytowaniu rejsów
- potrzeby:
  - szybki w obsłudze interfejs
  - możliwość dodawania nowych rejsów oraz edytowania istniejących
  - wygodny dostęp do harmonogramu rejsu 
  - możliwość przeszukiwania rejsów według różnych kryteriów (np. daty, celu rejsu, liczby uczestników)

- *Persona 3: Administrator* - pracownik, który zarządza aplikacją i odpowiada za jej prawidłowe działanie. Ma dostęp do wszystkich funkcji aplikacji i może zarządzać użytkownikami oraz ich uprawnieniami.
- Imię i nazwisko: Piotr Wiśniewski
- Wykształcenie: wyższe
- Stanowisko: Administrator systemu
- stan cywilny: kawaler
- wiek: 50 lat
- zainteresowania: informatyka, programowanie
- zaawansowanie w korzystaniu z IT: bardzo wysokie
- problemy: 
  - aplikacja jest zbyt trudna w utrzymaniu 
  - brak dokumentacji do aplikacji
- potrzeby:
  - bezpieczeństwo i stabilność aplikacji
  - dokumentacja do aplikacji
  - możliwość zarządzania użytkownikami i ich uprawnieniami

= 3. Scenariusz użycia produktu

- *Scenariusz 1.* Proces planowania, realizacji i rozliczenia rejsu z perspektywy kierownika naukowego.

  Kierownik naukowy po uzyskaniu zgody przełożonego (poza systemem) zgłasza chęć odbycia rejsu wypełniając formularz A w roku poprzedzającym potencjalne odbycie się rejsu. W zgłoszeniu podaje informacje dotyczące kierownika rejsu, jego zastępcy, terminu rejsu, czasu wykorzystania statku, pozwoleń na przeprowadzenie badań, rejonu prowadzenia badań, celu, liczby uczestników i kim są, jak realizacja zadania na rejsie pokrywa się z pisaną publikacją. Pod koniec roku kalendarzowego zgłoszenia następuje spotkanie zgłaszających formularz A, reprezentantów Biura Armatora i członków Zespołu ds. Rozwoju Jednostki Naukowo Badawczej R/V Oceaograf. Na spotkaniu dokonywane są modyfikacje harmonogramu rejsów. Najpóźniej 7 dni przed ostatecznym terminem ujętym w harmonogramie rejsu, kierownik naukowy wprowadza zmiany w formularzu A oraz dodatkowe informacje w nowo powstałym formularzu B (zawierający poprawione informacje z formularza A). W skład wchodzą: wykorzystanie sprzętu badawczego, pozostawienie go na jakiś czas lub zebranie go z poprzednich(ego) resjów(u), dodatkowe wchodzenie  wychodzenie z portu, realizacja zadań, lista sprzętu i aparatury badawczej. Najpóźniej 14 dni po zrealizowanym rejsie kierownik naukowy wypełnia formularz C zawierający informacje o zebranym materiale badawczym, pozyskane dane do raportu przyznawania środków z Ministerstwa Edukacji i Nauki, opis podsumowujący rejs.

- *Scenariusz 2.* Proces oceny punktowej oceny i priorytetyzacji rejsów przez Biuro Armatora.

  Armator w momencie upłynięcia terminu zgłoszeń rejsów (formularz A), przystępuje do uzupełnienia tabeli wytycznych punktowych priorytetyzacji rejsów. Bierze pod uwagę rodzaj pracy dyplomowej, pozyskane dofinansowanie, liczność jednostek organizacyjnych uczestniczących w rejsie, realizację projektu naukowego lub badawczo-rozwojowego. Po uzupełnieniu następuje spotkanie z kierownikami naukowymi i członkami Zespołu ds. Rozwoju Jednostki Naukowo Badawczej R/V Oceaograf podczas którego odrzucane są te z niewystarczająco wysoką punktacją lub/i kolidujące z innymi rejsami.

- *Scenariusz 3.* Proces tworzenia reprezentacyjnego rejsu i generowania raportu ze statystykami przez Biuro Armatora.

  Armator wprowadza "własny" rejs, który umożliwia pominięcie uzupełniania formularzy A, B, C. Może być to np. rejs reprezentacyjny który nie wymaga tej dokumentacji. Zostaje ona wpisana harmonogramu i kalendarza. Dodatkowo dla uczestników tego rejsu tworzy dla nich konto, które może zobaczyć informację z poziomu Biura Armatora, ale bez możliwości ich edycji. Po odbyciu rejsu, w nowym roku kalendarzowym Armator generuje raport wykorzystania statku na podstawie harmonogramu za konkretny rok, ile dni w porcie, podział rejsów na naukowo-badawcze, komercyjne, reprezentacyjne. 


= 4-5. Backlog produktu i kryteria akceptacji
Link do backlogu: #link("https://dev.azure.com/kanareklife/ResearchCruiseApp/_workitems/recentlyupdated/")[`https://dev.azure.com/kanareklife/ResearchCruiseApp`]\
Skala priorytetów: 1 najwyższy, 5 najniższy.
Lista elementów backlogu produktu:
#image("scrum-product-backlog/1.png", width: 80%)
#image("scrum-product-backlog/2.png", width: 80%)
#image("scrum-product-backlog/3.png", width: 80%)
#image("scrum-product-backlog/4.png", width: 80%)

Posortowana lista:
#image("scrum-product-backlog/5.png", width: 80%)
Wyjaśnienie posortowania:
Bez utworzonych formularzy A, B, C nie można wykonać weryfikacji tychże formularzy. To samo z eksportowaniem raportów. Pozostałe elementy backlogu są mniej istotne, ponieważ nie są wymagane do działania aplikacji. W szczególności elementy backlogu dotyczące dodawania i edytowania rejsów są mniej istotne, ponieważ nie są wymagane do działania aplikacji.
= 6. Definicja ukończenia

Aby uznać element backlogu za ukończony, muszą zostać spełnione następujące warunki:
- Kod źródłowy powstały w wyniku realizacji zadania został umieszczony w repozytorium projektu.
- Jeśli możliwe, zostały napisane testy jednostkowe dla nowego kodu źródłowego.
- Uruchomiono wszystkie skonfigurowane w projekcie narzędzia odpowiedzialne za formatowanie oraz sprawdzanie poprawności kodu źródłowego (np. prettier, eslint).
- Wszystkie poprzednio utworzone testy jednostkowe oraz testy integracyjne zakończyły się sukcesem.
- Kod został przejrzany oraz zaakceptowany przez przynajmniej dwóch członków zespołu.
- Dokumentacja została zaktualizowana o zmiany wprowadzone w kodzie źródłowym.
