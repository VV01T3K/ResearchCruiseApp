# Wymagania początkowe

Zainstalowany docker

# Pliki konfiguracyjne

## **./app.env**

### Plik ten zawiera całą konfigurację potrzebną do podczas działania aplikacji.
*Przed uruchomieniem należy ustawić poprawne adresy:*

**FrontendUrl**, **JWT__ValidAudience** 
>adres URL który będzie zawierany w wiadomości email jako link, np. do potwierdzenia rejestracji

**REACT_APP_API_URL**, **JWT__ValidIssuer**
>adres IP i port API, na który aplikacja frontendowa wysyłać będzie żądania (adres widoczny dla użytkownika z zewnątrz)

**ConnectionStrings__ResearchCruiseApp-DB** 
>adres oraz dane potrzebne do połączenia z zewnętrzną bazą danych

<br>

*Dodotkowo należy ustawić*

**SmtpSettings__SmtpServer**, **SmtpSettings__SmtpPort**,
**SmtpSettings__SmtpUsername**, **SmtpSettings__SmtpPassword**, 
**SmtpSettings__SenderName** 
>Ustawienia Smtp niezbędne do poprawnego wysyłania maili za pomocą aplikacji

**JWT__Secret** 
>klucz używany do podpisywania i weryfikacji autentyczności tokenów, najlepiej wygenerować go za pośrednictwem generatora

## **./ResearchCruiseApp-API/ResearchCruiseApp-API/users.json**

### Jest to plik zawierający listę użytkowników, którzy zostaną dodani do serwera przy pierwszym uruchomieniu aplikacji.

*Należy w nim uwzględnić przede wszystkim administratora, choć jest także możliwość dodania innych użytkowników.*

Dostępne role w systemie to:

**Administrator**
>administrator, ma dostęp do wszystkich danych oraz posiada dostęp do wszystkich możliwych akcji dostępnych w aplikacji

**Shipowner**
>konto pracownika Biura Armatora, względem administratora, konto posiada ograniczenia co do dodawania nowych użytkowników oraz dezaktywacji kont

**CruiseManager**
>konto kierownika, posiada dostęp tylko do swoich danych oraz do danych zgłoszeń i rejsów, na których jest zastępcą, nie ma dostępu m.in do zarządzania 
użytkownikami czy też do zmieniania danych rejsowych

**Guest**
>konto gościa, może zobaczyć wszystkie dane w aplikacji, lecz nic nie może zmienić

# Pierwsze uruchomienie aplikacji

Aby uruchomić aplikację należy poprawnie skonfigurować powyższe pliki a następnie z poziomu terminala wykonać komendę
``` sudo docker-compose up -d ``` (linux)
``` docker-compose up -d ``` (windows)

*Na adresy email podane w pliku users.json zostaną wysłane automatycznie wygenerowane hasła, które następnie można zmienić po zalogowaniu się do konta*
