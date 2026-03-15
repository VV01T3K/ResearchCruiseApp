#import "template.typ": template
#show: template.with("Tablica Kanban", "1.0.0", datetime(day: 6, month: 5, year: 2025))

= 1. O projekcie i produkcie
- *Projekt*: System zarządzania rejsami statku RV Oceanograf biura Armatora Uniwersytetu Gdańskiego.
- *Produkt*: Aplikacja webowa do zarządzania rejsami statku biura Armatora Uniwersytetu Gdańskiego. 
Produkt skierowany jest do Biura Armatora oraz pracowników uczelni, którzy chcą zorganizować badawczy rejs statkiem. Aplikacja umożliwia im wypełnienie wymaganych formularzy oraz zarządzanie terminami rejsów.

= 2. Stany zgłoszeń/zadań
Lista stanów:
- To Do - Stan, w którym znajdują się zadania oczekujące na rozpoczęcie. Zadanie przechodzi do stanu "Blocked", gdy napotka przeszkody uniemożliwiające jego realizację, lub do "In Progress", gdy zostanie podjęta decyzja o jego rozpoczęciu.
- Blocked - Stan, w którym zadanie jest zablokowane i wymaga rozwiązania problemu m.in wykonanie innego zadania uprzednio. Po usunięciu blokady zadanie wraca do stanu "To Do" lub przechodzi do "In Progress", jeśli blokada została usunięta w trakcie pracy nad nim.
- In Progress - Stan, w którym zadanie jest aktywnie realizowane. Po zakończeniu pracy nad zadaniem przechodzi ono do stanu "Test".
- Test - Stan, w którym zadanie jest weryfikowane pod kątem poprawności i zgodności z wymaganiami. Po pozytywnym przejściu testów zadanie trafia do stanu "In Review".
- In Review - Stan, w którym zadanie jest weryfikowane przez osoby odpowiedzialne za akceptację zmian. Po zatwierdzeniu zadanie przechodzi do stanu "Done".
- Done - Stan, w którym zadanie zostało zakończone i zaakceptowane. Zadanie pozostaje w tym stanie jako zakończone.

Możliwe przejścia między stanami:

    To Do:
        - → In Progress: Rozpoczęcie pracy nad zadaniem.
        - → Blocked: Zidentyfikowano przeszkodę uniemożliwiającą rozpoczęcie zadania.

    Blocked:
        - → To Do: Przeszkoda została usunięta, a zadanie nie było jeszcze w trakcie realizacji; wraca do puli zadań do wykonania.
        - → In Progress: Przeszkoda została usunięta, a zadanie było wcześniej w trakcie realizacji lub może teraz zostać rozpoczęte.
        - → Test: Przeszkoda została usunięta, a zadanie było wcześniej w trakcie testowania.
        - → In Review: Przeszkoda została usunięta, a zadanie było wcześniej w trakcie przeglądu.

    In Progress
        - → Test: Zakończono etap implementacji lub wykonania zadania i jest ono gotowe do testów.
        - → Blocked: Zidentyfikowano przeszkodę w trakcie realizacji zadania.
        - (Rzadziej) → To Do: Zadanie zostało cofnięte do puli (np. z powodu zmiany priorytetów lub konieczności fundamentalnej zmiany zakresu).

    Test
        - → In Review: Testy zakończyły się pomyślnie, zadanie jest gotowe do przeglądu.
        - → In Progress: Testy wykazały błędy lub niezgodności, zadanie wymaga poprawek.
        - → Blocked: Zidentyfikowano przeszkodę uniemożliwiającą kontynuację testów.

    In Review:
        - → Done: Zadanie zostało pomyślnie zweryfikowane i zaakceptowane.
        - → In Progress: Przegląd wykazał konieczność wprowadzenia zmian deweloperskich.
        - → Blocked: Zidentyfikowano przeszkodę uniemożliwiającą zakończenie przeglądu.
    Done:
        - → Jest to zazwyczaj stan końcowy, z którego nie ma standardowych przejść do innych aktywnych etapów pracy.

#image("kanban-board/mermaid.png")

= 3. Limity WIP (Work In Progress)
Dla każdej kolumny tablicy Kanban przewidziano limit 8 kart (Poza To Do i Done).
Wartość ta została wybrana ze względu na 5 uczestników (minimalny limit powinien być co najmniej 5).
Co drugi programista może mieć dwa zadania w jednym momencie w trakcie wykonwywania (5 + 5/2 = 7.5). 

= 4. Tablica Kanban
Link do tablicy Kanban: #link("https://dev.azure.com/kanareklife/ResearchCruiseApp/_boards/board/t/ResearchCruiseApp%20Team/Issues")[`https://dev.azure.com/kanareklife/ResearchCruiseApp`]\
#image("kanban-board/1.png", width: 80%)

= 5. Metryki produktywności
- Czas realizacji
- Czas Cyklu
- WIP (Work in Progress)
- Przepustowość
- Wskaźnik ukończenia zadań
- Czas przetwarzania w stanie

Dashboard z metrykami:
#link("https://dev.azure.com/kanareklife/ResearchCruiseApp/_dashboards/dashboard/faed5d6f-a6d8-4972-b703-6877fb3c7005")[`https://dev.azure.com/kanareklife/ResearchCruiseApp/dashboards/dashboard`]