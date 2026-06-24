FROM node:20-alpine

WORKDIR /app

ENV EXPO_NO_TELEMETRY=1

RUN apk add --no-cache iproute2

COPY package*.json ./
RUN npm install --no-audit --no-fund && test -x node_modules/.bin/expo

COPY . .

EXPOSE 8082

CMD ["sh", "./docker-start.sh"]
