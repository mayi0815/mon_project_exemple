# 03 — Plan de réalisation : Mtech Paris V1

## Architecture retenue le 6 novembre 2026

La demande explicite d’Astro et de deux fichiers JSON autorise le passage du starter HTML à Astro avec un petit serveur Node. Les fichiers du starter et les documents personnels de l’étudiant sont conservés.

- **Routes à la demande :** `/`, `/evenements/[id]`, `/a-propos`, `/404`. Catalogue et fiches relisent le JSON pour permettre des modifications sans build.
- **Données publiques :** événements lus côté serveur et présentés en HTML ; le fichier brut n’est pas exposé.
- **Données privées :** inscriptions fictives dans `data/registrations.json` et abonnements newsletter dans `data/newsletter.json`, hors de `public/` et de Git. Deux fichiers séparés évitent de confondre participation et consentement newsletter.
- **Mutation :** POST HTML sur la fiche, validation serveur et contrôle d’origine actif.
- **Navigateur :** aucun framework hydraté ; filtre et formulaire utilisables sans JavaScript. Petit script facultatif pour le bouton d’envoi et le focus d’erreur.
- **Limite :** disque persistant et exécution locale ; pas de disque éphémère ni de déploiement en grappe.

## Étapes et fichiers

1. **Préparer Astro :** `package.json`, verrou npm, `astro.config.mjs`, `tsconfig.json`, `.nvmrc`, `.gitignore`.
2. **Créer les données et le stockage :** `data/*.json`, `src/server/store.mjs`, `src/lib/dates.ts`. Vérifier persistance et concurrence dans des dossiers temporaires.
3. **Créer l’interface :** `src/layouts/`, `src/components/`, `src/pages/`, `src/styles/global.css`, `public/favicon.svg`. Catalogue, fiche, formulaire, à propos et 404.
4. **Vérifier le runtime réel :** `src/middleware.ts`, `tests/`. Analyse de types, tests de stockage, build et tests HTTP sur le serveur Node compilé.
5. **Documenter :** README, PRD, présent plan, checklist et `05_WORKLOG.md`. Préserver `04_PROMPTS.md` et les changements existants de l’étudiant.

## Suite recommandée

Ouvrir le site à 375 px et sur ordinateur, tester le parcours au clavier, puis valider les informations d’un premier véritable événement. Avant toute collecte réelle, décider des règles de confidentialité et de conservation ; avant tout hébergement, vérifier persistance du disque et sauvegardes.

## Extension du 6 novembre 2026 — newsletter et mobile

Demande et réponses de l’étudiant : préparer la collecte de vraies adresses newsletter, responsable `Mtech`, contact `contact@mtecparis.com`, conservation `12` mois. Aucun changement de serveur ou de base de données.

1. Ajouter `/newsletter`, `/confidentialite` et les liens de navigation ; formulaire natif avec un champ e-mail et consentement séparé.
2. Ajouter `src/server/newsletter.mjs`, `json-file.mjs`, les modèles JSON et les coordonnées dans `data/newsletter-settings.json` ; verrou, normalisation, doublons et expiration en mois calendaires.
3. Mutualiser la lecture des formulaires et les états de chargement, puis adapter `src/styles/mobile.css` : texte plus grand, contrôles tactiles, aide aux champs et raccourcis vers les formulaires.
4. Ajouter `scripts/newsletter-purge.mjs` et les tests de collecte / concurrence / expiration ; tester le serveur compilé et Chrome à 375 px avec données fictives isolées.
5. Documenter le nettoyage manuel et les limites de l’envoi, mettre à jour les critères et le journal.

## Ajout de la vérification humaine newsletter

1. Ajouter `src/server/human-verification.mjs` : questions de calcul temporaires en mémoire, durée dix minutes, usage unique et association à un cookie technique ; aucune dépendance ou donnée persistante supplémentaire.
2. Modifier `src/pages/newsletter.astro` et `src/styles/newsletter.css` : groupe « Vérification humaine », saisie numérique lisible sur mobile, validation serveur et nouveau calcul après erreur. Mentionner le cookie dans `/confidentialite`.
3. Tester réponse correcte, absence, erreur, expiration, autre navigateur et rejeu, puis vérifier les inscriptions existantes et documenter les limites.
