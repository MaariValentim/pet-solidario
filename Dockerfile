# Compila o aplicativo Spring Boot com Java 21 em uma etapa isolada.
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn --batch-mode --no-transfer-progress -DskipTests package

# A imagem final contém apenas a JVM e o JAR da aplicação.
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/pet-solidario-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
