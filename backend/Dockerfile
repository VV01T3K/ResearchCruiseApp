FROM dhi.io/dotnet:10.0-sdk-alpine3.22 AS build

RUN apk add --no-cache curl

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

# Copying curl binary is a workaround for hardened images, maybe we should change the healthcheck to work differently
COPY --from=build /usr/bin/curl /usr/bin/curl

HEALTHCHECK --interval=3s --timeout=3s --start-period=5s --retries=10 CMD [ "curl", "--fail", "http://localhost:8080/health" ]
# USER $APP_UID // nedeed for images from mcr but not for dhi.io
EXPOSE 8080
EXPOSE 8081

WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ResearchCruiseApp.dll"]
