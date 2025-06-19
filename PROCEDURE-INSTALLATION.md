# Procédure d'installation complète - IPDL Portail Culture Events

Ce document détaille la procédure complète pour installer et exécuter l'application, en préservant toutes les améliorations apportées au projet.

## Pour un autre utilisateur (Procédure simplifiée)

### Prérequis
- **Aucune installation de Node.js, Java ou dépendance n'est requise !**
- Installer uniquement **Docker Desktop** sur la machine (Windows/Mac/Linux)

### Étapes d'installation

1. **Recevoir le fichier**
   - Créez un dossier sur votre ordinateur (ex: `ipdl-app`)
   - Placez-y le fichier `docker-compose-prod.yaml` fourni par l'administrateur

2. **Lancer l'application**
   - Ouvrez un terminal (Invite de commandes, PowerShell ou Terminal)
   - Placez-vous dans le dossier créé
   - Exécutez :
     ```bash
     docker-compose -f docker-compose-prod.yaml up -d
     ```
   - Accédez à l'application via http://localhost:3000

### Mise à jour de l'application

Si l'administrateur vous envoie un nouveau fichier `docker-compose-prod.yaml` (ou publie une nouvelle version) :
   1. Remplacez l'ancien fichier par le nouveau
   2. Exécutez :
     ```bash
     docker-compose -f docker-compose-prod.yaml pull
     docker-compose -f docker-compose-prod.yaml up -d
     ```

### Dépannage courant

- Pour voir les logs :
  ```bash
  docker-compose -f docker-compose-prod.yaml logs
  ```
- Pour arrêter l'application :
  ```bash
  docker-compose -f docker-compose-prod.yaml down
  ```
- Pour réinitialiser la base de données (efface toutes les données) :
  ```bash
  docker-compose -f docker-compose-prod.yaml down -v
  docker-compose -f docker-compose-prod.yaml up -d
  ```
Si un problème persiste, contactez l'administrateur !

## Pour vous (Préparation avant partage)

### 1. Publier les images Docker

```bash
# Ouvrez un terminal dans le dossier du projet
cd d:\ipdl\event-management\https-github.com-AmadouNDIAYE-221-IPDL_Portail_Culture_Events

# Exécutez le script de publication
.\docker-push.bat
```

Le script vous demandera :
- Votre nom d'utilisateur DockerHub
- Vos identifiants de connexion

Une fois terminé, un fichier `docker-compose-prod.yaml` est généré. **C'est ce fichier que vous devez partager avec votre utilisateur.**

### 2. Vérification avant partage

Assurez-vous que le fichier `docker-compose-prod.yaml` généré contient :

- La référence correcte à vos images Docker : `[votre-username]/ipdl-frontend:latest` et `[votre-username]/ipdl-backend:latest`
- La configuration correcte pour l'URL de l'API : `NEXT_PUBLIC_API_URL: http://backend:8080`
- La configuration de la base de données avec les volumes appropriés

### 3. Points à vérifier avec votre utilisateur après déploiement

Pour confirmer que toutes les améliorations fonctionnent correctement, demandez à votre utilisateur de vérifier :

1. **Page d'accueil** :
   - Le formulaire de recherche fonctionne correctement
   - Les événements sont bien triés par date (prochains événements d'abord)
   - L'affichage des dates indique clairement le temps restant
   - Les cartes d'événements ont un design moderne et attractif

2. **Page de détail des destinations** :
   - Seuls les événements liés à la destination sélectionnée sont affichés
   - Le compteur d'événements affiche le nombre correct
   - La section "Informations pratiques" générique n'apparaît plus dans la sidebar

3. **Destinations sur la page d'accueil** :
   - Les vraies données des destinations sont affichées (pas de données fictives)
   - Les images sont correctement chargées
   - Les états de chargement et d'erreur sont bien gérés

## Résolution des problèmes courants

### Si les images ne se chargent pas

Vérifiez que :
- Les URLs des images dans la base de données sont correctes
- Le backend est accessible depuis le frontend via le réseau Docker

### Si les filtres ne fonctionnent pas

- Les appels API utilisent-ils les bons endpoints?
- Vérifiez les logs du backend pour détecter d'éventuelles erreurs

### Si la base de données n'est pas correctement initialisée

Pour résoudre les problèmes de base de données :

```bash
# Vérifier les logs de la base de données
docker-compose -f docker-compose-prod.yaml logs db

# Si nécessaire, réinitialiser le volume de la base de données
docker-compose -f docker-compose-prod.yaml down -v
docker-compose -f docker-compose-prod.yaml up -d
```

## Modifications futures

Si vous mettez à jour votre application, suivez cette procédure :

1. Modifiez votre code localement
2. Exécutez à nouveau le script `docker-push.bat`
3. Partagez le nouveau fichier `docker-compose-prod.yaml` avec votre    utilisateur
4. Votre utilisateur doit alors exécuter :
   ```bash
   docker-compose -f docker-compose-prod.yaml pull
   docker-compose -f docker-compose-prod.yaml up -d
   ```
