# 02 — PRD : Mtech Paris Events, V1

Périmètre dérivé de `01_IDEE.md` et de la demande du 6 novembre 2026. Les hypothèses restent à confirmer par l’étudiant avant une utilisation réelle.

## Identité et objectif

- **Produit :** site d’événements Mtech Paris, inspiré du parcours simple de Luma.
- **Public :** personnes intéressées par Codex, les outils d’IA, le SEO et le GEO ; clients potentiels et communauté Mtech Paris.
- **Besoin :** présenter ses rencontres et gérer des inscriptions sans paiement ni base de données complexe.
- **Objectif vérifiable :** trouver un événement et enregistrer une inscription fictive persistante dans un second JSON.

## Fonctionnalités initiales et ajout demandé

| Priorité | Fonction | Critère d’acceptation |
|---|---|---|
| P0 | Catalogue issu de `data/events.json` | Événements triés ; recherche, filtres et archives fonctionnent par URL, sans JavaScript. Une modification du JSON est visible au prochain chargement. |
| P0 | Détail d’un événement | Une adresse dédiée affiche description, programme, horaire Paris, lieu à confirmer et capacité. Un identifiant inconnu renvoie 404. |
| P0 | Inscription de démonstration | Un formulaire valide écrit dans `data/registrations.json`. Les erreurs sont affichées ; doublons, événements commencés et dépassements de capacité sont refusés côté serveur, y compris en concurrence. |
| P1 | Newsletter (ajout explicitement demandé) | `/newsletter` accepte une adresse e-mail avec consentement séparé et écrit dans `data/newsletter.json`. Doublons et saisies invalides gérés. Notice de confidentialité, coordonnées et expiration de 12 mois. Aucun envoi d’e-mail. |

**Ajout demandé : vérification humaine newsletter.** Une petite addition obligatoire, sans service tiers, est vérifiée côté serveur avant tout abonnement. Question valable dix minutes, liée au navigateur et utilisable une seule fois ; réponse absente, fausse, expirée ou rejouée refusée. Les erreurs conservent l’e-mail et le consentement et proposent une nouvelle question. Il s’agit d’une protection légère, pas d’une garantie de blocage des robots évolués.

## Parcours

1. Découvrir les rencontres, choisir un thème ou rechercher un mot.
2. Ouvrir une fiche et consulter les informations pratiques.
3. Saisir un pseudo fictif et une adresse `@example.test`, confirmer le mode démonstration et obtenir une confirmation d’écriture.

## Contraintes et décisions

- Astro explicitement demandé ; adaptateur Node pour le disque. Aucun React ni base de données.
- Français, HTML rendu côté serveur ; CSS responsive et petit script facultatif de chargement / focus.
- Serveur local sur `127.0.0.1` ; aucun service externe ou déploiement.
- Événements fictifs clairement annoncés ; aucune statistique inventée de participation.
- Gestion organisateur par édition directe du JSON ; pas d’administration publique.
- Événements en démonstration : les vraies adresses y sont refusées. Newsletter : collecte d’adresses usuelles explicitement autorisée ; responsable `Mtech`, contact `contact@mtecparis.com`, conservation `12` mois, selon les réponses de l’étudiant.
- Sur mobile jusqu’à 800 px : champs de 56 px, texte de saisie de 16 px, boutons principaux de 52 px minimum, consentement facile à sélectionner et accès direct au formulaire.
- Fichiers privés hors de `public/`, inscriptions ignorées par Git, pas de cache partagé des formulaires.

## Hors périmètre

Paiements, comptes, envoi d’e-mails, annulations d’événements, analytique, publication et multi-serveur. La collecte personnelle réelle reste hors périmètre des événements ; elle est ajoutée uniquement pour la newsletter.

## Définition de terminé

- Analyse Astro / TypeScript sans erreur ; build Node réussi.
- Tests de validation, persistance, doublons et capacité concurrente réussis.
- Tests HTTP du serveur compilé : catalogue, filtres, recherche, formulaire et erreurs.
- Mode démonstration explicite et journal factuel à jour.
- Rendu visuel et clavier à vérifier manuellement si le navigateur automatisé est indisponible.

## Hypothèses à confirmer

1. Les événements, horaires, lieux, couleurs et textes d’exemple seront remplacés ou validés par Mtech Paris.
2. L’édition manuelle du JSON suffit pour l’organisateur dans cette version.
3. La mise en ligne et les inscriptions réelles seront une étape distincte autorisée.

## Entretien de la newsletter

Le consentement conserve une date et une version. L’expiration est calculée en mois calendaires. Le nettoyage s’exécute lors de l’utilisation de la page et via `npm run newsletter:purge`. Sans trafic ni entretien, les données expirées restent sur disque : une exécution quotidienne sera nécessaire en exploitation, ainsi qu’une gestion des suppressions demandées à l’adresse de contact. Aucun envoi, double opt-in ou tâche planifiée n’est ajouté.
