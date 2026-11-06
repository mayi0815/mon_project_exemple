# 05 — WORKLOG : JOURNAL DE TRAVAIL

Ce fichier retrace **les modifications réellement réalisées**, pas un plan fictif. Demandez à Codex de l'actualiser après chaque étape de développement ; vérifiez vous-même qu'il dit vrai.

## Modèle d'entrée — à dupliquer

### [AAAA-MM-JJ HH:MM] — [TITRE COURT DE LA TÂCHE]

- **Objectif demandé :** [OBJECTIF]
- **Prompt utilisé :** [PROMPT 1, 2, 3… / RÉFÉRENCE]
- **Fichiers modifiés :** [LISTE DES FICHIERS EFFECTIVEMENT MODIFIÉS]
- **Décisions importantes :** [CHOIX EFFECTIFS ET RAISONS]
- **Tests réellement exécutés :** [ACTION + RÉSULTAT] ou « Aucun : [RAISON] »
- **Limites / bugs :** [PROBLÈMES NON RÉSOLUS]
- **Prochaine étape :** [UNE ACTION]

---

## Journal du projet

### [À COMPLÉTER] — Démarrage

- **Objectif demandé :** Définir mon idée, mon public et mon MVP.
- **Prompt utilisé :** [À COMPLÉTER]
- **Fichiers modifiés :** [À COMPLÉTER]
- **Décisions importantes :** [À COMPLÉTER]
- **Tests réellement exécutés :** [À COMPLÉTER]
- **Limites / bugs :** [À COMPLÉTER]
- **Prochaine étape :** [À COMPLÉTER]

> **Règle :** ne cochez jamais un test comme « réussi » si vous ne l'avez pas fait. « Non testé » est une information utile.

### 2026-11-06 — Première version locale Mtech Paris

- **Objectif demandé :** construire un site Astro simple, inspiré de Luma, avec événements et inscriptions dans deux fichiers JSON, sans paiement ni base de données complexe.
- **Prompt utilisé :** demande directe de l’étudiant dans le chat ; application de `skills/ASTRO_7_ADVANCED_SKILL.md`. Le carnet `04_PROMPTS.md` n’a pas été modifié par l’agent.
- **Fichiers ajoutés :** `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `.nvmrc`, `data/events.json`, `data/registrations.json` (local ignoré), `data/registrations.example.json`, `public/favicon.svg`, `src/components/{Icon,EventArt,EventCard}.astro`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/pages/a-propos.astro`, `src/pages/404.astro`, `src/pages/evenements/[id].astro`, `src/styles/global.css`, `src/server/store.mjs`, `src/lib/dates.ts`, `src/middleware.ts`, `tests/store.test.mjs`, `tests/http.test.mjs`.
- **Fichiers modifiés :** `.gitignore`, `README.md`, `docs/02_PRD.md`, `docs/03_PLAN.md`, `docs/05_WORKLOG.md`, `docs/07_CHECKLIST.md`.
- **Décisions :** Astro 7.4.7 et adaptateur Node 11.1.11 vérifiés dans npm ; Node 25.6.1 déjà installé via Homebrew utilisé sans changer le Node 18 global. Pages à la demande pour relire les JSON. Gestion organisateur par édition des fichiers ; aucune administration publique. Affiches CSS / SVG locales, aucune police ni image distante. Mode démonstration avec pseudo fictif et domaine `@example.test` obligatoire ; aucune donnée personnelle réelle saisie par l’agent.
- **Fonctions réalisées :** catalogue, recherche insensible aux accents, thèmes, archives, événement à la une, fiches avec programme, inscription HTML persistante et confirmation. Validation serveur, refus des doublons / événements commencés / capacité dépassée, verrou inter-instance et écriture par fichier temporaire puis renommage. Contrôle d’origine actif, JSON hors de `public/`, inscriptions ignorées par Git, réponses sans cache partagé.
- **Tests réellement exécutés :** `npm install` réussi (audit initial : 0 vulnérabilité signalée) ; `npm run check` réussi, 13 fichiers, 0 erreur / avertissement / suggestion ; `npm test` : 9 tests de stockage réussis ; `npm run test:integration` : build Node puis 9 tests HTTP réussis sur le serveur compilé, avec JSON et port temporaires. Vérifiés : HTML initial, filtres, recherche, archives, état vide, tentative de sortie d’attribut HTML, écriture du formulaire sans JavaScript, disponibilité mise à jour, doublon 409, adresse réelle 400, origine étrangère 403, corps excessif 413, fichiers privés et événements inconnus 404. Aucun test n’a écrit dans les inscriptions du projet.
- **Corrections issues des tests :** les premières requêtes POST étaient refusées car l’adaptateur normalisait l’hôte en `localhost`. Autorisation explicite des seuls hôtes locaux `localhost` et `127.0.0.1`, en conservant le contrôle d’origine. Deux assertions HTTP ont été corrigées pour distinguer du texte inerte dans un attribut / script et un véritable élément HTML.
- **Limites :** outil navigateur indisponible ; ni contrôle visuel responsive ni parcours clavier ni score de performance exécuté. Programme entièrement fictif à valider. Pas de collecte réelle, e-mail, paiement, compte, annulation ou déploiement. Stockage pour un disque local persistant ; verrou éventuellement à déplacer après un arrêt brutal, après vérification de l’absence d’écritures. Les changements préexistants de l’étudiant dans `01_IDEE.md`, `04_PROMPTS.md` et `docs/prompts_amelioration/` ont été conservés ; leurs espaces finaux signalés par `git diff --check` n’ont pas été corrigés.
- **Prochaine étape :** ouvrir le site localement, vérifier le parcours sur ordinateur et à 375 px, puis valider les informations d’un premier événement.

