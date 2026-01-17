# Quick Start Guide

This guide will help you get the InTouch Wallet Orchestrator running on your local machine in under 5 minutes.

## Prerequisites

Before starting, ensure you have:
- **Node.js v20.x or later** installed
- **PostgreSQL v14 or later** installed and running
- **Git** installed

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/jnnanna/intouch-wallet-orchestrator.git
cd intouch-wallet-orchestrator

# Install dependencies
npm install
```

### 2. Setup PostgreSQL Database

```bash
# Create database (using psql)
createdb intouch_wallet_dev

# Or connect to PostgreSQL and create manually
psql -U postgres
CREATE DATABASE intouch_wallet_dev;
\q
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and update the DATABASE_URL
# Replace 'user' and 'password' with your PostgreSQL credentials:
# DATABASE_URL=postgresql://your_username:your_password@localhost:5432/intouch_wallet_dev
```

### 4. Initialize Database

```bash
# Run Prisma migrations to create tables
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 5. Start the Server

```bash
# Start development server
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📝 Environment: development
🔗 Health check: http://localhost:3000/health
```

### 6. Verify Installation

```bash
# Test the health endpoint
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-16T..."
}
```

## Testing the API

### Using Postman

1. Import the Postman collection from `docs/postman_collection.json`
2. Set the `base_url` variable to `http://localhost:3000`
3. Run the requests in order:
   - Register User
   - Verify OTP (use any 6-digit code, e.g., `123456`)
   - Login
   - Create Transfer

### Using cURL

```bash
# 1. Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "221771234567",
    "password": "SecurePass123"
  }'

# Check console logs for the OTP code (it will be logged)

# 2. Verify OTP (use any 6-digit code for MVP)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "221771234567",
    "code": "123456"
  }'

# Save the JWT token from the response

# 3. Create a transfer
curl -X POST http://localhost:3000/api/transfers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "sourceWallet": "WAVE",
    "destinationWallet": "ORANGE",
    "destinationPhone": "221779876543",
    "amount": 5000
  }'
```

## Common Issues

### Database Connection Error

**Error**: `Can't reach database server at localhost:5432`

**Solution**: Make sure PostgreSQL is running:
```bash
# On macOS
brew services start postgresql

# On Ubuntu/Debian
sudo service postgresql start

# On Windows (if using official PostgreSQL)
# Start PostgreSQL from Services
```

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**: Either stop the process using port 3000, or change the PORT in `.env`:
```env
PORT=3001
```

### Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**: Generate the Prisma client:
```bash
npx prisma generate
```

## Next Steps

- 📖 Read the [full README](README.md) for detailed documentation
- 🔍 Explore the [OpenAPI spec](docs/openapi.yaml) for complete API reference
- 🧪 Run tests: `npm test`
- 🎨 View database: `npm run prisma:studio`
- 📊 Check logs in the console (Winston logging)

## Development Workflow

```bash
# Run development server with auto-reload
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start production server
npm start
```

## Mock Services Behavior

### OTP Service
- Generates a random 6-digit code
- Logs the code to the console
- For testing, **any valid 6-digit code** will work

### InTouch Service
- Returns mock transaction IDs (e.g., `INT1234567890`)
- Simulates processing with 2-5 second delay
- 80% chance of success, 20% chance of failure
- Check transaction status to see final result

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure PostgreSQL is running
4. Check that `.env` is configured correctly
5. Open an issue on GitHub with details

Happy coding! 🚀


## Version française


# Guide de démarrage rapide

Ce guide vous aidera à faire fonctionner l'Orchestrateur de portefeuille InTouch sur votre machine locale en moins de 5 minutes.

## Prérequis

Avant de commencer, assurez-vous d'avoir :
- **Node.js v20.x ou ultérieur** installé
- **PostgreSQL v14 ou ultérieur** installé et en cours d'exécution
- **Git** installé

## Configuration étape par étape

