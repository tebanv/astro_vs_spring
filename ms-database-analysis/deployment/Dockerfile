# ETAPA 1: Construcción (Build)
FROM gradle:8.5-jdk17-alpine AS build

WORKDIR /home/gradle/project

# 1. Ahora los archivos están en la raíz del contexto (../ms-database-analysis)
COPY build.gradle settings.gradle main.gradle gradle.properties lombok.config ./

# 2. Copiamos los MÓDULOS (ahora están visibles porque el contexto es el correcto)
COPY applications ./applications
COPY domain ./domain
COPY infrastructure ./infrastructure

# Ajuste de permisos
USER root
RUN chown -R gradle:gradle /home/gradle/project
USER gradle

# 3. Construimos el proyecto
RUN gradle clean bootJar --no-daemon

# ETAPA 2: Ejecución
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /home/gradle/project/applications/app-service/build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]