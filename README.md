# Backend
App is created using .NET 8.0

## Requirements
### SDK
- .NET 8.0.100 SDK

### Packages (can be installed using NuGet package manager integrated with the IDE):
- Microsoft.AspNetCore.OpenApi 8.0.0
- Microsoft.EntityFrameworkCore.Design 8.0.0
- Microsoft.EntityFrameworkCore.SqlServer 8.0.0
- Microsoft.EntityFrameworkCore.Tools 8.0.0
- Microsoft.VisualStudio.Web.CodeGeneration.Design 8.0.0
- Swashbuckle.AspNetCore 6.4.0

### Tools
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
Creating a Docker container from a Microsoft image and running it in the newly created network:
```powershell
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=p@ssw0rd" -p 1433:1433 --name researchcruiseapp-db --hostname researchcruiseapp-db --network researchcruiseapp-network -d mcr.microsoft.com/mssql/server:2022-latest
```

## Database
### Creating a database
- Go to the _Database_ tool window.
- Choose _New_/_Connect to database_.
- Choose _Use connection string_
  - Database type: _Microsoft SQL Server_
  - String:
    ```powershell
    Server=localhost, 1433; User Id=sa; Password=p@ssw0rd; Encrypt=False
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

## Running the application
- Choose the Docker configuration from the _Run/Debug Configurations_.
- Click _Run_ or _Debug_ button.
