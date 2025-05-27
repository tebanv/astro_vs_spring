# Imagen base de OpenJDK 17
FROM eclipse-temurin:17-jdk-alpine
# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app
COPY *.jar ms-database-analysis.jar
# Exponer el puerto en el que corre el servicio (ajústalo según tu app)
EXPOSE 8085
# Comando para ejecutar la aplicación
CMD ["java", "-jar", "ms-database-analysis.jar"]
