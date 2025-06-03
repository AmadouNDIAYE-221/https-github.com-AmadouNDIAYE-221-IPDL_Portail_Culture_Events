# Guide de déploiement rapide - IPDL Portail Culture Events

Ce guide te permettra d'installer et d'exécuter facilement l'application IPDL Portail Culture Events sur ton ordinateur.

## Prérequis

1. Installe Docker Desktop :
   - Windows : https://www.docker.com/products/docker-desktop
   - Mac : https://www.docker.com/products/docker-desktop
   - Linux : Utilise les commandes suivantes :
     ```
     curl -fsSL https://get.docker.com -o get-docker.sh
     sudo sh get-docker.sh
     sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
     sudo chmod +x /usr/local/bin/docker-compose
     ```

2. Vérifie que Docker fonctionne correctement en ouvrant un terminal et en tapant :
   ```
   docker --version
   ```

## Installation et lancement

1. Crée un nouveau dossier sur ton ordinateur pour l'application

2. Place le fichier `docker-compose-prod.yaml` que je t'ai envoyé dans ce dossier

3. Ouvre un terminal (Invite de commandes, PowerShell ou Terminal)

4. Navigue vers le dossier que tu as créé :
   ```
   cd chemin/vers/ton/dossier
   ```

5. Lance l'application :
   ```
   docker-compose -f docker-compose-prod.yaml up -d
   ```

6. Attends quelques instants pendant que Docker télécharge les images et démarre les conteneurs

7. Accède à l'application dans ton navigateur : http://localhost:3000

## Commandes utiles

- Pour voir les logs de l'application :
  ```
  docker-compose -f docker-compose-prod.yaml logs
  ```

- Pour arrêter l'application :
  ```
  docker-compose -f docker-compose-prod.yaml down
  ```

- Pour redémarrer l'application après l'avoir arrêtée :
  ```
  docker-compose -f docker-compose-prod.yaml up -d
  ```

## Problèmes courants

### L'application ne démarre pas
- Vérifie que Docker Desktop est bien démarré
- Vérifie que les ports 3000 et 8080 ne sont pas déjà utilisés par d'autres applications

### Page blanche ou erreurs dans l'application
- Vérifie les logs pour voir les erreurs :
  ```
  docker-compose -f docker-compose-prod.yaml logs frontend
  docker-compose -f docker-compose-prod.yaml logs backend
  ```

Si tu rencontres d'autres problèmes, n'hésite pas à me contacter !
