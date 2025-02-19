# Stage 1: Build
FROM gradle:8.12.1-jdk21-corretto as build

WORKDIR /app

COPY gradlew .
COPY gradle ./gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

RUN chmod +x ./gradlew
RUN ./gradlew dependencies --write-locks
COPY . .

RUN ./gradlew bootJar

# Stage 2: Host
FROM amazoncorretto:21

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]