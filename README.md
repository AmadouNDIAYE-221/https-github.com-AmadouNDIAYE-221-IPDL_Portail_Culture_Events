# IPDL Portail Culture Events

## 📝 Description

IPDL Portail Culture Events est une plateforme complète de gestion d'événements culturels au Sénégal. Cette application permet aux organisateurs de créer et gérer des événements culturels, aux visiteurs de découvrir des destinations touristiques et culturelles, et de participer à des événements organisés dans ces lieux.

## 🚀 Fonctionnalités principales

### 👥 Gestion des utilisateurs
- Inscription et authentification des utilisateurs
- Gestion des profils utilisateurs
- Rôles différenciés : visiteur, organisateur, administrateur

### 📍 Gestion des destinations
- Ajout, modification et suppression de destinations touristiques et culturelles
- Géolocalisation des destinations (latitude, longitude)
- Points d'intérêt avec images pour chaque destination
- Visualisation détaillée de chaque destination avec ses caractéristiques

### 🎭 Gestion des événements
- Création d'événements associés à des destinations
- Planification temporelle (date de début, date de fin)
- Catégorisation des événements
- Gestion des billets et inscriptions

### 🎟️ Gestion des inscriptions
- Inscription des utilisateurs aux événements
- Suivi des participants
- Statistiques de participation

## 💻 Technologies utilisées

### Frontend
- **Framework** : Next.js (React)
- **Rendu** : Server-side rendering et composants client
- **Styling** : Tailwind CSS
- **Formulaires** : React Hook Form avec validation Zod
- **État** : React Context API
- **Requêtes API** : Fetch API
- **Bibliothèques UI** : Composants personnalisés, Lucide React pour les icônes

### Backend
- **Framework** : Spring Boot
- **Base de données** : MySQL/PostgreSQL
- **Authentification** : JWT (JSON Web Tokens)
- **ORM** : JPA / Hibernate
- **API** : RESTful

## 🏗️ Architecture du projet

### Structure Frontend

```
frontend/
├── app/                     # Organisation par routage Next.js
│   ├── api/                 # Endpoints API côté frontend 
│   ├── dashboard/          # Interface d'administration
│   │   ├── destinations/    # Gestion des destinations
│   │   ├── events/         # Gestion des événements
│   │   └── attendees/      # Gestion des participants
│   ├── destinations/       # Pages publiques des destinations
│   └── events/             # Pages publiques des événements
├── components/             # Composants réutilisables
│   ├── ui/                 # Composants d'interface utilisateur
│   └── shared/             # Composants partagés
├── lib/                    # Utilitaires et fonctions
├── hooks/                  # Hooks React personnalisés
└── services/               # Services pour la gestion API/données
```

### Structure Backend

```
backend/
├── src/main/java/com/africaevents/
│   ├── config/             # Configuration Spring
│   ├── controller/         # Contrôleurs REST
│   ├── entity/             # Entités JPA
│   ├── repository/         # Repositories pour l'accès aux données
│   ├── service/            # Logique métier
│   ├── security/           # Configuration sécurité et JWT
│   └── util/               # Classes utilitaires
└── src/main/resources/     # Fichiers de configuration
```

## 📋 Modèles de données principaux

### Utilisateur
- id
- nom, prénom
- email, mot de passe
- rôle (VISITOR, ORGANIZER, ADMIN)

### Destination
- id
- nom, description
- pays, région
- coordonnées géographiques
- image principale
- points d'intérêt (highlights)

### Point d'intérêt (Highlight)
- nom
- description
- image

### Événement
- id
- titre, description
- date de début, date de fin
- lieu (lié à une destination)
- organisateur
- capacité, prix
- catégorie

### Inscription (Attendance)
- id
- utilisateur
- événement
- date d'inscription
- statut

## 🔧 Installation et configuration

### Prérequis
- Node.js (v16 ou supérieur)
- Java JDK 11 ou supérieur
- Maven
- MySQL/PostgreSQL

### Installation Backend

1. Cloner le dépôt
   ```bash
   git clone https://github.com/AmadouNDIAYE-221/IPDL_Portail_Culture_Events.git
   cd IPDL_Portail_Culture_Events/backend
   ```

