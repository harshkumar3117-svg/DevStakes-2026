# Stage 1: Build karo Maven se
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Sirf JAR run karo (chhoti image)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# H2 data folder
RUN mkdir -p /app/data

EXPOSE 8080
ENTRYPOINT ["java", "-Xmx400m", "-Xms200m", "-jar", "app.jar"]
