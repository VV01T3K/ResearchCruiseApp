# Użyj oficjalnego obrazu Node.js w wersji LTS jako bazowego obrazu
FROM node:lts-alpine AS production

# Ustaw katalog roboczy na /app
WORKDIR /app

# Skopiuj pliki package.json i package-lock.json do katalogu roboczego
COPY package*.json ./

# Zainstaluj zależności
RUN npm install

# Skopiuj resztę plików do katalogu roboczego
COPY . .

# Wyeksponuj port 3000, który może być używany przez aplikację
EXPOSE 3000

# Uruchom aplikację po zbudowaniu obrazu
CMD ["npm", "start"]