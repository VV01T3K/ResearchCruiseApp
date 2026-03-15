#import "template.typ": template
#show: template.with("Organizacja i infrastruktura projektu", "1.0.0", datetime(day: 15, month: 3, year: 2026))

= 1. Opis projektu i produktu

== Nazwa projektu

Portal wspierający obsługę rejsów dla biura Armatora Wydział Oceanografii i Geografii UG - *ResearchCruiseApp*

== Adresowany problem

Projekt *ResearchCruiseApp* został opracowany z myślą o zarządzaniu rejsami badawczymi statku „Oceanograf”, należącego do Instytutu Oceanografii Uniwersytetu Gdańskiego. Celem aplikacji jest usprawnienie procesów związanych z rezerwacją, organizacją i obsługą rejsów badawczych, a także zapewnienie efektywnej komunikacji pomiędzy różnymi uczestnikami tych działań. Istotnym elementem systemu jest także interaktywny kalendarz, który w przejrzysty sposób prezentuje harmonogram rejsów. Prace nad aplikacją rozpoczęły poprzednie zespoły dwa lata temu, a obecnie są przez nas kontynuowane w ramach projektu grupowego oraz dwóch prac inżynierskich.

== Obszar zastosowania i rynek

Aplikacja została opracowana na potrzeby biura armatora Uniwersytetu Gdańskiego. Jej funkcjonalność obejmuje planowanie działania statku na kolejne lata, przechowywanie danych z formularzy w jednej aplikacji zamiast papierowych dokumentów, zarządzanie rejsami badawczymi, obsługę zgłoszeń oraz komunikację pomiędzy różnymi interesariuszami zaangażowanymi w organizację rejsów. Głównym celem systemu jest usprawnienie procesów administracyjnych związanych z planowaniem i realizacją rejsów badawczych.

== Prace nad projektem

=== Zadania do wykonania wskazane przez promotora:

- Utrzymanie istniejącego kodu
- Uzgodnienie zakresu funkcjonalności z klientem
- Projekt, implementacja kolejnych funkcjonalności frontendowych z użyciem frameworku React i języka TypeScript oraz backendowych z użyciem ASP.NET Core
- Testowanie i wdrożenie kolejnych funkcjonalności
- Naprawa zgłoszonych błędów.

=== Ograniczenia związane z projektem

-  Silnik bazodanowy wymuszony przez klienta - Microsoft SQL Server.

=== Inne współpracujące systemy

Aplikacja obecnie nie współpracuje z innymi systemami.

// Jednakże w przyszłości planowane jest dodanie integracji z Active Directory / SSO Uniwersytetu Gdańskiego w celu ułatwienia zarządzania użytkownikami oraz procesem logowania.

=== Istotne terminy wydarzeń

- Przejęcie projektu w październiku 2025 r.
- 14.11.2025 wdrożenie wersji 2.1.0 aplikacji na serwer UG​
- Wdrożenie wersji 2.2.0 i 2.2.1 w grudniu 2025 r.​
- Przygotowane wersje 2.3.0 i 2.3.1 do wdrożenia w marcu 2026 r.
- Spotkania z promotorem średnio co dwa tygodnie w celu kontrolowania postępów prac oraz uzyskania wskazówek do dalszego rozwoju
- Spotkania z klientem średnio co trzy miesiące w celu przedstawienia aktualnego działania systemu i zebrania opinii użytkowników

== Główne etapy projektu

Celem projektu jest dalszy rozwój i utrzymanie portalu, który powstał w ramach poprzedniego projektu. Realizowane i rozwijane są wybrane funkcjonalności służące obsłudze i planowaniu rejsów morskich jednostek badawczych, które obsługuje Biuro Armatora. W chwili obecnej zaimplementowana została podstawowa funkcjonalność w następujących obszarach: zbieranie podstawowych danych o załogach, planach badawczych i rejsach, wspieranie planowania harmonogramu rejsów, obsługa realizacji rejsów i raportowanych wyników naukowych. W następnych jednostkach wdrożeniowych planowane jest dalsze rozwijanie istniejących modułów systemu, wprowadzanie nowych funkcjonalności wynikających z potrzeb użytkowników oraz poprawa stabilności i użyteczności aplikacji.


= 2. Interesariusze i użytkownicy

=== Interesariusze

- *Administratorzy systemu* - osoby zarządzające całością aplikacji
- *Biuro armatora Uniwersytetu Gdańskiego* - pracownicy odpowiedzialni za organizację rejsów
- *Kierownicy rejsów* - osoby odpowiedzialne za zarządzanie konkretnymi rejsami
- *Przełożeni* - osoby odpowiedzialne za zatwierdzanie rejsów, nie mają dostępu do pozostałych funkcji aplikacji
- *Załoga statku* - członkowie załogi jednostki badawczej
- *Goście zewnętrzni* - osoby, które mogą przeglądać dane aplikacji

=== Użytkownicy końcowi

