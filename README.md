# Design Pilot Agent — Démonstration DSFR

Expérimentation publique utilisant exclusivement des données fictives. Aucun backend privé, aucune clé, aucun identifiant de document interne.

## Lancer

```sh
DSFR_ACCEPT_LICENSE=1 npm ci
npm start
```

Ouvrir http://127.0.0.1:4173. `npm test` vérifie les parcours et moteurs sur données fictives. `npm run build` crée `dist/` avec les véritables assets du DSFR officiel 1.15.4 auto-hébergés. Publier le contenu complet de ce dossier, y compris `dsfr/` et `engine/`. Les anciens points d'entrée `index.html` et `evaluation.html` restent disponibles dans la construction.

## Périmètre

Pilotage, projets et missions, ressources, commandes, huit sous-agents, laboratoire en trois étapes, résultats et sources fictives. Le contrôleur CRA exécute des règles déterministes sur le scénario de démonstration ; les autres sous-agents proposent un protocole manuel. Aucun orchestrateur IA n'est connecté.

Les ajouts de la session restent en mémoire et sont effacés au rechargement. Les rapports JSON sont téléchargés localement ; aucun stockage serveur. Saisir exclusivement des contenus fictifs dans cette démonstration.

Le backend et les intégrations privées restent dans le dépôt privé. La construction publique utilise une liste fermée de fichiers. Aucun appel aux API Grist n'est effectué en mode démo.

La branche de refonte est proposée à la revue ; aucun déploiement automatique n'est configuré. Les vérifications automatisées ne constituent pas une déclaration de conformité RGAA.
