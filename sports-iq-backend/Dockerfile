# Stage 1: Build
FROM gradle:8.12.1-jdk21-corretto as backend-build

RUN mkdir /app
WORKDIR /app

COPY build.gradle.kts settings.gradle.kts ./

RUN gradle build