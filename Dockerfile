# State 1: Build Frontend

FROM node:20-alpine as frontend-build

WORKDIR /app/sports-iq

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build


# Stage 2: Build Backend
FROM gradle:8.12.1-jdk21-corretto as backend-build

WORKDIR /app/sports-iq-backend

COPY . .

RUN echo ls -l

RUN gradle build ./src