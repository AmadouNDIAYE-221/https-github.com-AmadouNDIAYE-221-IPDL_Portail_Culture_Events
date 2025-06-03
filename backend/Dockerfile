FROM maven:3.8.5-openjdk-17-slim AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the application
COPY src ./src
RUN mvn package -DskipTests

# Use smaller JRE image for the runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built artifact from the build stage
COPY --from=build /app/target/*.jar app.jar

# Create directory for file uploads
RUN mkdir -p /app/uploads
VOLUME /app/uploads

# Expose the port the app runs on
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
