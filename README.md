# Backend
App is created using .NET 7.0

## Requirements
### Packages (can be installed using NuGet package manager integrated with the IDE):
- Microsoft.AspNetCore.OpenApi 7.0.3
- Microsoft.EntityFrameworkCore.Design 7.0.14
- Microsoft.EntityFrameworkCore.SqlServer 7.0.14
- Microsoft.EntityFrameworkCore.Tools 7.0.14
- Microsoft.VisualStudio.Web.CodeGeneration.Design 7.0.11
- Swashbuckle.AspNetCore 6.4.0

### Tools
- Docker: https://www.docker.com/products/docker-desktop/
- dotnet-ef (installation in the **project** folder, not the solution folder!):
  ```powershell
  dotnet tool install --global dotnet-ef --version 7.0.14
  ```
### Database container
Creating a Docker container from a Microsoft image:
```powershell
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=p@ssw0rd" -p 1433:1433 --name researchcruiseapp-db --hostname researchcruiseapp-db -d mcr.microsoft.com/mssql/server:2022-latest
```

## Running the application
To build and run the application choose the Docker configuration from the _Run/Debug Configurations_ list and click
the _Run_ or _Debug_ button.

## Database
### Creating a database
- Go to the _Database_ tool window.
- Choose _New_/_Connect to database_.
- Choose _Use connection string_
  - Database type: _Microsoft SQL Server_
  - String:
    ```powershell
    Server=localhost, 1433; Database=ResearchCruiseApp; User Id=sa; Password=p@ssw0rd; Encrypt=False
    ```
- Click _Connect to database_.
- Refresh the datasource.<br>![obraz](https://github.com/MichalTarnacki/_projekt_grupowy/assets/116964693/f3496ff1-0b9d-4538-8cd2-448402ba4ea3)
- From the _Microsoft SQL Server (JetBrains)_'s context menu choose _New_/_Database_ ![obraz](https://github.com/MichalTarnacki/_projekt_grupowy/assets/116964693/955a4798-310c-4792-bd46-1b9c98436b0a)
- Type the name `ResearchCruiseApp` and click _Ok_.
- From the _Microsoft SQL Server (JetBrains)_'s context menu choose _Properties_.
- Go to _Schemas_ tab and enable the _ResearchCruiseApp_ schema.
- Click _Ok_<br>![obraz](https://github.com/MichalTarnacki/_projekt_grupowy/assets/116964693/8d8734e8-c939-4403-a1e0-c0ed1c7ca9de)

### Creating and applying a migration
- In the terminal window `cd` to the **project** (not solution) folder.
- If the `Migrations` folder in the project is empty, create a migration using this command:
  ```powershell
  dotnet ef migrations add InitialCreate
  ```
- Apply the migration in the database:
  ```powershell
  dotnet ef database update
  ```
- In the database view click the dots next to the _No schemas selected_ message and choose the default schema.<br>![obraz](https://github.com/MichalTarnacki/_projekt_grupowy/assets/116964693/96f61b49-4301-4fda-99a7-8adf5fe5edee)

Now you should see the database view created accordingly to the `Data.ResearchCruiseContext` class:<br>![obraz](https://github.com/MichalTarnacki/_projekt_grupowy/assets/116964693/42f0534f-8ea2-4071-ac91-f8747a9ffc5f)