Aplikacja obsługuje pięć typów użytkowników:
- *Administrator*:
  Ma pełny dostęp do wszystkich danych i funkcjonalności aplikacji. Odpowiada za zarządzanie użytkownikami, konfigurację systemu oraz nadzorowanie poprawności działania aplikacji.
- *Armator*:
  Ma pełny dostęp do danych związanych z organizacją rejsów. Może zarządzać zgłoszeniami i rejsami. Posiada ograniczone możliwości zarządzania użytkownikami.
- *Kierownik rejsu*:
  Posiada dostęp wyłącznie do danych związanych z własnymi rejsami oraz zgłoszeniami, w których pełni rolę zastępcy. Nie posiada możliwości zarządzania innymi użytkownikami ani modyfikowania ogólnych danych rejsowych.
- *Załoga statku*:
  Posiada dostęp do wszystkich formularzy związanych z obsługą rejsów oraz do harmonogramu rejsów.
- *Gość*:
  Posiada tylko możliwość przeglądania danych bez możliwości edycji.

=== Dodatkowe wymagania użytkowników

- Dostęp do aplikacji powinien być odpowiednio zabezpieczony i dostępny wyłącznie dla uprawnionych użytkowników.

- Dane prywatne przechowywane w bazie danych muszą być chronione przed nieautoryzowanym dostępem oraz przetwarzane zgodnie z obowiązującymi przepisami prawa.

- System powinien zapewniać ochronę przed utratą danych, także w sytuacjach awarii lub nieprawidłowego działania systemu.

- Interfejs użytkownika powinien być zaprojektowany w sposób intuicyjny i przejrzysty, aby umożliwić użytkownikom szybkie i efektywne wykonywanie powierzonych zadań.

= 3. Zespół

Prace nad projektem realizowane są przez dwa dwuosobowe zespoły. Docelowo każdy z nich odpowiada za wybrane obszary systemu. W początkowym etapie wszyscy członkowie zespołów współpracują jednak przy przejmowaniu projektu od poprzedniej grupy, poprawie jakości istniejącego kodu oraz usuwaniu zgłoszonych błędów.

== Organizacja pracy zespołu

Oba podzespoły komunikują się za pomocą platformy Discord oraz uczestniczą w spotkaniach z klientem i promotorem na platformie Teams. Dodatkowo do zarządzania zadaniami wykorzystywany jest system GitHub Issues, który umożliwia zespołowi śledzenie zgłoszonych problemów oraz planowanie prac nad ich rozwiązaniem. Członkowie zespołu mogą przypisywać zadania, komentować postępy oraz dokumentować wprowadzone zmiany. Takie rozwiązanie wspiera asynchroniczny model pracy, umożliwiając efektywną współpracę zespołu niezależnie od czasu pracy poszczególnych członków. Praca zespołu odbywa się w modelu rozproszonym.

== Zespół 1: Realizacja funkcjonalnych wymagań dla portalu wspierającego obsługę rejsów Biura Armatora Wydział Oceanografii i Geografii UG.

- Paweł Narwojsz (s197977\@student.pg.edu.pl): Lider podzespołu, posiadający umiejętności związane z technologią .NET i React. Odpowiedzialny za całokształt prac widocznych dla klienta, włączając w to architekturę projektu oraz za implementację zaplanowanych funkcjonalności. Współpracuje z resztą zespołu przy testowaniu i poprawianiu istniejących elementów systemu. Odpowiada także za wprowadzanie i klasyfikowanie zgłoszonych zadań oraz nadzorowanie backlogu projektowego.

- Filip Pudlak (s198157\@student.pg.edu.pl): Posiada umiejętności związane z technologią .NET i React. Odpowiedzialny za całokształt prac widocznych dla klienta oraz za implementację zaplanowanych funkcjonalności. Współpracuje z resztą zespołu przy testowaniu i poprawianiu istniejących elementów systemu. Uczestniczy w zgłaszaniu i usuwaniu błędów oraz w procesie refaktoryzacji kodu w celu poprawy jego jakości i czytelności.

== Zespół 2: Realizacja niefunkcjonalnych wymagań dla portalu wspierającego obsługę rejsów Biura Armatora Wydział Oceanografii i Geografii UG.

- Wojciech Siwiec (s197815\@student.pg.edu.pl): Lider i koordynator całego projektu. Odpowiedzialny za rozwój DevOps, utrzymanie backendu. W swojej pracy wykorzystuje znajomość nowoczesnych technologii i narzędzi, wdrażając rozwiązania usprawniające proces wytwarzania i pracę całego zespołu. Współpracuje z resztą zespołu przy testowaniu i poprawianiu istniejących elementów systemu.

- Bartosz Łyskanowski (s198051\@student.pg.edu.pl): Posiada umiejętności związane z analizą i bazami danych. Odpowiedzialny za implementację zaplanowanych funkcjonalności. Współpracuje z resztą zespołu przy testowaniu i poprawianiu istniejących elementów systemu. Uczestniczy w zgłaszaniu i usuwaniu błędów oraz w procesie refaktoryzacji kodu w celu poprawy jego jakości i czytelności.

