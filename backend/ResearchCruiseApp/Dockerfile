FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["nuget.config", "nuget.config"]
COPY ["Directory.Build.props", "Directory.Build.props"]
COPY ["ResearchCruiseApp/ResearchCruiseApp.csproj", "ResearchCruiseApp/"]
COPY ["ResearchCruiseApp/packages.lock.json", "ResearchCruiseApp/"]
RUN dotnet restore "ResearchCruiseApp/ResearchCruiseApp.csproj" --locked-mode -p:CI=true
COPY . .
WORKDIR "/src/ResearchCruiseApp"
RUN dotnet build "ResearchCruiseApp.csproj" -c $BUILD_CONFIGURATION -o /app/build --no-restore

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ResearchCruiseApp.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ResearchCruiseApp.dll"]
