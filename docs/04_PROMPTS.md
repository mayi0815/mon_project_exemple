# 04 — MON CARNET DE PROMPTS

**Travail individuel obligatoire.** Copiez les modèles dans Codex **après les avoir personnalisés**. Remplacez les `[CHAMPS]` et complétez chaque section « Mon Prompt final ». Les prompts ci-dessous sont des **points de départ**, pas des réponses prêtes à rendre.

## Modèle à retenir — G / C / C / V

- **Goal (objectif) :** quel résultat précis ?
- **Context (contexte) :** pour quel utilisateur et selon quels fichiers ?
- **Constraints (contraintes) :** quelles limites techniques, visuelles, budgétaires ?
- **Vérification :** comment saurai-je que c'est réussi ?

---

## PROMPT 1 — Analyser et planifier (sans coder)

```text
Lis docs/01_IDEE.md et docs/02_PRD.md.
Je travaille sur MTECH EVENT ORGANISER pour mes clients potentiels.
Le problème principal est d'avoir un outil qui va nous aider à manager les evenements crée par Mtech.

Objectif de cette étape : 

Contraintes : 


Ne modifie pas encore le code. Identifie les informations manquantes,
pose au maximum 3 questions importantes, puis propose un plan de 3 à 5
étapes avec les fichiers concernés et des critères de validation.
Indique les éventuels risques ou hypothèses.
```

**Mon Prompt final 1 (rédigé par moi) :**

> [ÉCRIRE ICI VOTRE VERSION PERSONNALISÉE]

**Ce que Codex a compris / ce que j'ai corrigé :** [RÉPONSE]

---

## PROMPT 2 — Construire le MVP

```text
Lis AGENTS.md, docs/02_PRD.md et docs/03_PLAN.md.
Construis la première version de [MON PRODUIT] pour [MA CIBLE].
Priorité aux fonctions [FONCTION 1] et [FONCTION 2].

Utilise [HTML/CSS/JS OU TECHNOLOGIES JUSTIFIÉES].
Style souhaité : [STYLE].
Ne crée aucun service payant, compte ou clé API.
N'ajoute pas de fonctionnalités non prévues dans le PRD.

Modifie les fichiers nécessaires, explique brièvement les choix faits,
puis vérifie [CRITÈRE 1] et [CRITÈRE 2] quand c'est possible.
Ne prétends pas avoir fait un test non exécuté.
À la fin, mets à jour docs/05_WORKLOG.md.
```

**Mon Prompt final 2 :**

> [ÉCRIRE ICI VOTRE VERSION PERSONNALISÉE]

**Fichiers que je m'attends à voir modifiés :** [RÉPONSE]

---

## PROMPT 3 — Tester et corriger

```text
Vérifie mon prototype à partir de docs/02_PRD.md et docs/07_CHECKLIST.md.
Je souhaite contrôler en priorité [FONCTION / SCÉNARIO].

Liste d'abord les problèmes par ordre d'importance.
Corrige uniquement [PROBLÈME CONCRET] sans modifier le reste du design.
Effectue les tests possibles et précise lesquels tu n'as pas pu exécuter.
Documente les changements dans docs/05_WORKLOG.md.
```

**Mon Prompt final 3 :**

> [ÉCRIRE ICI VOTRE VERSION PERSONNALISÉE]

**Test manuel que j'ai réellement réalisé :** [RÉSULTAT]

---

## PROMPT 4 — Améliorer la proposition de valeur (optionnel)

```text
Agis comme un spécialiste UX et copywriting.
Mon public cible est [PUBLIC] ; son problème est [PROBLÈME].
Relis docs/01_IDEE.md et le texte de src/index.html.

Propose 3 variantes de titre principal : claires, honnêtes,
sans promesse invérifiable. Explique la différence entre elles.
Ne modifie rien avant que je choisisse une variante.
```

**Ma variante choisie et pourquoi :** [RÉPONSE]

---

## PROMPT 5 — Trouver les trois premiers utilisateurs (optionnel)

```text
Lis docs/01_IDEE.md et docs/06_ACQUISITION.md.
Je veux rencontrer 3 utilisateurs potentiels de [NOM DU PROJET]
à [VILLE / CAMPUS / COMMUNAUTÉ].

Propose :
1. Deux canaux d'acquisition réalistes et à faible coût.
2. Un message de prise de contact individualisé et non trompeur.
3. Trois questions d'entretien centrées sur leur problème.
4. Un indicateur simple pour mesurer l'intérêt réel.

Ne collecte aucune donnée, n'envoie aucun message à ma place,
ne fabrique pas de contacts ou d'adresses e-mail.
Respecte les règles applicables à la prospection et à la vie privée.
```

**Mon Prompt final 5 :**

> [ÉCRIRE ICI VOTRE VERSION PERSONNALISÉE]

---

## EXEMPLE COMPLET — À NE PAS COPIER TEL QUEL

*Projet fictif « StageRadar » : une landing page pour tester l'intérêt des étudiants de master à Paris pour un outil d'organisation de recherche de stages.*

```text
Lis AGENTS.md, docs/01_IDEE.md et docs/02_PRD.md.

Goal : crée une landing page responsive pour « StageRadar ».
Context : nous voulons tester l'intérêt d'étudiants en master à Paris
pour un futur outil qui organiserait leurs candidatures de stage.
Le service n'existe pas encore : la page ne doit pas prétendre le contraire.

Contraintes : HTML, CSS et JavaScript uniquement ; 0 € ;
aucun backend ; aucune donnée personnelle collectée ;
pas de faux témoignage, de logos de partenaires ou de chiffres inventés.
Sections : titre clair, 3 bénéfices, fonctionnement en 3 étapes,
FAQ et bouton « Découvrir le concept » qui défile vers le fonctionnement.
Le style doit être sobre, lisible et adapté aux mobiles.

Vérification : src/index.html s'ouvre localement ; le bouton défile
vers la bonne section ; la FAQ est accessible au clavier ;
la page est lisible sur un écran de 375 px.

Avant de coder, résume les changements prévus. Puis modifie
src/index.html, src/styles.css, src/app.js. Note dans docs/05_WORKLOG.md
les tests réellement effectués et les tests restant à faire.
```

**À vous :** pourquoi ce Prompt est-il plus utile que « Fais-moi un site pour une startup » ? Réponse : [À ÉCRIRE]

---

## Retour d'expérience

1. **Un Prompt trop vague que j'ai amélioré :** [AVANT → APRÈS]
2. **Une réponse de Codex que j'ai refusée ou corrigée :** [POURQUOI]
3. **Une consigne de vérification que j'ajouterai la prochaine fois :** [RÉPONSE]
