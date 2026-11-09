# Aktualizacja produkcji z wersji 2.4.0 do 3.2.0

Aktualizacja przebiega jak poprzednie, ale zmienia się konfiguracja. Prosimy o użycie plików
`compose.production.yaml` i `.env` z tej paczki zamiast dotychczasowego pliku Compose lub o
dostosowanie dotychczasowego według załącznika.

## 1. Kopia zapasowa

Nowa wersja zmienia strukturę bazy. Przed aktualizacją prosimy wykonać kopię zapasową bazy
`ResearchCruiseApp`.

## 2. Plik `.env`

Do uzupełnienia są trzy wartości, reszta jest już wpisana.

**`DB_CONNECTION_STRING`**: ciąg połączenia używany obecnie (wartość `ConnectionStrings__Database`
kontenera backendu), w pojedynczych apostrofach:

```
DB_CONNECTION_STRING='Server=host.docker.internal,1433;Database=ResearchCruiseApp;User Id=<user>;Password=<password>;Encrypt=False'
```

**`JWT_SECRET`**: nowy losowy klucz, co najmniej 32 znaki. Ustawia się go raz; po zmianie użytkownicy
muszą zalogować się ponownie.

```
openssl rand -base64 48
```

**`SMTP_PASSWORD`**: hasło konta pocztowego aplikacji. Przekażemy je osobno.

## 3. Zatrzymanie obecnej wersji

```
docker compose -f <dotychczasowy plik> down
```

Nowe kontenery mają te same nazwy i porty co dotychczasowe.

## 4. Uruchomienie

```
docker compose -f compose.production.yaml --env-file .env pull
docker compose -f compose.production.yaml --env-file .env up -d
```

Backend przy pierwszym starcie sam aktualizuje strukturę bazy.

## 5. Sprawdzenie

```
docker compose -f compose.production.yaml ps
```

Backend powinien mieć stan `healthy`. Jeśli się restartuje, `docker logs researchcruiseapp-backend`
podaje nazwę brakującego lub błędnego ustawienia.

W przeglądarce:

- [ ] na pasku nawigacji widać wersję 3.2.0,
- [ ] można się zalogować i otworzyć dowolne zgłoszenie,
- [ ] „Zapomniałeś hasła?” na stronie logowania wysyła wiadomość e-mail,
- [ ] przycisk „Zgłoś problem” w prawym dolnym rogu wysyła testowe zgłoszenie. Prosimy o informację
      po jego wysłaniu, abyśmy mogli potwierdzić, że dotarło.

## 6. Po udanej aktualizacji

W pliku `.env` prosimy zmienić `DATABASE_APPLY_MIGRATIONS` na `false`. Jeśli przyszła wersja będzie
wymagać zmiany struktury bazy, backend nie wystartuje i napisze to w logach. Wtedy wystarczy kopia
zapasowa i jeden start z wartością `true`.

## Kolejne aktualizacje

Zmiana `APP_VERSION` w pliku `.env` na nowy tag i polecenia z kroku 4.

## Powrót do wersji 2.4.0

`docker compose -f compose.production.yaml down`, odtworzenie kopii bazy z kroku 1 i uruchomienie
dotychczasowego pliku Compose.

---

## Załącznik: konfiguracja bez plików z paczki

Ta część dotyczy tylko wdrożenia bez `.env` lub bez `compose.production.yaml`.

`compose.production.yaml` czyta zmienne także ze środowiska powłoki, więc można pominąć
`--env-file .env` i dostarczyć je inaczej.

Bez tego pliku Compose wartości trzeba przekazać kontenerom pod nazwami, które odczytują aplikacje.
Te nazwy różnią się od nazw w `.env`:

Backend:

| Wartość z `.env`            | Nazwa zmiennej w kontenerze             | Zmiana względem 2.4.0                      |
| --------------------------- | --------------------------------------- | ------------------------------------------ |
| `DB_CONNECTION_STRING`      | `ConnectionStrings__Database`           | bez zmian                                  |
| `FRONTEND_URL`              | `FrontendUrl`                           | bez zmian                                  |
| `JWT_SECRET`                | `JWT__Secret`                           | nowa, wymagana                             |
| `SMTP_USERNAME`             | `SmtpSettings__SmtpUsername`            | nowa, wymagana                             |
| `SMTP_PASSWORD`             | `SmtpSettings__SmtpPassword`            | nowa, wymagana                             |
| `DATABASE_APPLY_MIGRATIONS` | `Database__ApplyMigrations`             | zastępuje `Database__MigrateAutomatically` |
| zawsze `false`              | `Database__SeedAccountsAutomatically`   | zastępuje `Database__SeedAutomatically`    |
| zawsze `false`              | `Database__LogUserPasswordsWhenSeeding` | bez zmian                                  |
| `SENTRY_DSN_BACKEND`        | `Sentry__Dsn`                           | nowa, opcjonalna                           |
| `SENTRY_TRACES_SAMPLE_RATE` | `Sentry__TracesSampleRate`              | nowa, opcjonalna                           |

Frontend:

| Wartość z `.env`                     | Nazwa zmiennej w kontenerze          | Zmiana względem 2.4.0 |
| ------------------------------------ | ------------------------------------ | --------------------- |
| zawsze `http://backend:8080/`        | `API_URL`                            | bez zmian             |
| `SENTRY_DSN_FRONTEND`                | `SENTRY_DSN`                         | nowa, opcjonalna      |
| `SENTRY_TRACES_SAMPLE_RATE`          | `SENTRY_TRACES_SAMPLE_RATE`          | nowa, opcjonalna      |
| `SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | `SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | nowa, opcjonalna      |
