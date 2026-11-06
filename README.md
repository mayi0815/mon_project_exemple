# Mtech Paris — Les rencontres

Première version locale du site d’événements Mtech Paris : **Astro 7.4.7**, TypeScript et adaptateur Node. Sans paiement, compte externe, base de données ou framework d’interface supplémentaire.

Parcourez les rencontres, filtrez les thèmes, recherchez un événement, consultez son programme et enregistrez une inscription de démonstration dans un fichier JSON. Une page newsletter distincte accepte les adresses e-mail usuelles avec consentement explicite.

## Démarrer

Node **22.23.4 ou supérieur** est nécessaire. Cette installation a été vérifiée avec **Node 25.6.1**. Le Node 18 sélectionné par défaut sur cet ordinateur est trop ancien.

Avec une version compatible déjà installée :

```sh
nvm use  # si vous utilisez nvm et avez installé la version de .nvmrc
npm install
npm run dev
```

Sur cet ordinateur, Node compatible est déjà disponible via Homebrew. Cette commande le sélectionne uniquement pour le terminal courant :

```sh
export PATH="/opt/homebrew/bin:$PATH"
npm run dev
```

Ouvrez **http://127.0.0.1:4321**. Astro ne se lance pas en ouvrant un fichier HTML directement.

## Les fichiers de données

- **`data/events.json`** : événements modifiables à la main. Le serveur les relit à chaque visite, sans recompilation.
- **`data/registrations.json`** : inscriptions locales. Le fichier commence vide, est créé automatiquement s’il manque, et est ignoré par Git. `data/registrations.example.json` est le modèle vide versionné.
- **`data/newsletter.json`** : abonnements à la newsletter, indépendants des événements. Fichier privé ignoré par Git ; modèle versionné : `data/newsletter.example.json`.
- **`data/newsletter-settings.json`** : coordonnées publiques de l’organisateur et durée de conservation. Valeurs fournies par l’étudiant : `Mtech`, `contact@mtecparis.com`, `12` mois. Ces valeurs sont relues sans recompilation.

Les fichiers sont hors de `public/` et ne sont pas téléchargeables sur le site. L’organisateur utilise son éditeur pour modifier les événements et consulter les inscriptions ; aucun panneau d’administration n’est nécessaire.

### Ajouter un événement

Dupliquez un objet de `data/events.json`, puis adaptez ses champs. Utilisez un `id` unique en minuscules et tirets ; il détermine l’adresse `/evenements/votre-id`.

```json
{
  "id": "mon-atelier",
  "title": "Mon atelier de démonstration",
  "subtitle": "Une rencontre pour découvrir et partager.",
  "category": "Codex & IA",
  "format": "Atelier",
  "startsAt": "2026-12-10T18:30:00+01:00",
  "endsAt": "2026-12-10T20:30:00+01:00",
  "location": "Paris · lieu à confirmer",
  "capacity": 30,
  "theme": "violet",
  "art": "build",
  "featured": false,
  "description": "Décrivez ici le contenu de la rencontre.",
  "agenda": ["18:30 — Accueil", "19:00 — Atelier"],
  "bring": "Votre ordinateur et votre curiosité."
}
```

Thèmes : `Codex & IA`, `SEO & GEO`, `Communauté`. Couleurs : `violet`, `peach`, `lime`, `blue`. Visuels : `build`, `spark`, `orbit`, `blocks`. `featured: true` met en avant le premier événement à venir correspondant. Les dates ISO indiquent `+01:00` en hiver à Paris et `+02:00` en été ; l’affichage utilise explicitement `Europe/Paris`.

### Tester une inscription

1. Ouvrez une rencontre à venir.
2. Entrez un pseudo fictif, par exemple `curieux_01`, et `curieux@example.test`.
3. Cochez la confirmation, puis envoyez le formulaire.
4. Consultez `data/registrations.json` : une ligne contient identifiant, événement, pseudo, adresse de test et date.

**Il s’agit d’une démonstration.** Seules les adresses en `@example.test` sont acceptées. Aucune place réelle n’est réservée et aucun message n’est envoyé. Ne saisissez pas de données personnelles réelles.

Les doublons sont détectés par événement et adresse normalisée. Un événement commencé ou complet refuse les inscriptions. Un verrou sur disque, puis un fichier temporaire et un renommage protègent les écritures concurrentes. Actualiser un POST peut afficher le message de doublon ; cela ne crée pas une deuxième inscription.

## Newsletter : collecte d’adresses autorisée

Ouvrez **http://127.0.0.1:4321/newsletter**. Le formulaire demande l’adresse e-mail, le consentement non précoché et la réponse à une vérification humaine. Les adresses usuelles sont acceptées ; l’agent a testé uniquement avec des adresses fictives en `@example.test`.

Le bloc **Vérification humaine** demande aussi de répondre à une petite addition. Le serveur refuse une réponse incorrecte, absente, expirée ou déjà utilisée avant tout nouvel abonnement. La question est liée au navigateur par un cookie technique `HttpOnly` / `SameSite=Strict`, valable dix minutes ; aucun prestataire externe n’est appelé. Une erreur conserve l’adresse et le consentement déjà saisis, puis propose une nouvelle question.

Cette vérification constitue un obstacle léger aux robots simples : un robot capable de résoudre l’addition peut la contourner. Les questions sont temporaires, limitées à 1 000 et conservées en mémoire dans le processus Node, sans être enregistrées dans le JSON. Un redémarrage du serveur ou l’ouverture d’un autre formulaire newsletter dans le même navigateur peut rendre une ancienne question inutilisable ; la page en propose alors une nouvelle. Une protection contre les envois massifs reste à préparer avant une ouverture publique.