2. Configurer la base de données dans `src/main/resources/application.properties`

3. Compiler et démarrer le serveur
   ```bash
   mvn spring-boot:run
   ```
   Le serveur sera disponible à l'adresse http://localhost:8080

### Installation Frontend

1. Naviguer vers le dossier frontend
   ```bash
   cd ../frontend
   ```

2. Installer les dépendances
   ```bash
   npm install
   ```

3. Lancer le serveur de développement
   ```bash
   npm run dev
   ```
   L'application sera disponible à l'adresse http://localhost:3000

## 🌐 API endpoints

### Authentification
- `POST /api/auth/register` : Inscription d'un utilisateur
- `POST /api/auth/login` : Connexion et génération de token JWT

### Destinations
- `GET /api/destinations` : Liste de toutes les destinations
- `GET /api/destinations/{id}` : Détails d'une destination spécifique
- `POST /api/destinations` : Création d'une nouvelle destination
- `PUT /api/destinations/{id}` : Mise à jour d'une destination
- `DELETE /api/destinations/{id}` : Suppression d'une destination

### Événements
- `GET /api/events` : Liste de tous les événements
- `GET /api/events/{id}` : Détails d'un événement spécifique
- `GET /api/destinations/{id}/events` : Événements pour une destination
- `POST /api/events` : Création d'un nouvel événement
- `PUT /api/events/{id}` : Mise à jour d'un événement
- `DELETE /api/events/{id}` : Suppression d'un événement

### Inscriptions
- `GET /api/attendances` : Liste de toutes les inscriptions
- `GET /api/attendances/{id}` : Détails d'une inscription
- `GET /api/events/{id}/attendances` : Inscrits à un événement
- `GET /api/users/{id}/attendances` : Événements auxquels un utilisateur est inscrit
- `POST /api/attendances` : Nouvelle inscription
- `DELETE /api/attendances/{id}` : Annulation d'une inscription

## 👨‍💻 Guide d'utilisation

### Navigation générale
- **Page d'accueil** : Présentation des destinations et événements populaires
- **Recherche** : Recherche de destinations ou d'événements par nom, date, catégorie
- **Destinations** : Liste et détails des destinations avec points d'intérêt
- **Événements** : Liste et détails des événements à venir

### Pour les visiteurs
1. **Inscription/Connexion** : Créer un compte ou se connecter
2. **Explorer** : Parcourir les destinations et événements
3. **Participer** : S'inscrire à un événement intéressant

### Pour les organisateurs
1. **Gestion des destinations** : Ajouter/modifier les destinations
2. **Points d'intérêt** : Ajouter des points d'intérêt avec images
3. **Création d'événements** : Créer et gérer des événements
4. **Gestion des participants** : Consulter la liste des inscrits

### Pour les administrateurs
1. **Gestion complète** : Accès à toutes les fonctionnalités
2. **Administration des utilisateurs** : Gestion des rôles et droits

## 📊 Développement et contribution

### Conventions de code
- **Nommage** : Camel case pour les variables et fonctions, Pascal case pour les composants
- **Documentation** : JSDoc pour le frontend, Javadoc pour le backend
- **Tests** : Jest pour le frontend, JUnit pour le backend

### Workflow Git
1. Créer une branche pour la fonctionnalité ou le correctif
2. Développer et tester localement
3. Soumettre une pull request avec description détaillée
4. Revue de code
5. Fusion après approbation

## 🔮 Feuille de route

### Fonctionnalités prévues
- Système de recherche avancée avec filtres multiples
- Intégration de paiement en ligne pour les billets
- Notifications par email et dans l'application
- Système de notation et commentaires pour les destinations et événements
- Application mobile avec React Native

### Améliorations techniques
- Mise en cache côté serveur pour améliorer les performances
- Migration vers une architecture microservices
- Intégration de systèmes d'analyse de données

## 📄 Licence

Copyright © 2025 IPDL

---

## Contact

Pour toute question ou suggestion concernant ce projet, veuillez contacter :
- Équipe de développement IPDL
- Email : contact@ipdl-senegal.com
