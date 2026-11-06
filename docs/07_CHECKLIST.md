# 07 — CHECKLIST DE VALIDATION

Cochez seulement ce que vous avez **vérifié**. Notez « N/A » si un critère est sans objet.

## A. Produit et contenu

- [ ] Le titre de ma page décrit un bénéfice clair.
- [ ] Le public cible est identifiable.
- [ ] Le problème et la solution sont cohérents avec `01_IDEE.md`.
- [ ] Le site ne prétend pas avoir des clients, chiffres ou résultats imaginaires.
- [ ] La portée du prototype correspond aux priorités de `02_PRD.md`.

## B. Vérification fonctionnelle

- [ ] `src/index.html` s'ouvre dans le navigateur.
- [ ] Le bouton principal mène à la bonne section ou déclenche une action utile.
- [ ] Les liens internes pointent vers des identifiants existants.
- [ ] Aucun message d'erreur bloquant dans la console du navigateur (si vérifiable).
- [ ] Si le projet a un formulaire, il fonctionne **ou** annonce clairement qu'il s'agit d'une démonstration.

## C. Design et accessibilité

- [ ] Texte et boutons lisibles sur téléphone (environ 375 px de large).
- [ ] Lisible sur écran d'ordinateur.
- [ ] La navigation peut se faire au clavier pour les éléments principaux.
- [ ] Les images utiles ont une description alternative adaptée.
- [ ] Contraste visuel acceptable, titres hiérarchisés.

## D. Protection des données et coût

- [ ] Aucune clé API, aucun secret ni mot de passe dans les fichiers.
- [ ] Aucune collecte de données personnelles réelle à mon insu.
- [ ] Aucun service payant ajouté sans validation.
- [ ] Les fichiers générés sont compréhensibles et modifiables.

## E. Apprentissage et acquisition

- [ ] J'ai rédigé mes propres Prompts dans `04_PROMPTS.md`.
- [ ] J'ai testé au moins un critère d'acceptation de `02_PRD.md`.
- [ ] `05_WORKLOG.md` décrit les travaux et tests réels.
- [ ] `06_ACQUISITION.md` contient un plan réaliste pour 3 utilisateurs.
- [ ] Je peux présenter mon projet en 60 secondes.

## Mon compte rendu

**Ce qui marche :** [RÉPONSE]

**Ce qui ne marche pas encore :** [RÉPONSE]

**Prochaine amélioration prioritaire :** [RÉPONSE]

## Vérification de la V1 Mtech Paris — 2026-11-06

Ces résultats concernent le site Astro ; le starter `src/index.html` est conservé mais n’est plus l’application.

- [x] Catalogue et détails présents dans le HTML initial du serveur compilé.
- [x] Recherche, filtre de thème, archives et état vide vérifiés par HTTP.
- [x] POST de formulaire sans JavaScript : écriture réelle d’une inscription fictive dans un JSON temporaire.
- [x] Persistance relue par une nouvelle instance du stockage.
- [x] Doublons, données invalides, événements commencés et capacité refusés par le serveur.
- [x] Plusieurs instances concurrentes respectent la capacité et les doublons.
- [x] Origine étrangère refusée (403) et corps trop volumineux refusé (413).
- [x] Routes inconnues et fichiers JSON privés répondent 404.
- [x] Vraies adresses refusées ; données fictives isolées dans les tests.
- [x] `astro check` : aucune erreur, aucun avertissement.
- [x] Build avec l’adaptateur Node réussi et runtime compilé testé.
- [x] Aucun service payant, compte, paiement ou déploiement ajouté.
- [ ] Vérification visuelle sur ordinateur et à 375 px : navigateur indisponible pendant la session.
- [ ] Parcours manuel au clavier et contrôle de contraste dans le navigateur.
- [ ] Événements, lieux et identité visuelle validés par Mtech Paris.

Le détail des tests et des limites se trouve dans `05_WORKLOG.md`.

## Extension newsletter et mobile — 2026-11-06

- [x] Collecte newsletter explicitement autorisée par l’étudiant ; coordonnées et durée fournies : Mtech, contact@mtecparis.com, 12 mois.
- [x] Fichier newsletter séparé, privé et ignoré par Git ; aucune inscription newsletter automatique depuis un événement.
- [x] Consentement obligatoire non précoché, notice et contact de suppression disponibles.
- [x] Validation, normalisation, doublons, concurrence et expiration vérifiés avec des données fictives.
- [x] Commande de nettoyage vérifiée dans un dossier temporaire, sans afficher d’adresse.
- [x] Catalogue, fiches et inscriptions événement toujours vérifiés par les tests HTTP.
- [x] Newsletter vérifiée visuellement sur ordinateur et dans l’émulation Chrome iPhone SE, 375 × 667 px.
- [x] Inscription newsletter complétée au clavier (e-mail fictif, Tab, consentement, bouton) et confirmation observée dans Chrome.
- [x] Fiche événement et accès à l’inscription examinés à 375 px ; champs et textes agrandis.
- [ ] Vérifier sur un téléphone physique et dans Safari / Firefox.
- [ ] Effectuer un audit complet de contraste et au lecteur d’écran.
- [ ] Avant exploitation : organiser le nettoyage quotidien et les suppressions demandées ; connecter l’envoi et la confirmation de l’adresse si souhaité.

Ces contrôles complètent les limites notées lors de la première session, sans les réécrire comme si les tests visuels avaient déjà eu lieu.

## Vérification humaine newsletter — 2026-11-06

- [x] Groupe « Vérification humaine » et champ numérique obligatoire présents dans le HTML.
- [x] Bonne réponse acceptée ; réponse absente / incorrecte refusée avant ajout d’un abonnement.
- [x] Question expirée, inventée, associée à un autre cookie ou rejouée refusée.
- [x] Questions et réponses temporaires en mémoire bornée ; aucune réponse ajoutée aux données newsletter.
- [x] Cookie technique de dix minutes, HttpOnly et SameSite Strict vérifié par HTTP.
- [x] Après erreur : e-mail conservé, erreur accessible et nouvelle question disponibles.
- [ ] Vérification visuelle de ce nouveau bloc sur téléphone physique.
