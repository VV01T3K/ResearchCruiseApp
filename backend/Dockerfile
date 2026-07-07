FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build

ARG BUILD_CONFIGURATION=Release
ARG SENTRY_ORG="cruiseteam"
ARG SENTRY_PROJECT="backend-staging"

ENV SENTRY_ORG=$SENTRY_ORG \
    SENTRY_PROJECT=$SENTRY_PROJECT

WORKDIR /src

COPY ["./ResearchCruiseApp/ResearchCruiseApp.csproj", "ResearchCruiseApp/"]
RUN dotnet restore "ResearchCruiseApp/ResearchCruiseApp.csproj"

COPY . .
WORKDIR "/src/ResearchCruiseApp"

RUN --mount=type=secret,id=sentry_auth_token,required=false \
    export SENTRY_AUTH_TOKEN=$(cat /run/secrets/sentry_auth_token 2>/dev/null || true) && \
    dotnet publish "ResearchCruiseApp.csproj" \
    -c $BUILD_CONFIGURATION \
    -o /app/publish \
    --no-restore \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine

RUN apk add --no-cache curl icu-libs tzdata

ARG APP_ENVIRONMENT="local"
ARG SENTRY_RELEASE

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    SENTRY_ENVIRONMENT=$APP_ENVIRONMENT \
    SENTRY_RELEASE=$SENTRY_RELEASE

HEALTHCHECK --interval=3s --timeout=3s --start-period=5s --retries=10 CMD [ "curl",  "--fail", "http://localhost:8080/health" ]
USER $APP_UID
EXPOSE 8080
EXPOSE 8081

WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ResearchCruiseApp.dll"]
