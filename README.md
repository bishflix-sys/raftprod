# 🏛️ Plateforme administrative municipale

### Mairie de Sébikotane · Sénégal

> Portail interne de pilotage et de gestion des services municipaux. L’application propose une interface en français, une gestion des accès par rôle et des espaces organisés autour de l’organigramme communal.

| État du projet                                        | Technologies                                   |
| ----------------------------------------------------- | ---------------------------------------------- |
| 🟡 Version initiale · données métier de démonstration | Laravel 13 · Inertia 3 · React 19 · TypeScript |

## ✨ Présentation

La plateforme fournit un point d’entrée commun aux agents et responsables de la mairie pour consulter les espaces de leur service et suivre les opérations communales.

- **Portail municipal** et page de connexion professionnelle.
- **Tableau de bord** : État civil, Finances, Services techniques, Ressources humaines et Patrimoine.
- **Espaces spécialisés** : Courrier, Comptabilité des matières, Recettes, Domaines, Voirie et travaux, Planification, Éducation/Culture/Jeunesse/Sport et Archives.
- **Accès par rôle** : contrôles côté serveur et navigation adaptée aux permissions du compte.
- **Outils de suivi** : recherche, filtres et export CSV pour les dossiers de démonstration.

## 🧰 Prérequis

- PHP **8.3+** et Composer.
- Node.js et npm (pnpm est également utilisable).
- SQLite pour le démarrage local, ou un autre moteur configuré dans `.env`.

## 🚀 Installation et démarrage

### 1. Installer les dépendances

```bash
composer install
npm install
```

### 2. Préparer l’environnement

macOS / Linux :

```bash
cp .env.example .env
touch database/database.sqlite
php artisan key:generate
```

Windows PowerShell :

```powershell
Copy-Item .env.example .env
New-Item -ItemType File -Path database/database.sqlite
php artisan key:generate
```

Vérifiez la configuration de la base dans `.env`. SQLite est configuré par défaut.

### 3. Créer les tables

```bash
php artisan migrate
```

### 4. Lancer l’application

Dans deux terminaux distincts :

```bash
php artisan serve
```

```bash
npm run dev
```

Ouvrez l’adresse affichée par Laravel, généralement [http://localhost:8000](http://localhost:8000). Le processus Vite doit pouvoir trouver `php` dans le `PATH`, car Wayfinder génère les types de routes au démarrage et pendant le build.

## 🔐 Comptes et gestion des accès

L’inscription publique est désactivée. Le compte initial doit être créé par un opérateur autorisé selon le processus de provisionnement approuvé par la mairie. Un nouveau compte porte le rôle `non_attribue` et ne peut accéder aux modules métier tant qu’un rôle ne lui a pas été affecté.

Après avoir provisionné le compte initial, attribuez-lui le rôle Maire :

```bash
php artisan municipality:assign-role adresse@mairie.sn maire
```

L’adresse doit déjà correspondre à un compte en base. Un seul compte peut porter le rôle Maire. Connecté en tant que Maire, ouvrez **Gestion des accès** dans la navigation ou rendez-vous à `/admin/access` pour affecter les autres rôles.

### Organigramme et rôles disponibles

| Division                                     | Rôles                                                                                                                                                                                           |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Exécutif local**                           | Maire · Cabinet du Maire                                                                                                                                                                        |
| **Administration générale**                  | Secrétaire Municipal · Bureau Informatique · Bureau Courrier                                                                                                                                    |
| **Administration générale et des Finances**  | Division Administration générale et des Finances · Bureau de la Comptabilité des matières · Bureau des Recettes                                                                                 |
| **Services Techniques**                      | Division Services Techniques · Bureau des Domaines, du Patrimoine et des Équipements marchands · Bureau de la Voirie, des Travaux, des Réseaux, de l’Entretien et de la Maintenance             |
| **Planification et Compétences transférées** | Division Planification et des Compétences transférées · Bureau Planification, Ressources naturelles et Développement durable · Bureau de l’Éducation, de la Culture, de la Jeunesse et du Sport |
| **État Civil et Archives**                   | Division État Civil et Archives · Bureau de l’État Civil · Bureau des Archives                                                                                                                  |

Les permissions sont définies dans `app/Support/MunicipalRoles.php`. Les routes revérifient les autorisations côté serveur; masquer une entrée de navigation ne remplace pas ce contrôle. Par mesure de protection, un utilisateur ne peut pas modifier son propre rôle et le dernier compte Maire ne peut pas être rétrogradé.

## 🧪 Tests et qualité

```bash
# Suite Laravel
php artisan test

# Vérification et lint frontend
npm run check

# Corriger le formatage frontend
npm run check:fix

# Vérifier TypeScript
npm run types:check
```

Les tests d’accès se trouvent dans `tests/Feature/MunicipalAccessTest.php`. Ils couvrent notamment les comptes sans rôle, l’accès aux modules, l’affectation des rôles et la protection du rôle Maire.

## 📦 Build de production

```bash
npm run build
```

Assurez-vous que PHP est accessible depuis le `PATH` pour permettre à Wayfinder de générer les routes TypeScript.

## 🛣️ Périmètre et évolutions

Cette version établit l’interface, le catalogue de rôles et les contrôles d’accès. Les indicateurs, notifications et dossiers affichés sont fictifs; leur création et leur export sont encore des interactions de démonstration côté navigateur.

Avant toute utilisation opérationnelle, les modules devront être reliés à des données réelles et complétés par leurs modèles, migrations, workflows, validations métier et journaux d’audit. Les rôles et permissions sont actuellement définis dans le code et ne sont pas encore administrables individuellement.

> ⚠️ **Important :** ne vous appuyez pas sur les données de démonstration pour prendre des décisions administratives ou financières.
