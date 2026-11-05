# MON-PROJET — Atelier Codex : de l'idée au premier utilisateur

**Starter Kit étudiant | Version française | Projet au choix**

> Votre mission : transformer **votre propre idée** en un premier prototype, puis imaginer une méthode concrète pour trouver **3 premiers utilisateurs**. Vous pouvez choisir n'importe quel projet raisonnablement réalisable en cours. Sans idée ? Inspirez-vous de l'exemple « StageRadar », une page de présentation pour un service d'aide à la recherche de stages à Paris.

## 1. Démarrage en 5 étapes

1. **Décompressez** le ZIP sur votre ordinateur. Gardez le dossier `MON-PROJET/` intact.
2. **Ouvrez l'application Codex**, sélectionnez « Open folder / Ouvrir un dossier » et choisissez `MON-PROJET/` (selon la version de l'interface).
3. **Complétez vous-même** `docs/01_IDEE.md` et `docs/02_PRD.md`. Ne laissez pas l'IA décider de votre idée à votre place.
4. Ouvrez `docs/04_PROMPTS.md` : **personnalisez** le Prompt 1, puis envoyez-le à Codex. Continuez dans l'ordre, un objectif par étape.
5. Ouvrez `src/index.html` dans votre navigateur pour voir le prototype. Testez-le, faites-le évoluer et consignez les modifications dans `docs/05_WORKLOG.md`.

**Important :** le dossier de projet contient déjà un *prototype neutre* et des documents **à compléter**. Votre travail consiste à les adapter à **votre** problème, vos utilisateurs et vos critères de réussite.

## 2. Carte du projet

```text
MON-PROJET/
├── README.md              ← Mode d'emploi
├── AGENTS.md              ← Règles persistantes pour Codex
├── docs/
│   ├── 01_IDEE.md         ← Qui ? Quel problème ? Quelle proposition de valeur ?
│   ├── 02_PRD.md          ← Fonctionnalités, critères d'acceptation
│   ├── 03_PLAN.md         ← Étapes de réalisation
│   ├── 04_PROMPTS.md      ← Prompts à personnaliser par l'étudiant
│   ├── 05_WORKLOG.md      ← Historique du travail réellement effectué
│   ├── 06_ACQUISITION.md  ← Plan pour les 3 premiers utilisateurs
│   └── 07_CHECKLIST.md    ← Tests et validation finale
├── src/
│   ├── index.html         ← Page web de départ (HTML)
│   ├── styles.css         ← Styles (CSS)
│   └── app.js             ← Interactions de démonstration (JS)
├── assets/                ← Vos images, logos et visuels autorisés
└── .gitignore
```

## 3. Règle d'or : vous êtes le chef de produit

- **L'étudiant définit** le besoin, les utilisateurs, les priorités et les limites.
- **Codex propose, crée et modifie** les fichiers en suivant vos consignes.
- **L'étudiant vérifie** : « Est-ce utile ? Est-ce fidèle à ma demande ? Est-ce que ça fonctionne ? »
- **Pas de copier-coller aveugle** du Prompt de l'exemple. Votre Prompt final doit décrire votre propre projet.

### La formule d'un bon Prompt : G-C-C-V

| Élément | Question | Exemple |
|---|---|---|
| **G — Goal** | Quel résultat concret ? | Créer une landing page fonctionnelle |
| **C — Context** | Pour qui ? Selon quels fichiers ? | Étudiants en master ; lire `02_PRD.md` |
| **C — Constraints** | Quelles limites ? | 100 % gratuit, HTML/CSS/JS, sans backend |
| **V — Vérification** | Comment valider ? | Mobile lisible ; bouton fonctionnel |

## 4. Deux façons de travailler

**Option A — Sans programmation préalable :** utilisez le prototype HTML/CSS/JS livré dans `src/`. Demandez à Codex de l'adapter à votre idée. Pas de compte externe, de clé API, de base de données ou de terminal requis pour afficher la page.

**Option B — Projet différent :** si votre PRD justifie une application, un outil, un portfolio ou un projet dans une autre technologie, demandez à Codex de **proposer d'abord** une architecture simple et d'en expliquer les prérequis. Ne changez la structure de `src/` qu'après votre validation.

## 5. Livrables attendus

- [ ] `01_IDEE.md` complété (problème, cible, solution).
- [ ] `02_PRD.md` avec **3 fonctionnalités maximum** pour le MVP.
- [ ] Au moins **2 Prompts personnalisés** dans `04_PROMPTS.md` (planification + réalisation).
- [ ] Un prototype visible, ou une démonstration honnête de l'état atteint.
- [ ] Un test réalisé et documenté dans `05_WORKLOG.md`.
- [ ] Un plan d'acquisition de **3 utilisateurs** dans `06_ACQUISITION.md`.

## 6. Sécurité et réalisme

- N'insérez jamais de mot de passe, clé API, données personnelles réelles ou informations confidentielles dans les prompts.
- Ne prétendez pas qu'un formulaire collecte des inscriptions si aucun service réel ne les enregistre.
- N'inventez pas de clients, témoignages, statistiques ni partenaires.
- Pour une collecte réelle de données, demandez une validation explicite et prévoyez l'information RGPD appropriée.
- Si vous n'avez pas accès à Codex, ces mêmes documents vous permettront de concevoir un prototype avec d'autres outils.

**Mini-défi final :** présentez votre produit en **60 secondes** : *problème → public → solution → démonstration → comment trouver vos 3 premiers utilisateurs*.
