# Guide de déploiement rapide - IPDL Portail Culture Events

Ce guide explique comment déployer et utiliser l’application **sans avoir besoin du code source** : il suffit d’utiliser le fichier `docker-compose-prod.yaml` fourni et Docker Desktop.

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

2. Place le fichier `docker-compose-prod.yaml` fourni par l’administrateur dans ce dossier

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

## Mise à jour de l’application

Si tu reçois un nouveau fichier `docker-compose-prod.yaml` (ou que l’administrateur publie une mise à jour) :
   1. Remplace l’ancien fichier par le nouveau
   2. Exécute :
      ```bash
      docker-compose -f docker-compose-prod.yaml pull
      docker-compose -f docker-compose-prod.yaml up -d
      ```

## Dépannage rapide

- Voir les logs :
  ```bash
  docker-compose -f docker-compose-prod.yaml logs
  ```
- Arrêter l’application :
  ```bash
  docker-compose -f docker-compose-prod.yaml down
  ```
- Réinitialiser la base de données (efface toutes les données) :
  ```bash
  docker-compose -f docker-compose-prod.yaml down -v
  docker-compose -f docker-compose-prod.yaml up -d
  ```

Si tu rencontres un problème, contacte l’administrateur.

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
