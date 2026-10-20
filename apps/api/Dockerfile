# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copy Maven wrapper & POM
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Download dependencies in offline layer
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy application source code
COPY src/ src/

# Package JAR skipping tests (tests ran in CI)
RUN ./mvnw clean package -DskipTests -B

# ==========================================
# Stage 2: Production Minimal JRE Image
# ==========================================
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Create unprivileged spring user & group for security
RUN addgroup -g 10001 -S spring && \
    adduser -u 10001 -S spring -G spring && \
    mkdir -p /app/uploads && \
    chown -R spring:spring /app

USER spring:spring

# Copy built JAR from builder stage
COPY --from=builder --chown=spring:spring /build/target/placement-api-*.jar /app/app.jar

# Configuration Environment Defaults
ENV SPRING_PROFILES_ACTIVE=prod \
    SERVER_PORT=8080 \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

HEALTHCHECK --interval=20s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
