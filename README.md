# Backend
App is created using .NET 8.0

## Prerequisites
### Tools
- .NET 8.0.100 SDK: https://dotnet.microsoft.com/en-us/download/dotnet/8.0
- Docker: https://www.docker.com/products/docker-desktop/
- dotnet-ef (installation in the **project** folder, not the solution folder!):
  ```powershell
  dotnet tool install --global dotnet-ef --version 8.0.0
  ```
  
### Docker network
Creating a docker network:
```powershell
docker network create researchcruiseapp-network
```

### Database container
Create a Docker container from a Microsoft image running it the newly created network and using a Docker's named volume
```powershell
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=[MySecretPassword]" -p 1433:1433 --name researchcruiseapp-db --hostname researchcruiseapp-db --network researchcruiseapp-network -v researchcruisepp-mssql:/var/opt/mssql -d mcr.microsoft.com/mssql/server:2022-latest
```
**NOTE**: `[MySecretPassword]` should be a strong secret password.

## Database
### Creating a database
- Go to the _Database_ tool window.
- Choose _New_/_Connect to database_.
- Choose _Use connection string_
  - Database type: _Microsoft SQL Server_
  - String:
    ```powershell
    Server=localhost, 1433; User Id=sa; Password=YourStrongPassword; Encrypt=False
    ```
- Click _Connect to database_.
- Refresh the datasource.<br>![obraz](https://github.com/MichalTarnacki/_projekt_grupowy/assets/116964693/f3496ff1-0b9d-4538-8cd2-448402ba4ea3)
- From the _Microsoft SQL Server (JetBrains)_'s context menu choose _New_/_Database_ ![obraz](https://github.com/MichalTarnacki/_projekt_grupowy/assets/116964693/955a4798-310c-4792-bd46-1b9c98436b0a)
- Type the name `ResearchCruiseApp` and click _Ok_.
- Refresh the datasource again.
- From the _Microsoft SQL Server (JetBrains)_'s context menu choose _Properties_.
- Go to _Schemas_ tab and enable the _ResearchCruiseApp_ schema and its _Default schema_.<br>![obraz](https://github.com/MichalTarnacki/_projekt_grupowy/assets/116964693/7b139509-e609-4142-83d4-73cf54a082f1)
- Click _Ok_.

### Migrations
**NOTE:** You **don't have to** create any migrations when running the app for the first time. Following commands will be useful later.<br>
Creating a miration:
- In the terminal window `cd` to the **project** (not solution) folder.
- Create a migration using this command:
  ```powershell
  dotnet ef migrations add MyMigrationName --context MyContextName
  ```
Pending migrations are applied automatically when running the application.

## Configuring the user secrets
- Open the _.NET User Secrets_ window<br>![obraz](https://github.com/MichalTarnacki/_projekt_grupowy/assets/116964693/738800d4-f68e-4315-a5d5-08e64a8bed70)
- Set the user secrets:
  ```json
  {
    "ConnectionStrings": {
      "ResearchCruiseApp-DB": "Server=researchcruiseapp-db, 1433; Database=ResearchCruiseApp; User Id=sa; Password=[MySecretPassword]; Encrypt=False"
    },
    "SmtpSettings": {
      "SmtpServer": "smtp.gmail.com",
      "SmtpPort": 587,
      "SmtpUsername": "[MySecretSmtpUsername]",
      "SmtpPassword": "[MySecretSmtpPassword]",
      "SenderEmail": "[MySecretSenderEmail]",
      "SenderName": "Biuro Armatora Uniwersytetu"
    }
  }
  ```

## Running the application
- Choose the Docker configuration from the _Run/Debug Configurations_.
- Click _Run_ or _Debug_ button.
