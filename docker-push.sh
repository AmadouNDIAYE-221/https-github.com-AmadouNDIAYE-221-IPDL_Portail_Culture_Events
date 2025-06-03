#!/bin/bash

# Définir le nom d'utilisateur DockerHub
echo "Entrez votre nom d'utilisateur DockerHub:"
read DOCKER_USERNAME

# Se connecter à DockerHub
echo "Connexion à DockerHub..."
docker login

# Construire les images
echo "Construction des images Docker..."
docker build -t $DOCKER_USERNAME/ipdl-frontend:latest ./frontend
docker build -t $DOCKER_USERNAME/ipdl-backend:latest ./backend

# Pousser les images vers DockerHub
echo "Envoi des images vers DockerHub..."
docker push $DOCKER_USERNAME/ipdl-frontend:latest
docker push $DOCKER_USERNAME/ipdl-backend:latest

echo "Images envoyées avec succès!"
echo "Vous pouvez maintenant déployer l'application avec docker-compose"

# Mettre à jour le docker-compose.yaml avec les images de DockerHub
echo "Mise à jour du docker-compose.yaml avec les images de DockerHub..."

# Créer un fichier docker-compose-prod.yaml pour l'utilisation des images de DockerHub
cat > docker-compose-prod.yaml << EOF
version: '3.8'

services:
  # Service de base de données
  db:
    image: mysql:8.0
    container_name: ipdl-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: ipdl_events
      MYSQL_USER: ipdl_user
      MYSQL_PASSWORD: ipdl_password
    ports:
      - "3306:3306"
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - ipdl-network

  # Service backend
  backend:
    image: ${DOCKER_USERNAME}/ipdl-backend:latest
    container_name: ipdl-backend
    restart: always
    depends_on:
      - db
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/ipdl_events?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
      SPRING_DATASOURCE_USERNAME: ipdl_user
      SPRING_DATASOURCE_PASSWORD: ipdl_password
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SERVER_PORT: 8080
      ALLOWED_ORIGINS: http://frontend:3000,http://localhost:3000
    ports:
      - "8080:8080"
    volumes:
      - uploads-data:/app/uploads
    networks:
      - ipdl-network

  # Service frontend
  frontend:
    image: ${DOCKER_USERNAME}/ipdl-frontend:latest
    container_name: ipdl-frontend
    restart: always
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080
    ports:
      - "3000:3000"
    networks:
      - ipdl-network

# Volumes pour la persistance des données
volumes:
  db-data:
  uploads-data:

# Réseau pour la communication entre les services
networks:
  ipdl-network:
    driver: bridge
EOF

echo "Fichier docker-compose-prod.yaml créé avec succès!"
echo "Pour déployer l'application avec les images de DockerHub, utilisez: docker-compose -f docker-compose-prod.yaml up -d"
