# Wymagania początkowe

Zainstalowany Docker

# Pliki konfiguracyjne

## **./app.env**

### Plik ten zawiera całą konfigurację potrzebną do podczas działania aplikacji.
*Przed uruchomieniem należy ustawić poprawne adresy:*

**FrontendUrl**, **JWT__ValidAudience** 
>Adres URL, który będzie zawierany w wiadomości email jako link, np. do potwierdzenia rejestracji.

**REACT_APP_API_URL**, **JWT__ValidIssuer**
>Adres IP i port API, na który aplikacja frontendowa wysyłać będzie żądania (adres widoczny dla użytkownika z zewnątrz).

**ConnectionStrings__ResearchCruiseApp-DB** 
>Adres oraz dane potrzebne do połączenia z zewnętrzną bazą danych.

<br>

*Dodatkowo należy ustawić*

**SmtpSettings__SmtpServer**, **SmtpSettings__SmtpPort**,
**SmtpSettings__SmtpUsername**, **SmtpSettings__SmtpPassword**, 
**SmtpSettings__SenderName** 
>Ustawienia Smtp niezbędne do poprawnego wysyłania maili za pomocą aplikacji.

**JWT__Secret** 
>Klucz używany do podpisywania i weryfikacji autentyczności tokenów. Najlepiej wygenerować go za pośrednictwem generatora.

**JWT__AccessTokenLifetimeSeconds** 
>Okres ważności tokenu dostępu JWT otrzymywanego podczas logowania. Wyrażony w sekundach.

**JWT__RefreshTokenLifetimeSeconds** 
>Okres ważności tokenu wykorzystywanego do odświeżenia tokenu dostępu. Wyrażony w sekundach.

**SeedDatabase**
>Informacja, czy baza danych ma zostać zasilony danymi początkowymi (`true`/`false`). Dane zostaną wstawione do bazy
> danych:
> - w przypadku ról i użytkowników – tylko jeżeli takiego wiersza nie ma jeszcze w tabeli,
> - w pozostałych przypadkach – tylko jeżeli tabela, do której ma być wstawiony wiersz, jest pusta.

## **./ResearchCruiseApp-API/ResearchCruiseApp-API/users.json**

### Jest to plik zawierający listę użytkowników, którzy zostaną dodani do serwera przy pierwszym uruchomieniu aplikacji.

*Należy w nim uwzględnić przede wszystkim administratora, choć jest także możliwość dodania innych użytkowników.*

Dostępne role w systemie to:

**Administrator**
>Administrator, ma dostęp do wszystkich danych oraz posiada dostęp do wszystkich możliwych akcji dostępnych w aplikacji.

**Shipowner**
>Konto pracownika Biura Armatora, względem administratora konto posiada ograniczenia co do dodawania nowych użytkowników oraz dezaktywacji kont.

**CruiseManager**
>Konto kierownika, posiada dostęp tylko do swoich danych oraz do danych zgłoszeń i rejsów, na których jest zastępcą, nie ma dostępu m.in. do zarządzania 
użytkownikami czy też do zmieniania danych rejsowych.

**Guest**
>Konto gościa, może zobaczyć wszystkie dane w aplikacji, lecz nic nie może zmienić.

# Pierwsze uruchomienie aplikacji

Aby uruchomić aplikację, należy poprawnie skonfigurować powyższe pliki, a następnie z poziomu terminala wykonać komendę<br>
`sudo docker-compose up -d --build` (Linux)<br>
`docker-compose up -d --build` (Windows)

*Na adresy email podane w pliku users.json zostaną wysłane automatycznie wygenerowane hasła, które następnie można zmienić po zalogowaniu się do konta*
