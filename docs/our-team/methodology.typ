#import "template.typ": template
#show: template.with("Dobór i adaptacja metodyki", "1.0.0", datetime(day: 31, month: 5, year: 2026))

= 1. O projekcie i produkcie
- *Projekt:* Opracowanie systemu do zarządzania rejsami statku RV Oceanograf dla Biura Armatora Uniwersytetu Gdańskiego.
- *Produkt:* Aplikacja internetowa wspierająca organizację i obsługę rejsów statku należącego do Biura Armatora Uniwersytetu Gdańskiego. Narzędzie jest przeznaczone zarówno dla pracowników Biura Armatora, jak i kadry uczelni planującej rejsy badawcze. Umożliwia ono m.in. wypełnianie niezbędnych formularzy oraz koordynację harmonogramu rejsów.

= 2. Ocena według modelu uproszczonego - 5 kryteriów

Ocena projektu na podstawie zaadaptowanych modeli i kryteriów zaproponowanych przez B. Boehma i R. Turnera.

== 2.1 Rozmiar

Projekt dotyczy stworzenia aplikacji webowej dla specyficznej jednostki (RV Oceanograf) i określonej grupy użytkowników (Biuro Armatora, pracownicy UG). Zakres funkcjonalny, obejmujący zarządzanie formularzami i terminami rejsów oznacza projekt małej wielkości.
  - Ocena: Mały.
  - Uzasadnienie: Projekty o mniejszej skali często korzystają na elastyczności i szybkości iteracji charakterystycznych dla metodyk zwinnych. Złożoność nie wydaje się na tyle duża, aby wymuszać ciężkie, sformalizowane podejście.
  - Wskazanie: Preferencja dla metodyk zwinnych.

== 2.2 Krytyczność

System będzie zarządzał rejsami badawczymi, co wiąże się z koordynacją zasobów, bezpieczeństwem danych i potencjalnymi konsekwencjami finansowymi (zadania SPUB) lub operacyjnymi w przypadku błędów (np. błędne rezerwacje, utrata danych z formularzy).
  - Ocena: Średnia (Przez potencjalne fundusze z dofinansowań).
  - Uzasadnienie: Chociaż nie jest to system krytyczny dla życia, jego awaria lub błędy mogą prowadzić do zakłóceń w badaniach naukowych, strat finansowych i problemów organizacyjnych dla Uniwersytetu. Wymaga to zapewnienia odpowiedniej jakości i niezawodności.
  - Wskazanie: Podejście zwinne z elementami zdyscyplinowanymi

== 2.3 Dynamika 

Istotna jest możliwość szybkiego wprowadzania zmian w szczególności przy: interfejsie użytkownika, specyficznych polach w formularzach czy reguł walidacji. Zmiany i nowe funkcjonalności powinny być dostosowywane wraz z napływem informacji zwrotnej od Armatora.
  - Ocena: Średnio-wysoka. (Zależy od częstotliwości spotkań z klientem i jego zdecydowania)
  - Uzasadnienie: Aplikacja podlega zmianom zgodnie z życzeniami klienta. Możliwość adaptacji do zmieniających się potrzeb i nowych usprawnień w trakcie projektu jest istotna.
  - Wskazanie: Preferencja dla metodyk zwinnych, dobrze radzących sobie ze zmieniającymi się wymaganiami.

#pagebreak()

== 2.4 Osoby

Projekt jest realizowany dla Biura Armatora Uniwersytetu Gdańskiego. Zespół deweloperski posiada odpowiednie kompetencje do tworzenia aplikacji webowych. Kluczowa jest dostępność i zaangażowanie Biura Armatora w procesie definiowania wymagań funkcjonalnych i użytkowych. Dodatkowo zastosowaniu metodyk zwinnych sprzyja niewielki zespół deweloperski. Jesteśmy świadomi stosowanych metodyk i potrafimy ewentualnie je zmieniać (osoby typu 2), choć nie zwracamy do tego największej uwagi.
  - Ocena: Korzystna dla zwinności.
  - Uzasadnienie: Metodyki zwinne opierają się na samoorganizujących się zespołach i bliskiej współpracy z klientem.
  - Wskazanie: Preferencja dla metodyk zwinnych, przy aktywnym udziale Biura Armatora.

== 2.5 Kultura

