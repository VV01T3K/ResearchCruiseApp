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
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<YourStrong@Passw0rd>" -p 1433:1433 --name researchcruiseapp-db --hostname researchcruiseapp-db -d mcr.microsoft.com/mssql/server:2022-latest
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
    Server=localhost, 1433; Database=ResearchCruiseApp; User Id=sa; Password=<YourStrong@Passw0rd>; Encrypt=False
    ```
- Click _Connect to database_.
