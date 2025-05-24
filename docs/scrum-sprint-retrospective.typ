#import "template.typ": template
#show: template.with("Retrospektywa sprintu", "1.0.0", datetime(day: 12, month: 5, year: 2025))

= 1. O projekcie i produkcie
- *Projekt*: System zarządzania rejsami statku RV Oceanograf biura Armatora Uniwersytetu Gdańskiego.
- *Produkt*: Aplikacja webowa do zarządzania rejsami statku biura Armatora Uniwersytetu Gdańskiego. 
Produkt skierowany jest do Biura Armatora oraz pracowników uczelni, którzy chcą zorganizować badawczy rejs statkiem. Aplikacja umożliwia im wypełnienie wymaganych formularzy oraz zarządzanie terminami rejsów.

= 2. Wybrana technika retrospektywy
- Gra retro na tablicy online
- Czas trwania etapu z memami: 5-15min 
- Czas trwania etapu z karteczkami: 30-40min
- Podsumowanie: 5min
Każdy z uczestników sprintu wkleja na tablicy online mema który najlepiej opisuje ostatni sprint.
Po zamieszczeniu przez każdego użytkownika mema, uczestnicy po kolei wyjaśniają go innym członkom zespołu.
Następnie przez kolejne 30-40min uczestnicy dodają wirtualne karteczki z odpowiedziami do każdego z określonych kategorii wyznaczonych przez managera projektu takie jak "Co poszło dobrze?", "Co poszło źle?", "Co warto zmienić?", "Co nas blokowało?". Po dodaniu karteczek, uczestnicy przedyskutowują odpowiedzi. na końcu przez ostatnie kilka minut manager podsumowuje retrospektywę.
następuje jedynie na wspólnych spotkaniach. Technika została wybrana za poleceniem członka zespołu deweloperskiego, którzy korzysta z niej w pracy.
#show link: it => underline(text(fill: blue)[#it])
- Link do wirtualnej tablicy retrospektywy #link("https://miro.com/welcomeonboard/NDNGT2dVWUZNdXl1SGcxUm1ma3I2NHF1U01CRkI4Yjl2a3o5c1JkWWlmYVEybnc4TjhpT2pXU0xHdlZUT0FadVJNRHRNTUxIYzlQZVR3VVZHdFJvRU4wTWF4M3FPT2hMb09lMGtnU2lVbnVRMG1rVERDMmhJaHFaQm80Uk5tQkZnbHpza3F6REdEcmNpNEFOMmJXWXBBPT0hdjE=?share_link_id=37454474098")[https://miro.com/uXjVIx2pFCQ]

= 3. Przebieg i wyniki retrospektywy
Retrospektywa odbyła się zdalnie dzień roboczy po zakończeniu sprintu czyli w tym przypadku w poniedziałek 12.05.2025, trwała godzinę.
Udział w niej brał cały zespół deweloperski (5 osób).
Moderatorem retrospektywy został Krzysztof Nasuta, a notującym Paweł Pstrągowski.
Spotkanie odbywało się na kanale głosowym Discord, a rolę wirtualnej tablicy pełnił serwis Miro. 
Każdy uczestnik dostał kilka minut na wybranie/zrobienie mema który najlepiej opisuje obecny sprint.
Gdy wszyscy wrzucili do tablicy wybrane memy, zespół po kolei je przedyskutował. Stanistaw Nieradko dodał pytania "Co poszło dobrze?", "Co poszło źle?", "Co warto zmienić?", "Co nas blokowało?", "Podziękowania.".

== Główne problemy dotyczyły:
    === Udane aspekty projektu:
        - Dobra komunikacja w zespole, szczególnie podczas spotkań.
        - Efektywne rozwiązywanie problemów technicznych na bieżąco.
        - Znalezienie i wdrożenie narzędzia do telemetrii.
    === Nieudane aspekty projektu:
        - Brak jasnych wymagań od klienta powoduje trudności implementacji.
        - Trudności w synchronizacji pracy ze względu na nienormowany czas pracy każdego z deweloperów.
        - Problemy z dostępem i destrukcyjnymi zmianamami w środowisku stagingowym przez członka zespołu.
    === Propozycje poprawy sytuacji:
        - Regularne spotkania z klientem w celu doprecyzowania wymagań.
        - Ustalenie stałych godzin pracy dla każdego z deweloperów (nawet częściowo).
        - Ograniczenie dostępu do środowiska stagingowego dla niewdrożonych członków zespołu lub/i 
          utrudnienie możliwości skasowania konta użytkownika przez jego samego.
    === Żale:
        - Brak czasu na dokładniejsze testowanie przed wdrożeniem.
        - Paweł Pstrągowski za mało czasu poświecił na zapoznanie się z środowiskiem stagingowym i frontendem oraz za spowodowanie awarii.
    === Podziękowania:
        - Podziękowania dla Bartłomieja Krawisza za przygotowanie testów na czas.
        - Podziękowania dla Stanisława Nieradko za sprawne zarządzanie i organizowanie pracy zespołu.
        - Podziękowania dla Krzysztofa Nasuty za moderowanie spotkań i utrzymywanie dobrej atmosfery.
    === Inne zagadnienia:
        - Dyskutowano o potrzebie wprowadzenia narzędzia do automatycznego testowania i udoskonalenia CI/CD.
        - Zaproponowano częstsze code review.

= 4. Zadania do wykonania - action items
    - === Ograniczenie środowiska stagingowego dla niewdrożonych członków zespołu deweloperskiego:
        Zdecydowano, że dostęp do środowiska stagingowego będzie przyznawany tylko po przejściu 
        przez proces wdrożenia i zapoznania się z funkcjonalnością.
        Powinno to zapobiec przypadkowym błędom i konfliktom.
    - === Ustalenie regularnych spotkań z klientem:
        Zespół uznał, że kluczowe jest częstsze kontaktowanie się z klientem w celu doprecyzowani wymagań. 
        Ustalono, że spotkania będą odbywać się co trzy tygodnie. 
        Wybrano tę opcję, aby zminimalizować niejasności i uniknąć częstych zmian w specyfikacji.
    - === Wprowadzenie narzędzia do automatycznego testowania: 
        Zdecydowano o poszukiwaniu narzędzia do automatyzacji testów, 
        które pomoże w szybszym i dokładniejszym testowaniu kodu przed wdrożeniem. 
        Wybrano to zadanie, aby poprawić jakość kodu i uniknąć błędów na produkcji.

= 5. Wnioski
  Technika z memami okazała się łatwa w użyciu - 
  każdy z uczestników szybko znalazł lub stworzył mema oddającego charakter sprintu. Metoda z karteczkami była prosta i zrozumiała.
  Uczestnicy wyrazili satysfakcję z tej formy retrospektywy, ale jako że większość członków nie próbowała innych metod,
  trudno porównać i zarówno subiektywnie, jak i obiektywnie ocenić jej skuteczność na tle innych.
  - Link do tablicy Kanban: #link("https://dev.azure.com/kanareklife/ResearchCruiseApp/_boards/board/t/ResearchCruiseApp%20Team/Issues")[`https://dev.azure.com/kanareklife/ResearchCruiseApp`]\
