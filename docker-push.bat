@echo off
setlocal

REM Définir le nom d'utilisateur DockerHub
set /p DOCKER_USERNAME=Entrez votre nom d'utilisateur DockerHub: 

REM Se connecter à DockerHub
echo Connexion à DockerHub...
docker login

REM Construire les images
echo Construction des images Docker...
docker build -t %DOCKER_USERNAME%/ipdl-frontend:latest .\frontend
docker build -t %DOCKER_USERNAME%/ipdl-backend:latest .\backend

REM Pousser les images vers DockerHub
echo Envoi des images vers DockerHub...
docker push %DOCKER_USERNAME%/ipdl-frontend:latest
docker push %DOCKER_USERNAME%/ipdl-backend:latest

echo Images envoyées avec succès!
echo Vous pouvez maintenant déployer l'application avec docker-compose

REM Créer un fichier docker-compose-prod.yaml pour l'utilisation des images de DockerHub
echo Création du fichier docker-compose-prod.yaml...

(
echo version: '3.8'
echo.
echo services:
echo   # Service de base de données
echo   db:
echo     image: mysql:8.0
echo     container_name: ipdl-db
echo     restart: always
echo     environment:
echo       MYSQL_ROOT_PASSWORD: root
echo       MYSQL_DATABASE: ipdl_events
echo       MYSQL_USER: ipdl_user
echo       MYSQL_PASSWORD: ipdl_password
echo     ports:
echo       - "3306:3306"
echo     volumes:
echo       - db-data:/var/lib/mysql
echo     networks:
echo       - ipdl-network
echo.
echo   # Service backend
echo   backend:
echo     image: %DOCKER_USERNAME%/ipdl-backend:latest
echo     container_name: ipdl-backend
echo     restart: always
echo     depends_on:
echo       - db
echo     environment:
echo       SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/ipdl_events?useSSL=false^&allowPublicKeyRetrieval=true^&serverTimezone=UTC
echo       SPRING_DATASOURCE_USERNAME: ipdl_user
echo       SPRING_DATASOURCE_PASSWORD: ipdl_password
echo       SPRING_JPA_HIBERNATE_DDL_AUTO: update
echo       SERVER_PORT: 8080
echo       ALLOWED_ORIGINS: http://frontend:3000,http://localhost:3000
echo     ports:
echo       - "8080:8080"
echo     volumes:
echo       - uploads-data:/app/uploads
echo     networks:
echo       - ipdl-network
echo.
echo   # Service frontend
echo   frontend:
echo     image: %DOCKER_USERNAME%/ipdl-frontend:latest
echo     container_name: ipdl-frontend
echo     restart: always
echo     depends_on:
echo       - backend
echo     environment:
echo       NEXT_PUBLIC_API_URL: http://backend:8080
echo     ports:
echo       - "3000:3000"
echo     networks:
echo       - ipdl-network
echo.
echo # Volumes pour la persistance des données
echo volumes:
echo   db-data:
echo   uploads-data:
echo.
echo # Réseau pour la communication entre les services
echo networks:
echo   ipdl-network:
echo     driver: bridge
) > docker-compose-prod.yaml

echo.
echo Fichier docker-compose-prod.yaml créé avec succès!
echo Pour déployer l'application avec les images de DockerHub, utilisez: docker-compose -f docker-compose-prod.yaml up -d

pause
