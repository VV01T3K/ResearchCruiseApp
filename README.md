# ResearchCruiseApp

The ResearchCruiseApp project is designed to manage research cruises aboard the research vessel Oceanograf, owned by the Institute of Oceanography at the University of Gdańsk.
The application aims to streamline processes related to the booking, management, and organization of research cruises, and enable efficient communication between various stakeholders.

## Configuration

### Frontend

| Environment Variable | Description                             | Example               | Required |
| -------------------- | --------------------------------------- | --------------------- | -------- |
| `API_URL`            | The address of the backend service      | `http://backend:8000` | Yes      |
| `GRAFANA_FARO_URL`   | The address of the Grafana Faro service | `http://alloy:12347`  | No       |

### Backend

| Environment Variable                    | Description                                        | Example                                                                         | Required |
| --------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------- | -------- |
| `Database__SeedAutomatically`           | Seed the database with test data                   | `true`                                                                          | No       |
| `Database__MigrateAutomatically`        | Migrate the database automatically                 | `true`                                                                          | No       |
| `Database__LogUserPasswordsWhenSeeding` | Log user passwords when seeding                    | `true`                                                                          | No       |
| `ConnectionStrings__Database`           | Database connection string                         | `db,1433;Database=ResearchCruiseApp;User Id=sa;Password=p@ssw0rd;Encrypt=False` | Yes      |
| `FrontendUrl`                           | Frontend URL - for CORS and email verification     | `http://localhost:3000`                                                         | Yes      |
| `UseOtlpExporter`                       | Whether to use the OTLP exporter for OpenTelemetry | `true`                                                                          | No       |
| `OtlpExporterEndpoint`                  | OTLP exporter endpoint                             | `http://alloy:4318` or `grpc://alloy:4317`                                      | No       |
| `SmtpSettings__SmtpServer`              | SMTP server address                                | `smtp.gmail.com`                                                                | Yes      |
| `SmtpSettings__SmtpPort`                | SMTP server port                                   | `465`                                                                           | No       |
| `SmtpSettings__SmtpUsername`            | SMTP username                                      | `example@gmail.com`                                                             | Yes      |
| `SmtpSettings__SmtpPassword`            | SMTP password                                      | `P@ssword1`                                                                     | Yes      |
| `SmtpSettings__SenderName`              | Email sender name                                  | `Biuro Armatora z jednostką r/v Oceanograf, Uniwersytet Gdański`                | No       |
| `JWT__ValidAudience`                    | JWT valid audience                                 | `https://rejsy.ug.edu.pl/`                                                      | No       |
| `JWT__ValidIssuer`                      | JWT valid issuer                                   | `https://rejsy.ug.edu.pl/`                                                      | No       |
| `JWT__AccessTokenLifetimeSeconds`       | JWT access token lifetime in seconds               | `3600`                                                                          | No       |
| `JWT__RefreshTokenLifetimeSeconds`      | JWT refresh token lifetime in seconds              | `7200`                                                                          | No       |
| `JWT__Secret`                           | JWT signing secret                                 | `JWTp@ssw0rdTwoHundredFiftySixBitsAtLeast`                                      | Yes      |

## Deployment

### Docker

The application can be run using Docker compose. Multiple configuration files are provided in the [`docker` directory](./docker/).

- `docker-compose.dev.yml` - Development configuration
- `docker-compose.infra.yml` - MS SQL Database configuration
- `docker-compose.otel.dev.yml` - Development configuration with OpenTelemetry enabled - contains Grafana, Loki, Tempo, Prometheus and Alloy
- `docker-compose.prod.yml` - Production configuration

### Kubernetes

You can also deploy the application using Kubernetes. The [`kubernetes` directory](./kubernetes/) contains the necessary configuration files, both a default and staging `kustomize` configuration.
