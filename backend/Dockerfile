FROM dhi.io/dotnet:10.0-sdk-alpine3.22 AS build

ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["./ResearchCruiseApp/ResearchCruiseApp.csproj", "ResearchCruiseApp/"]
RUN dotnet restore "ResearchCruiseApp/ResearchCruiseApp.csproj"

COPY . .
WORKDIR "/src/ResearchCruiseApp"

RUN dotnet publish "ResearchCruiseApp.csproj" \
    -c $BUILD_CONFIGURATION \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

FROM dhi.io/aspnetcore:10.0-alpine3.22

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=10 \
    CMD ["dotnet", "ResearchCruiseApp.dll", "--healthcheck"]
# USER $APP_UID // needed for images from mcr but not for dhi.io
EXPOSE 8080
EXPOSE 8081

WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ResearchCruiseApp.dll"]