Chaque abonnement conserve un identifiant, l’adresse normalisée, la date d’inscription, l’expiration après **12 mois calendaires**, et la date / version du consentement. La page `/confidentialite` explique l’utilisation des données et fournit le contact demandé. Aucun abonnement newsletter n’est créé par une inscription à un événement.

Les doublons donnent la même confirmation et ne créent pas de nouvelle ligne. Une nouvelle tentative ne prolonge pas la durée de conservation d’un abonnement encore actif. Les fichiers sont protégés par un verrou et un renommage atomique ; ils ne sont jamais exposés comme fichiers statiques.

**Aucun e-mail n’est envoyé.** Le formulaire enregistre l’intérêt pour la newsletter ; il ne vérifie pas la propriété de l’adresse par un lien de confirmation. Aucun prestataire d’envoi ou compte externe n’a été créé.

### Entretien sans base de données

```sh
npm run newsletter:purge
```

Cette commande supprime les lignes expirées et affiche uniquement les nombres d’abonnements, sans afficher les adresses. Le même nettoyage s’exécute lors de l’utilisation de la page newsletter. **Aucune tâche planifiée n’est installée** : sans visite ni commande, les lignes expirées restent sur disque. En exploitation, exécuter ce nettoyage quotidiennement, avant un éventuel envoi, et appliquer la même conservation aux copies de sauvegarde.

Pour traiter une demande de désinscription reçue à l’adresse de contact : arrêter le serveur, sauvegarder le fichier de façon protégée, retirer uniquement l’objet correspondant dans `newsletter.json`, vérifier que le JSON est valide puis redémarrer. Ne placez jamais ce fichier dans `public/`, un dépôt Git ou un partage public. Si les coordonnées de contact deviennent invalides, le formulaire se ferme avec un message d’indisponibilité.

### Confort mobile

- Texte de saisie de 16 px et champs de 56 px de hauteur jusqu’à 800 px de largeur.
- Boutons principaux d’au moins 52 px de hauteur, case à cocher de 24 px et libellé cliquable plus grand.
- Clavier e-mail, désactivation des majuscules / corrections automatiques, aide visible et erreurs annoncées.
- Navigation sur deux lignes sur petit téléphone ; raccourcis vers les formulaires ; illustration décorative masquée sur l’accueil mobile pour accéder plus vite aux événements.

Les choix de zones tactiles et de libellés s’appuient sur les [repères de taille du W3C](https://www.w3.org/WAI/WCAG21/Understanding/target-size) et son [guide des libellés de formulaire](https://www.w3.org/WAI/tutorials/forms/labels/). Cela ne constitue pas un audit complet d’accessibilité.

## Vérifier

```sh
npm run check             # Astro / TypeScript
npm test                  # 24 tests : stockage, entretien et vérification humaine
npm run test:integration  # build + 18 tests HTTP sur le vrai serveur Node
npm run build
npm start                 # version compilée sur http://127.0.0.1:4321
npm run newsletter:purge  # nettoyage local des abonnements expirés
```

Les tests HTTP utilisent des données fictives isolées et un port local temporaire. Ils ne modifient pas vos inscriptions.

## Structure

```text
data/                     Événements, inscriptions et newsletter locales
src/pages/                Catalogue, inscription, newsletter, confidentialité, à propos, 404
src/components/           Cartes, illustrations CSS et icônes SVG
src/layouts/              Structure HTML commune
src/styles/               Styles généraux, newsletter et confort mobile
src/server/               Stockage JSON, newsletter et validation des formulaires
scripts/newsletter-purge.mjs Entretien du fichier newsletter
src/lib/dates.ts          Affichage des dates en heure de Paris
tests/                    Tests du stockage et du serveur compilé
docs/                     PRD, plan, critères de validation et journal
```

Les anciens `src/index.html`, `src/styles.css` et `src/app.js` restent conservés comme prototype d’atelier. Astro utilise `src/pages/` ; ces anciens fichiers ne sont pas servis.

## Limites assumées

- Programme fictif à remplacer et faire valider avant une utilisation réelle.
- Exécution locale uniquement ; aucune publication effectuée. Aucune image, police ou script du site ne dépend d’un service externe.
- Disque persistant sur un seul ordinateur / serveur. Inadapté à l’edge, aux disques éphémères et à plusieurs serveurs. Sauvegardez les JSON privés de manière protégée avant une utilisation durable.
- Après un arrêt brutal pendant une écriture, un verrou peut rester : arrêtez toutes les instances, vérifiez qu’aucune écriture ne tourne, puis déplacez le fichier `.lock` concerné hors de `data/` avant de redémarrer.
- Aucun paiement, compte, e-mail, annulation, export, analytique ou gestionnaire d’événements dans le navigateur.
- La collecte réelle est autorisée pour la newsletter uniquement. L’étudiant a fourni les coordonnées et la durée de conservation ; notice et consentement sont intégrés. La mise en ligne, l’envoi effectif, la confirmation de l’adresse et les protections contre les inscriptions abusives restent à préparer. Aucun audit juridique complet n’est revendiqué.
- Un contrôle visuel ordinateur et à 375 px, ainsi qu’une inscription newsletter au clavier, ont été effectués dans Chrome. Les autres navigateurs, appareils physiques, lecteurs d’écran et un audit de contraste exhaustif restent à vérifier.

Pour un autre jeu de données, définissez `MTECH_DATA_DIR` avec le chemin absolu d’un dossier contenant `events.json`. Ne lancez jamais les tests sur des inscriptions réelles.

Le choix de l’adaptateur suit la [documentation officielle Astro Node](https://docs.astro.build/en/guides/integrations-guide/node/). Les deux hôtes locaux sont explicitement autorisés dans la configuration pour conserver le contrôle d’origine des formulaires.
