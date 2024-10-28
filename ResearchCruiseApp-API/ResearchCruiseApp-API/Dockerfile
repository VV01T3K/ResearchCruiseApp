FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["ResearchCruiseApp-API/ResearchCruiseApp-API.csproj", "ResearchCruiseApp-API/"]
RUN dotnet restore "ResearchCruiseApp-API/ResearchCruiseApp-API.csproj"
COPY . .
WORKDIR "/src/ResearchCruiseApp-API"
RUN dotnet build "ResearchCruiseApp-API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ResearchCruiseApp-API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ResearchCruiseApp-API.dll"]
