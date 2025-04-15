#import "template.typ": template
#show: template.with("Scrum: Backlog sprintu", "1.0.0", datetime(day: 06, month: 4, year: 2025))

= 1. O projekcie i produkcie
- *Projekt*: System zarządzania rejsami statku RV Oceanograf biura Armatora Uniwersytetu Gdańskiego.
- *Produkt*: Aplikacja webowa do zarządzania rejsami statku biura Armatora Uniwersytetu Gdańskiego. 
Produkt skierowany jest do Biura Armatora oraz pracowników uczelni, którzy chcą zorganizować badawczy rejs statkiem. Aplikacja umożliwia im wypełnienie wymaganych formularzy oraz zarządzanie terminami rejsów.

= 2. Oszacowanie rozmiaru backlogu produktu
Backlog produktu został oszacowany podczas sesji Poker Planning z udziałem Zespołu Deweloperskiego i Product Ownera, 
którego rolę pełni jedna osoba z Zespołu Deweloperskiego (Stanisław Nieradko).
Zespół podczas Pokera omówił wszystkie 20 elementów backlogu produktu, zadawał pytania wyjaśniające Product Ownerowi, a następnie jednocześnie każdy uczestnik zespołu pokazywał palcami symbol estymowanej trudność zadania w Story Pointach (o wartościach ciągu fibonacciego).
W przypadku rozbieżności, osoby z skrajnymi wartościami uzasadniały swój wybór, co prowadziło do dyskusji i ponownego głosowania, aż do osiągnięcia konsensusu.

= 3. Założenia i dobór zakresu sprintu
 - *Nazwa Sprintu*: "Sprint 1 - "Implementacja Formularza C"
 - *Długość Sprintu*: 2 tygodnie (14 dni, 10 dni roboczych)
 - *Data Rozpoczęcia*: 7.04.2025
 - *Data Zakończenia*: 18.04.2025
 - *Zespół Deweloperski*: 5 osób
 - *Pojemność Zespołu*: 5 osób \* średnio 5h/tydzień \* 2 tygodnie = 50h
 - *Rezerwa na inne prace*: Zakładamy ~15% rezerwy na spotkania Scrumowe (Planowanie, Weekly Scrum, Review, Retrospektywa) (7.5h)
 - *Zakładana średnia szybkość zespołu*: Zakładamy, że średnia szybkość zespołu wyniesie 20 SP.
 - *Wybór elementów do Sprintu*: 
 // TODO elementy do sprintu, dodać w tablicy backlogu
  + Spotkanie z opiekunem projektu inżynierskiego. 1SP
  + Zdefiniowanie/Aktualizacja schematu bazy danych dla Formularza C 1SP
  + Opracowanie głównego kontenera/strony dla Formularza C. 2SP
  + Implementacja zarządzania stanem/kontekstu dla Formularza C. 2SP
  + Stworzenie komponentu UI dla sekcji Członkowie, Zebranie Próbek, Sprzętu badawczego Formularza C 3SP
  + Przegląd dokumentacji i backendu przed implementacją 1SP
  + Zaprojektowanie testów automatycznych dla Formularzu C 2SP
  + Naprawa buga w menu dropdown 1SP
  + Naprawa "file input preview" 1SP
  + Utworzenie pipeline'u CI/CD 2SP
  + Utworzenie środowiska Staging 3SP
= 4. Cel sprintu
Celem sprintu jest zaimplementowanie formularza C.

= 5-6. Backlog sprintu i kryteria akceptacji
Link do backlogu: #link("https://dev.azure.com/kanareklife/ResearchCruiseApp/_workitems/recentlyupdated/")[`https://dev.azure.com/kanareklife/ResearchCruiseApp`]\
Piorytet reprezentowany jest przez pozycję od góry w tabeli sprintu (na górze najważniejsze, na dole najmniej)\
Lista elementów backlogu produktu:
// TODO wstawić screenshoty elementów sprintu 
#image("scrum-sprint-backlog/1.png", width: 80%)
#image("scrum-sprint-backlog/2.png", width: 80%)
#image("scrum-sprint-backlog/3.png", width: 80%)
#image("scrum-sprint-backlog/4.png", width: 80%)
#image("scrum-sprint-backlog/5.png", width: 80%)
#image("scrum-sprint-backlog/6.png", width: 80%)
#image("scrum-sprint-backlog/7.png", width: 80%)
#image("scrum-sprint-backlog/8.png", width: 80%)
#image("scrum-sprint-backlog/9.png", width: 80%)
#image("scrum-sprint-backlog/10.png", width: 80%)
#image("scrum-sprint-backlog/11.png", width: 80%)

Posortowana lista:
#image("scrum-sprint-backlog/kolejnosc.png", width: 80%)


= 7. Definicja ukończenia

Aby uznać element backlogu za ukończony, muszą zostać spełnione następujące warunki:
- Kod źródłowy powstały w wyniku realizacji zadania został umieszczony w repozytorium projektu.
- Jeśli możliwe, zostały napisane testy jednostkowe dla nowego kodu źródłowego.
- Uruchomiono wszystkie skonfigurowane w projekcie narzędzia odpowiedzialne za formatowanie oraz sprawdzanie poprawności kodu źródłowego (np. prettier, eslint).
- Wszystkie poprzednio utworzone testy jednostkowe oraz testy integracyjne zakończyły się sukcesem.
- Kod został przejrzany oraz zaakceptowany przez przynajmniej dwóch członków zespołu.
- Dokumentacja została zaktualizowana o zmiany wprowadzone w kodzie źródłowym.
