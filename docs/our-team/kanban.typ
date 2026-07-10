#import "template.typ": template
#show: template.with("Kanban", "1.0.0", datetime(day: 3, month: 5, year: 2026))

= 1. O projekcie i produkcie
- *Projekt:* Opracowanie systemu do zarządzania rejsami statku RV Oceanograf dla Biura Armatora Uniwersytetu Gdańskiego.
- *Produkt:* Aplikacja internetowa wspierająca organizację i obsługę rejsów statku należącego do Biura Armatora Uniwersytetu Gdańskiego. Narzędzie jest przeznaczone zarówno dla pracowników Biura Armatora, jak i kadry uczelni planującej rejsy badawcze. Umożliwia ono m.in. wypełnianie niezbędnych formularzy oraz koordynację harmonogramu rejsów.

= 2. Stany zgłoszeń/zadań
Lista stanów:
- To Do - Stan, w którym znajdują się zadania oczekujące na rozpoczęcie, które zostały dodane przez zespół developerski (np. przy znalezieniu buga). Zadanie przechodzi do stanu "In Analysis", gdy napotka potrzebę analizy, lub omówienia z klientem, lub do "In Progress", gdy zostanie podjęta decyzja o jego rozpoczęciu.
- In Analysis - Stan, w którym zadanie jest szczegółowo analizowane oraz omawiane z klientem w celu doprecyzowania wymagań, zakresu i oczekiwań. Na tym etapie identyfikowane są ewentualne niejasności, zależności oraz ryzyka. Po zakończeniu analizy i uzyskaniu wszystkich niezbędnych informacji zadanie przechodzi do stanu "In Progress".
- In Progress - Stan, w którym zadanie jest aktywnie realizowane oraz testowane przez developera wykonującego to zadanie (nie mamy test team-u). Po zakończeniu pracy nad zadaniem przechodzi ono do stanu "In Review" w celu sprawdzenia przez innego developera potencjalnych błędów i niedociągnięć.
- In Review - Stan, w którym zadanie jest weryfikowane przez developerów. Po zatwierdzeniu zadanie przechodzi do stanu "Done".
- Done - Stan, w którym zadanie zostało zakończone i zaakceptowane. Zadanie pozostaje w tym stanie jako zakończone.

Możliwe przejścia między stanami:

    To Do:
        - → In Progress: Rozpoczęcie pracy nad zadaniem, jeśli nie wymaga ono zbytnio analizy
        - → In Analysis: Oznaczenie zadania, jako potrzebne do analizy z klientem lub w zespole.
    In Analysis:
        - → In Progress: Analiza została zakończona, wymagania są doprecyzowane i zadanie jest gotowe do realizacji.
        - → To Do: Zadanie zostało cofnięte do puli (np. zmiana priorytetów, decyzja o odłożeniu realizacji lub brak wystarczających informacji do kontynuowania w danym momencie).
        - → Pozostanie w In Analysis : Analiza jest kontynuowana (np. oczekiwanie na odpowiedź od klienta lub dodatkowe ustalenia).
    In Progress:
        - → To Do: Zadanie zostało cofnięte do puli (np. z powodu zmiany priorytetów lub konieczności zmiany zakresu).
        - → In Analysis: Zadanie wymaga omówienia z klientem potencjalnych zmian, lub należy przedyskutować to zadanie jeszcze raz z resztą zespołu.
         - → In Review: Zadanie zostało zaimplementowane i oczekuje przeglądu od innego developera.

    In Review:
        - → Done: Zadanie zostało pomyślnie zweryfikowane i zaakceptowane.
        - → In Progress: Przegląd wykazał konieczność wprowadzenia zmian deweloperskich.
        - → In Analysis: Przegląd wykazał, że zadanie powinno być ponownie przeanalizowane, bądź omówione z klientem.
    Done:
        - → Jest to stan końcowy, z którego nie ma standardowych przejść do innych aktywnych etapów pracy. W przypadku zauważenia potencjalnego błędu powinno zostać utworzone nowe podlinkowane zadanie.

 #image("kanban/statusy.png")

= 3. Limity WIP (Work In Progress)
Dla każdej kolumny tablicy Kanban przewidziano limit 6 kart (poza Done i To Do, ponieważ liczba zadań w sprincie może być większa niż 6).
Wartość ta została wybrana ze względu na 4 uczestników (minimalny limit powinien być co najmniej 4).
Ustaliliśmy, że średnio co drugi programista może mieć dwa zadania w jednym momencie w trakcie wykonywania (4 + $ 4/2$ = 6). Chcemy też tym zapewnić, by zbyt wiele zadań nie było naraz zaczętych i niedokończonych oraz, żeby zbyt wiele zadań nie czekało na review. 

= 4. Tablica Kanban
Link do tablicy Kanban: #link("https://github.com/users/VV01T3K/projects/8/views/1")[`https://github.com/users/VV01T3K/projects/8/views/1`]\
#image("kanban/kanban1.png", width: 100%)

= 5. Metryki produktywności
 - WIP (Work in Progress) - pokazuje aktualny status prac, liczbę zadań z podziałem na poszczególne stany
 - Obciążenie zespołu - pokazuje liczbę zadań w poszczególnych stanach przypisanych do pojedynczego developera.
 - Przepustowość - pokazuje liczbę zadań, które osiągnęły stan "Done" w ustalonym przedziale czasowym (np. w danym sprincie)
 - Burn up - pokazuje postęp prac nad elementami projektu w czasie. Przedstawia, ile pracy zostało już wykonane, a ile jeszcze pozostało do zrobienia.

 Dashboard z metrykami:
#link("https://github.com/users/VV01T3K/projects/8/insights/2")[`https://github.com/users/VV01T3K/projects/8/insights/2`]\
#image("kanban/kanban2.png", width: 100%)
#image("kanban/kanban3.png", width: 100%)
#image("kanban/kanban4.png", width: 100%)
#image("kanban/kanban5.png", width: 100%)
 


// #link("https://dev.azure.com/kanareklife/ResearchCruiseApp/_dashboards/dashboard/faed5d6f-a6d8-4972-b703-6877fb3c7005")[`https://dev.azure.com/kanareklife/ResearchCruiseApp/dashboards/dashboard`]