Projekt realizowany jest dla Uniwersytetu Gdańskiego, więc nakłada pewien stopień kultury. Deweloperzy są przystosowani do lekkiego chaosu, zamiast uporządkowanej dokumentacji.
  - Ocena: Mieszana.
  - Uzasadnienie: Kultura uniwersytecka może być otwarta na innowacje i jednocześnie posiadać cechy organizacji hierarchicznej. Biuro Armatora ma ustalony regulamin, który system musi wspierać.
  - Wskazanie: Metodyki zwinne mogą być efektywne, ale z koniecznością ewentualnych adaptacji do formalnych wymogów (np. w zakresie akceptacji etapów, dokumentacji).
#image("methodology/latawiec.png", width: 80%)
== 2.6 Podsumowanie
Podsumowanie oceny uproszczonej: Projekt dobrze pasuje do metodyk zwinnych, szczególnie pod względem rozmiaru, dynamiki i ilości osób. Krytyczność, kultura i rzadkie spotkania z klientem wskazują na potrzebę włączenia pewnych elementów klasycznych.

= 3. Ocena według zaadaptowanego modelu pełnego - 7 kryteriów
== 3.1 Zastosowanie
  === Główne cele
  - Ocena projektu: Główne cele (stworzenie systemu do zarządzania rejsami, formularzami i terminami) są jasno określone. Jednakże, sposób ich realizacji i szczegółowa funkcjonalność nie jest znana i powinna zostać doprecyzowana wraz z tworzonym produktem.
  - Uzasadnienie: Projekt ma na celu dostarczenie konkretnej wartości użytkownikom (usprawnienie organizacji rejsów). Możliwość wczesnego dostarczania działających części systemu i zbierania feedbacku jest konieczna.
  - Dopasowanie: Metodyki zwinne, umożliwiające iteracyjne odkrywanie i dostarczanie wartości.

  === Środowisko
  - Ocena projektu: Środowisko projektu jest umiarkowanie zmienne i skupione głównie na projekcie, ponieważ aplikacja ma wspierać proces organizacji rejsów badawczych realizowanych przez Uniwersytet.
  - Uzasadnienie: Adaptacja do środowiska pracy użytkowników jest kluczowa. Elastyczność w reagowaniu na ich potrzeby i integracja z istniejącymi procesami są istotne.
  - Dopasowanie: Metodyki zwinne, wspierające adaptację do środowiska i wymagań użytkowników.

== 3.2 Zarządzanie
  === Komunikacja
  - Ocena projektu: W projekcie uczestniczą różne grupy interesariuszy, dlatego wiedza o głównym procesie jest udokumentowana. Brakuje natomiast szczegółowych opisów poszczególnych procesów, które są bardziej współdzielone niż dokumentowane.
  - Uzasadnienie: Szczegółowa wiedza jest bardziej współdzielona niż udokumentowana.
  - Dopasowanie: W stronę metodyk zwinnych, które lepiej się sprawdzają przy współdzielonej wiedzy.

== 3.3 Techniczne
  === Wymagania
  - Ocena projektu: Ogólny zakres jest znany (formularze, terminy). Szczegółowe wymagania dotyczące logiki biznesowej, pól formularzy, przepływów pracy, wyglądu UI, funkcjonalność aplikacji bez dostępu do internetu, uprawnień użytkowników wymagają doprecyzowania i będą ewoluować. Prościej je tworzyć jako nieformalne historyjki.
  - Uzasadnienie: Trudno jest z góry zdefiniować wszystkie szczegóły. Iteracyjne podejście do zbierania i implementacji wymagań pozwoli na lepsze dopasowanie produktu do rzeczywistych potrzeb.
  - Dopasowanie: Metodyki zwinne, akceptujące i zarządzające zmieniającymi się wymaganiami.
 
  === Wytwarzanie
  - Ocena projektu: Tworzenie prostej aplikacji webowej. Nowoczesne technologie webowe dobrze współgrają z iteracyjnymi i krótko przyrostowymi podejściami. Refaktoryzacja jest raczej prosta.
  - Uzasadnienie: Możliwość szybkiego budowania komponentów i częstego wdrażania wersji testowych lub produkcyjnych.
  - Dopasowanie: Metodyki zwinne, wspierające iteracyjne wytwarzanie i częste dostarczanie działającego oprogramowania.

== 3.4 Osoby
  === Klient
  - Ocena projektu: Klientami są pracownicy Biura Armatora, powinni posiadać oni cechy CRACK. Ich zaangażowanie w proces jest kluczowe przy dalszym rozwoju aplikacji.
  - Uzasadnienie: Aktywny udział klienta w definiowaniu priorytetów i akceptacji wykonanych prac jest fundamentem zwinności.
  - Dopasowanie: Metodyki zwinne, wymagające bliskiej współpracy z klientem.

  === Kultura
  - Ocena projektu: Zespół projektowy lepiej radzi sobie przy większej swobodzie niż pracując na określonych zasadach.
  - Uzasadnienie: Skłonność do chaosu.
  - Dopasowanie: Metodyki zwinne.