#pagebreak()

= 4. Komunikacja w zespole i z interesariuszami

Komunikacja wewnątrz zespołu odbywa się za pośrednictwem aplikacji Discord, która służy do bieżącej wymiany informacji, dyskusji technicznych oraz szybkiego uzgadniania decyzji projektowych.

Komunikacja z opiekunem projektu odbywa się za pomocą platformy Teams w trakcie regularnych spotkań online, organizowanych średnio co dwa tygodnie. Podczas spotkań omawiane są postępy prac, planowane działania, napotkane problemy oraz kierunki dalszego rozwoju systemu. Wszystkie istotne decyzje projektowe są konsultowane z opiekunem.

Komunikacja z klientem realizowana jest średnio co trzy miesiące na platformie Teams. Klient może zgłaszać błędy, propozycje zmian oraz nowe wymagania funkcjonalne, które zazwyczaj przesyła w formie dokumentu w Wordzie. Zgłoszenia te są analizowane przez nasz zespół, a następnie wprowadzane do GitHub Issues, który umożliwia śledzenie zgłoszonych problemów, planowanie prac oraz monitorowanie postępów. To rozwiązanie wspiera asynchroniczny model pracy i umożliwia efektywną współpracę niezależnie od czasu pracy poszczególnych członków zespołu.

= 5. Współdzielenie dokumentów i kodu

Dokumentacja projektu jest tworzona przy pomocy narzędzia #link("https://typst.app/")[`typst`]. Kod tworzący dokument przechowywany jest wraz z resztą kodu projektu w repozytorium Git hostowanym na opisanej dalej platformie GitHub.

Repozytorium projektu przechowywane jest na platformie GitHub pod adresem #link("https://github.com/VV01T3K/ResearchCruiseApp")[`https://github.com/VV01T3K/ResearchCruiseApp`]. Repozytorium bazowane jest na uprzednim repozytorium, które zostało przekazane przez poprzedni zespół projektowy. Wszelkie zmiany w kodzie oraz dokumentacji są dokonywane za pomocą systemu kontroli wersji git oraz podlegają recenzji kodu przez pozostałych członków zespołu. Gałąź `main` jest gałęzią produkcyjną, która zawiera najnowszą wersję aplikacji.

Utrzymanie porządku w repozytorium jest głównym zadaniem lidera projektu, jak i członków tworzących poszczególne gałęzie. Zmiany w kodzie muszą być zatwierdzone przez przynajmniej jednego z członków zespołu przed scaleniem z gałęzią główną. Dokumentacja projektowa jest nadzorowana przez wszystkich członków zespołu w czasie wolnym. Szablon dokumentacji znajduje się w pliku `docs/template.typ`, a aktualne wersje dokumentów są przechowywane w katalogu `docs` w repozytorium (nazewnictwo po angielsku zgodne z tytułem zadania `*.pdf`) oraz pliki źródłowe `*.typ`, co umożliwia ich wersjonowanie (wersję samego dokumentu należy zmienić ręcznie).


= 6. Narzędzia i technologie wykorzystane w projekcie

== Kontrola wersji i zarządzanie kodem
- *Git* – system kontroli wersji.
- *GitHub* – platforma do hostowania repozytorium kodu, zarządzania zadaniami (Issues) i dyskusji.

== Komunikacja i współpraca zespołowa
- *Discord* – platforma do bieżącej komunikacji w zespole.
- *Microsoft Teams* – platforma do komunikacji z opiekunem projektu oraz klientem.

== Dokumentacja projektu
- *Typst* – narzędzie do tworzenia dokumentacji projektowej.

== Środowisko programistyczne
- *Visual Studio Code* – środowisko do pracy nad kodem front-endu i back-endu.

== Technologie frontendowe
- *pnpm*, *bun*, *Node.js* – narzędzia do zarządzania zależnościami, budowania i uruchamiania aplikacji frontendowej.
- *React* oraz biblioteki takie jak *TanStack* i *React Motion* – framework i biblioteki wykorzystywane do tworzenia interfejsu użytkownika.

== Technologie backendowe
- *.NET Core* oraz narzędzie *dotnet* – framework i środowisko do tworzenia oraz uruchamiania aplikacji backendowej.

== Baza danych
- *Microsoft SQL Server* – system zarządzania bazą danych wykorzystywany w aplikacji.

== Konteneryzacja i uruchamianie środowiska
- *Docker* – narzędzie do uruchamiania aplikacji w kontenerach.
- *Docker Compose* – narzędzie do zarządzania wieloma kontenerami oraz konfiguracją środowiska.

== Testowanie
- *Playwright* - framework do automatyzacji testów aplikacji webowych

== Obserwowalność
- *Grafana* - platforma służąca do wizualizacji danych, monitorowania systemów i analizy metryk w czasie rzeczywistym

== Narzędzia AI
- *Greptile* - agent do przeglądu kodu, który automatycznie analizuje i weryfikuje jego jakość przy każdym pull requestcie na GitHubie.