#import "template.typ": template
#show: template.with("Retrospektywa sprintu", "1.0.0", datetime(day: 17, month: 5, year: 2026))

= 1. O projekcie i produkcie
- *Projekt:* Opracowanie systemu do zarządzania rejsami statku RV Oceanograf dla Biura Armatora Uniwersytetu Gdańskiego.
- *Produkt:* Aplikacja internetowa wspierająca organizację i obsługę rejsów statku należącego do Biura Armatora Uniwersytetu Gdańskiego. Narzędzie jest przeznaczone zarówno dla pracowników Biura Armatora, jak i kadry uczelni planującej rejsy badawcze. Umożliwia ono m.in. wypełnianie niezbędnych formularzy oraz koordynację harmonogramu rejsów.

= 2. Wybrana technika retrospektywy
Wybraną techniką retrospektywy była retrospektywa typu 4L (Liked, Learned, Lacked, Longed for). Metoda ta polega na zebraniu opinii naszego zespołu w czterech obszarach:

- Liked – co podobało się podczas sprintu,
- Learned – czego zespół nauczył się w trakcie pracy,
- Lacked – czego zabrakło podczas realizacji sprintu,
- Longed for – czego zespół oczekiwał lub co chciałby usprawnić w kolejnych sprintach.

Technika została przeprowadzona w formie spotkania zdalnego na tablicy z karteczkami. Każdy z nas mógł również się swobodnie wypowiedzieć na dowolny temat dotyczący projektu. Wybraliśmy tą metodę ze względu na możliwość użycia AI oraz prostotę i intuicyjność metody.

Etapy retrospektywy:
- Wstęp : Zwierze sprintu - Przyrównywaliśmy nasze działania w trakcie sprintu, a następnie AI generowało zwierzaki na podstawie naszych opisów. Pomogło to w rozluźnieniu atmosfery.
- Karteczki 4L - Każdy miał czas na wpisanie od siebie karteczek, które następnie wspólnie omówiliśmy łącznie z powiązanymi tematami.
- Podsumowanie i przegląd AI. - Ostatnie zdania od każdego z zespołu oraz analiza wygenerowanych przez AI treści.
- Czas trwania: ok. 40 min
- Link do wirtualnej tablicy retrospektywy #link("https://miro.com/app/board/uXjVHSt7YvQ=/")[https://miro.com/app/board/uXjVHSt7YvQ=/]
- Źródło opisu: #link("https://www.teamretro.com/retrospectives/4ls-retrospective/")[https://www.teamretro.com/retrospectives/4ls-retrospective/]
#image("retro/panda.png", width: 40%)



= 3. Przebieg i wyniki retrospektywy
Retrospektywa odbyła się zdalnie po zakończeniu sprintu w piątek 15.05.2026, trwała około 40 minut.
Udział w niej brał cały zespół deweloperski (4 osoby).
Moderatorem retrospektywy został Wojciech Siwiec, a notującym Bartosz Łyskanowski.
Spotkanie odbywało się na kanale głosowym Discord, a rolę wirtualnej tablicy pełnił serwis Miro z templatką do typu retrospektywy 4L.
Każdy uczetnik miał kilka minut na dodanie karteczek w poszczególnych etapach.
Gdy wszyscy dodali na tablicy karteczki, zaczeliśmy omówienie ich.

== Główne wnioski z retrospektywy:

=== Ulubione aspekty
- Spotkania z promotorem i zainteresowanymi projektem.
- Dobra komunikacja w zespole, szczególnie podczas spotkań.
- Efektywne rozwiązywanie problemów technicznych na bieżąco.

=== Nowości / pogłębione tematy 

- Znalezienie i omówienie narzędzia do obserwowalności aplikacji.
- Znalezienie nowych błędów związanych z uprawnieniami użytkowników.

=== Problemy w projekcie
- Zanikający kontakt z klientem.
- Szybsze / częstsze code review.
- Tworzenie dokumentacji do pracy inżynierskiej.

=== Pragnienia w projekcie
- Zwiększenie liczby spotkań z klientem.
- Dokładniejsze omawianie poszczególnych zadań.
- Wydobycie bardziej precyzyjnych wymagań do implementacji.
- Dostarczona przez klienta dokumentacja opisująca poszczególne role i uprawnienia.

=== Przykladowa analiza AI

#image("retro/podsumowanie_ai.png", width: 100%)


= 4. Zadania do wykonania - action items
    - === Ustalenie regularnych spotkań z klientem:
        Zespół uznał, że kluczowe jest częstsze kontaktowanie się z klientem w celu doprecyzowania wymagań. 
        Ustalono, że spotkania powinny odbywać się chociaż raz w miesiącu. 
        Wybrano tę opcję, aby zminimalizować niejasności i zwiększyć liczbę szczegółowo opisanych wymagań.
    - === Wprowadzenie narzędzia do obserowalności: 
        Zdecydowano o wdrożeniu narzędzia HyperDX, które pomoże w analizie działania systemu poprzez zbieranie i korelowanie logów, oraz metryk z aplikacji.
        Narzędzie będzie wykorzystywane  do identyfikowania trudnych do odtworzenia błędów, które pojawiają się tylko w środowisku produkcyjnym lub w specyficznych warunkach użytkowników.
        Dzięki temu będziemy mogli sprawniej diagnozować problemy, skrócić czas reakcji na incydenty oraz zwiększyć stabilność systemu.
    - === Zadania zasugerowane przez podsumowanie AI

= 5. Wnioski
Zastosowana technika retrospektywy 4L okazała się prostą i skuteczną metodą podsumowania sprintu. Podział na cztery obszary pozwolił uporządkować opinie zespołu oraz ułatwił identyfikację zarówno pozytywnych aspektów pracy, jak i problemów wymagających poprawy. Dzięki temu każdy uczestnik mógł w łatwy sposób przedstawić swoje spostrzeżenia. Ćwiczenie rozgrzewkowe, jak i AI pomogło w skupieniu się i bardziej zachęciło do udziału w retrospektywie przez zabawny aspekt. Metoda okazała się bardzo przyjemna i prosta w przeprowadzeniu oraz luźnej atmosferze.