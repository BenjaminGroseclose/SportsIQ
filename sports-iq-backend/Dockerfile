# Stage 1: Build
FROM gradle:8.12.1-jdk21-corretto as build

WORKDIR /app

COPY build.gradle.kts settings.gradle.kts /app/

RUN gradle build

# Stage 2: Host
FROM amazoncorretto:21

COPY --from=build /app/build/libs/$ARTIFACT_NAME .
 
EXPOSE 8080
ENTRYPOINT exec java -jar ${ARTIFACT_NAME}