== 3.5 Podsumowanie oceny pełnej
  Większość kryteriów w modelu pełnym również wskazuje na dopasowanie projektu do metodyk zwinnych.

= 4. Modele dostarczania produktu końcowego projektu
Analiza modeli dostarczania:
  - Przyrostowy: Aplikacja może być dostarczana przez nas w kolejnych, funkcjonalnych częściach. Każdy przyrost dostarcza wartość użytkownikom i pozwala na zbieranie informacji zwrotnych. 

  - Ciągły : Najczęściej pracujemy w trybie "ciągłym", ponieważ nie ma ściśle wyznaczonych dat sprintów, planowania itp.
  
  - Jednorazowy: Model nieodpowiedni ze względu na ryzyko niedopasowania produktu do potrzeb użytkowników.

Sugerowana metodyka wspierająca model przyrostowy: Dla projektu  wybrano podejście, łączące elementy metodyk Scrum i Kanban. Rozwiązanie to umożliwia przyrostowe rozwijanie systemu poprzez planowanie i realizację kolejnych funkcjonalności, jednocześnie zachowując większą elastyczność organizacji pracy niż klasyczny Scrum.

Ze Scruma wykorzystane zostaną przede wszystkim: zarządzanie backlogiem produktu, priorytetyzacja zadań oraz przyrostowe dostarczanie kolejnych funkcjonalności.
Z Kanbana przejęte zostaną wizualizacja przepływu pracy na tablicy zadań, ograniczanie liczby zadań w toku (WIP) oraz możliwość płynnego realizowania prac bez konieczności organizowania wszystkich ceremonii Scrumowych, brak potrzeby planowania sprintów itp.

Kanban okazuje się lepszym rozwiązaniem w przypadku tego projektu niż Scrum, ponieważ nie wymaga czasochłonnego szacowania i planowania sprintów.

#pagebreak()

= 5. Metodyka i jej adaptacja

Dla projektu  jako bazową metodykę przyjęto Kanban rozszerzony o elementy Scrum.

Wybór wynika z potrzeby elastycznego zarządzania zadaniami, braku sztywnych terminów iteracji oraz zmienności wymagań.
Model ten wspiera ciągły przepływ pracy oraz przyrostowe dostarczanie funkcjonalności, co odpowiada charakterowi projektu.

Uzasadnienie wyboru:

- Projekt ma zmienne i doprecyzowywane wymagania.
- Występuje potrzeba częstych zmian UI, formularzy i logiki biznesowej.
- Zespół jest niewielki, co ogranicza sens stosowania pełnych ceremonii Scrum.
- Istnieje potrzeba szybkiego reagowania na feedback użytkowników.

== Elementy projektu niepasujące idealnie do Scrumban:

=== 1. Potrzeba kontroli jakości i niezawodności systemu

Ryzyko błędów może powodować problemy organizacyjne i finansowe.
Kanban sam w sobie nie narzuca mechanizmów jakości.

-  Adaptacja: wprowadzenie testów i obowiązkowe code review dla kluczowych funkcji oraz testowanie funkcjonalności przed wdrożeniem.

=== 2. Ograniczona dostępność Armatora

Brak ciągłej współpracy jak w klasycznym Agile.

-  Adaptacja: dokumentowanie kluczowych decyzji i wymagań, okresowe spotkania podsumowujące, zatwierdzanie większych zmian funkcjonalnych w blokach

=== 3. Środowisko uczelniane i częściowo formalne procesy
Wymagana jest pewna dokumentacja i akceptacja etapów.

-  Adaptacja: wprowadzenie formalnych punktów akceptacji funkcjonalności, sprawdzanie poprawności z istniejącą dokumentacją.

=== 4. Brak sprintów i planowania iteracyjnego

Klasyczny Scrum nie jest w pełni stosowany.

-  Adaptacja: rezygnacja z sprintów i ceremonii oraz ciągłe priorytetyzowanie backlogu.

=== 5. Podsumowanie adaptacji:
Przyjęta metodyka  łączy:
- elastyczność Kanbana (ciągły przepływ pracy),
- wybrane elementy Scruma (backlog, priorytety, iteracyjne dostarczanie wartości).