### 1. Cloner et installer

```bash
# Cloner le dépôt
git clone https://github.com/your-repo/intouch-wallet-orchestrator.git
cd intouch-wallet-orchestrator
npm install
``` 
### 2. Configurer la base de données PostgreSQL

```bash
# Créer la base de données (en utilisant psql)
createdb intouch_wallet_dev
```
### 3. Configurer l'environnement

```bash
# Copier le modèle d'environnement
cp .env.example .env
# Modifier .env et mettre à jour DATABASE_URL
# Remplacez 'user' et 'password' par vos identifiants PostgreSQL :
# DATABASE_URL=postgresql://votre_utilisateur:votre_mot_de_passe@localhost:5432/intouch_wallet_dev
```
### 4. Initialiser la base de données

```bash
# Exécuter les migrations Prisma pour créer les tables
npx prisma migrate dev --name init
# Générer le client Prisma
npx prisma generate
```
### 5. Démarrer le serveur

```bash
# Démarrer le serveur de développement
npm run dev
```
Vous devriez voir :
```
🚀 Serveur en cours d'exécution sur le port 3000
📝 Environnement : développement
🔗 Vérification de l'état : http://localhost:3000/health
```
### 6. Vérifier l'installation

```bash
# Tester le point de terminaison de santé
curl http://localhost:3000/health
```
Réponse attendue :
```json
{
  "success": true,
  "message": "Le serveur fonctionne",
  "timestamp": "2026-01-16T..."
}
```
## Tester l'API

### Utilisation de Postman
1. Importez la collection Postman depuis `docs/postman_collection.json`
2. Définissez la variable `base_url` sur `http://localhost:3000`
3. Exécutez les requêtes dans l'ordre :
   - Enregistrer l'utilisateur
   - Vérifier le OTP (utilisez n'importe quel code à 6 chiffres, par exemple `123456`)
   - Se connecter
   - Créer un transfert 

### Utilisation de cURL
```bash
# 1. Enregistrer un utilisateur
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "221771234567",
    "password": "SecurePass123"
  }'
# Vérifiez les journaux de la console pour le code OTP (il sera enregistré)

# 2. Vérifier le OTP (utilisez n'importe quel code à 6 chiffres)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "221771234567",
    "code": "123456"
  }'

# Enregistrez le jeton JWT de la réponse

# 3. Créer un transfert
curl -X POST http://localhost:3000/api/transfers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "sourceWallet": "WAVE",
    "destinationWallet": "ORANGE",
    "destinationPhone": "221779876543",
    "amount": 5000
  }'
```
## Problèmes courants

### Erreur de connexion à la base de données

**Erreur** : `Impossible d'atteindre le serveur de base de données à localhost:5432`
**Solution** : Assurez-vous que PostgreSQL est en cours d'exécution :
```bash
# Sur macOS
brew services start postgresql
# Sur Ubuntu/Debian
sudo service postgresql start
# Sur Windows (si vous utilisez PostgreSQL officiel)
# Démarrez PostgreSQL à partir des Services
```
### Port déjà utilisé
**Erreur** : `Le port 3000 est déjà utilisé`
**Solution** : Arrêtez le processus utilisant le port 3000, ou changez le PORT dans `.env` :
```env
PORT=3001
```
### Client Prisma non généré
**Erreur** : `Impossible de trouver le module '@prisma/client'`
**Solution** : Générez le client Prisma :
```bash
npx prisma generate
```

## Étapes suivantes
- 📖 Lisez le [README complet](README.md) pour une documentation détaillée
- 🔍 Explorez la [spécification OpenAPI](docs/openapi.yaml) pour une référence complète de l'API
- 🧪 Exécutez les tests : `npm test`
- 🎨 Visualisez la base de données : `npm run prisma:studio`
- 📊 Vérifiez les journaux dans la console (journalisation Winston)

- 🚀 Bon codage !
