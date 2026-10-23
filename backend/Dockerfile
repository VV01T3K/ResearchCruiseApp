ARG APP_VERSION=0.0.0

FROM mcr.microsoft.com/dotnet/sdk:10.0.402-alpine3.24 AS build

ARG BUILD_CONFIGURATION=Release
ARG SENTRY_ORG="cruiseteam"
ARG SENTRY_PROJECT="backend-staging"

ENV SENTRY_ORG=$SENTRY_ORG \
    SENTRY_PROJECT=$SENTRY_PROJECT

WORKDIR /src

COPY ["global.json", "Directory.Build.props", "./"]
COPY ["ResearchCruiseApp/ResearchCruiseApp.csproj", "ResearchCruiseApp/packages.lock.json", "ResearchCruiseApp/"]
RUN dotnet restore "ResearchCruiseApp/ResearchCruiseApp.csproj" --locked-mode

COPY . .
# The restore layer above may come from cache, so audit whenever the source changes.
RUN dotnet restore "ResearchCruiseApp/ResearchCruiseApp.csproj" --force -p:CI=true
WORKDIR "/src/ResearchCruiseApp"

ARG APP_VERSION
RUN --mount=type=secret,id=sentry_auth_token,required=false \
    export SENTRY_AUTH_TOKEN=$(cat /run/secrets/sentry_auth_token 2>/dev/null || true) && \
    dotnet publish "ResearchCruiseApp.csproj" \
    -c $BUILD_CONFIGURATION \
    -o /app/publish \
    --no-restore \
    -p:Version=$APP_VERSION \
    /p:UseAppHost=false /p:OpenApiGenerateDocuments=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0.13-alpine3.24

RUN apk add --no-cache curl icu-libs tzdata

ARG APP_ENVIRONMENT="local"
ARG APP_VERSION

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    SENTRY_ENVIRONMENT=$APP_ENVIRONMENT \
    SENTRY_RELEASE=research-cruise-app-backend@$APP_VERSION

HEALTHCHECK --interval=3s --timeout=3s --start-period=5s --retries=10 CMD [ "curl",  "--fail", "http://localhost:8080/health" ]
USER $APP_UID
EXPOSE 8080
EXPOSE 8081

WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ResearchCruiseApp.dll"]