### 2026-11-06 — Newsletter et confort mobile

- **Objectif demandé :** revoir les manques de la V1, ajouter une newsletter enregistrée en JSON, agrandir les textes et faciliter les formulaires sur mobile.
- **Décisions de l’étudiant :** préparation de la collecte de vraies adresses pour la newsletter, responsable `Mtech`, contact `contact@mtecparis.com`, durée `12 mois`. Aucun accord de publication ou d’envoi d’e-mails n’a été demandé ni supposé. Les événements restent en démonstration.
- **Fichiers ajoutés :** `data/newsletter-settings.json`, `data/newsletter.example.json`, `data/newsletter.json` (local et ignoré), `src/server/{newsletter,json-file,form}.mjs`, `scripts/newsletter-purge.mjs`, `src/components/FormFeedback.astro`, `src/pages/newsletter.astro`, `src/pages/confidentialite.astro`, `src/styles/newsletter.css`, `src/styles/mobile.css`, `tests/newsletter.test.mjs`, `docs/08_REVIEW.md`.
- **Fichiers modifiés :** `.gitignore`, `package.json`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/pages/a-propos.astro`, `src/pages/evenements/[id].astro`, `tests/http.test.mjs`, `README.md`, `docs/02_PRD.md`, `docs/03_PLAN.md`, `docs/05_WORKLOG.md`, `docs/07_CHECKLIST.md`. Aucune dépendance ajoutée. Aucun fichier personnel de prompts ou d’idée modifié par l’agent.
- **Newsletter :** un champ e-mail avec clavier adapté, consentement obligatoire non précoché, notice de confidentialité et contact de suppression. Fichier distinct des événements pour garder les finalités séparées. Normalisation et validation côté serveur, verrou inter-instance, écriture atomique, réponse identique pour les doublons afin de ne pas divulguer l’existence d’une adresse. Date / version / finalité du consentement et expiration en mois calendaires conservées. Renouveler une adresse encore active ne prolonge pas sa durée.
- **Gestion :** nettoyage des abonnements expirés à l’utilisation de la page et via `npm run newsletter:purge`, sans affichage des adresses. Aucun ordonnanceur installé : l’exploitation devra exécuter le nettoyage quotidiennement et traiter les demandes de suppression par le contact fourni. Si la configuration ou le stockage est illisible, message d’indisponibilité et formulaire fermé, sans remplacement silencieux du JSON.
- **Mobile :** champs de 56 px avec texte de 16 px jusqu’à 800 px, boutons de 52 px minimum, cases de 24 px avec libellé cliquable, textes et métadonnées agrandis, navigation sur deux lignes sur petit écran, clavier e-mail, aide visible et lien direct vers les formulaires. Illustration décorative masquée sur l’accueil du téléphone. Lecture du corps de formulaire et retour de chargement mutualisés entre événements et newsletter.
- **Tests exécutés :** `npm test` : **19 tests réussis** (9 événements, 10 newsletter / entretien) ; `npm run test:integration` : build Node réussi puis **15 tests HTTP réussis** ; `npm run check` : **0 erreur, 0 avertissement, 0 suggestion**, 19 fichiers. Vérifications : consentement absent / adresse invalide, persistance, doublons simultanés, écritures distinctes concurrentes, dates de fin de mois / année bissextile, purge via CLI sans divulgation d’e-mail, fichiers corrompus préservés, formulaire fermé en indisponibilité, isolation événement / newsletter, accès direct aux JSON en 404, origine étrangère 403 et formulaire excessif 413. `git diff --check` ciblé sur les fichiers suivis modifiés par l’agent : réussi.
- **Vérification visuelle réelle :** hôte de contrôle navigateur indisponible, mais contrôle natif de Chrome disponible. Site compilé lancé sur le port 4397 avec un dossier temporaire séparé. Newsletter examinée sur ordinateur et dans l’émulation iPhone SE **375 × 667 px** ; saisie d’une adresse fictive, Tab, sélection du consentement au clavier, envoi puis confirmation observée. Fiche événement et raccourci d’inscription examinés à 375 px. Un compte factice est présent uniquement dans le dossier temporaire de cette vérification ; les deux fichiers privés du projet sont restés vides. L’aperçu temporaire a été arrêté ; les serveurs préexistants n’ont pas été arrêtés.
- **Correction issue des tests :** un échec de purge laissait initialement la configuration chargée et donc le formulaire visible ; la configuration locale de la page est désormais désactivée en cas d’erreur de stockage. Les tests de non-régression passent après correction.
- **Limites :** pas d’envoi, de vérification de propriété d’adresse, de désinscription autonome ou de protection contre les soumissions massives pour un site public. Pas de test sur appareil physique, Safari / Firefox ou lecteur d’écran, ni d’audit juridique / de contraste complet. Pas de base de données ni de déploiement. Recommandations consignées dans `08_REVIEW.md` : valider un véritable événement, prévoir confirmation / désinscription avec le futur envoi, puis envisager un fichier calendrier `.ics` et une consultation locale des inscrits.
- **Prochaine étape :** essayer le formulaire sur un téléphone physique et valider les informations d’un premier événement réel.

### 2026-11-06 — Vérification humaine newsletter

- **Objectif demandé :** ajouter « Vérification humaine » à l’inscription newsletter.
- **Fichiers ajoutés :** `src/server/human-verification.mjs`, `tests/human-verification.test.mjs`.
- **Fichiers modifiés :** `src/pages/newsletter.astro`, `src/pages/confidentialite.astro`, `src/styles/newsletter.css`, `tests/http.test.mjs`, `package.json`, `README.md`, `docs/02_PRD.md`, `docs/03_PLAN.md`, `docs/05_WORKLOG.md`, `docs/07_CHECKLIST.md`, `docs/08_REVIEW.md`.
- **Modifications :** petite addition obligatoire sous le titre demandé, réponse contrôlée sur le serveur avant tout abonnement ; saisie numérique de 16 px dans un champ de 56 px, libellé et aide accessibles. Question valable dix minutes, liée à un cookie HttpOnly / SameSite Strict et consommée à la première tentative. Réponse fausse, absente, expirée, inventée, rejouée ou associée à un autre cookie refusée. E-mail et consentement conservés après erreur, nouvelle question proposée. Cookie supprimé après succès et expliqué dans la notice de confidentialité.
- **Architecture :** aucune dépendance, aucun compte ni service externe. Questions et réponses en mémoire du processus Node, limitées à 1 000 entrées avec élimination des anciennes questions ; rien d’ajouté au fichier des abonnés. Compatible avec le serveur local unique prévu ; un redémarrage ou un nouveau formulaire dans le même navigateur peut invalider une ancienne question.
- **Tests exécutés :** `npm test` : **24 tests réussis**, dont 5 pour la vérification humaine (réponse, usage unique, cookies, expiration et mémoire bornée). `npm run check` : **20 fichiers, 0 erreur, 0 avertissement, 0 suggestion**. Build Node réussi via `npm run test:integration`. Après correction d’une assertion de test pour reconnaître la suppression de cookie Astro par `Expires` plutôt que `Max-Age=0`, `node --test tests/http.test.mjs` sur ce build inchangé : **18 tests HTTP réussis**. Vérifiés : succès sans JavaScript, absence / erreur sans écriture newsletter, e-mail conservé, nouvelle question, cookie technique de dix minutes, rejeu refusé et maintien des parcours événement. Les tests utilisent uniquement des dossiers temporaires et des adresses fictives.
- **Limites :** protection légère contre les soumissions automatiques simples ; un robot sachant résoudre le calcul peut passer. Pas de limitation de débit générale ajoutée. Pas de nouvelle vérification visuelle ni de test sur téléphone physique pour ce bloc pendant cette tâche. Aucun déploiement ni envoi d’e-mail.
- **Prochaine étape :** essayer une réponse fausse puis correcte sur téléphone pour vérifier le confort du nouveau bloc.
