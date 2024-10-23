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

### Cerificate for HTTPS
#### Windows
Run `dotnet dev-certs https --trust`. This will add a development cerificate for `localhost` on your computer.

#### Ubuntu
This may help: https://blog.wille-zone.de/post/aspnetcore-devcert-for-ubuntu/.

## Running the application
- Choose the Docker configuration from the _Run/Debug Configurations_.
- Click _Run_ or _Debug_ button.
