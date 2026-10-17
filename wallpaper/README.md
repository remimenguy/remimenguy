# Fonds d'écran animés

Deux fonds d'écran animés pour Mac, chacun en page HTML temps réel et en vidéo 4K 60 i/s qui boucle sans coupure.

## Spectrum Wave

Inspiré de la vague de l'app Clocks sur macOS : un ruban de cercles translucides en forme de vague. Le ruban garde sa forme et c'est le dégradé (vert, bleu, rose, jaune, orange, puis magenta et indigo) qui avance et ondule à l'intérieur. La boucle dure 60 s et se répète sans coupure.

| Fichier | Usage |
| --- | --- |
| `spectrum-wave.html` | Version temps réel, nette à n'importe quelle résolution (4K, 5K, 6K) |
| `spectrum-wave-3840x2160-60fps-h264.mp4` | Vidéo 4K 60 i/s en H.264 (CRF 14), boucle de 60 s, compatible avec toutes les apps |
| `render-video.cjs` | Script qui régénère les vidéos depuis les pages HTML |
| `spectrum-clock.jsx` | Widget [Übersicht](https://tracesof.net/uebersicht/) : l'heure et la date comme sur l'écran Clocks |

## Kaki Bauhaus

Une composition Bauhaus en kaki militaire, noir et blanc, avec un accent ocre : un bloc de 6 × 3 grandes tuiles (quarts de cercle, demi-cercles, disques bicolores, arcs, bandes, demi-carrés) posé sur du papier blanc. Des vagues traversent la grille, depuis les coins puis depuis le centre, et chaque tuile fait un quart de tour fluide à son passage, dans le sens inverse de ses voisines comme des engrenages. La boucle dure 20 s.

| Fichier | Usage |
| --- | --- |
| `kaki-bauhaus.html` | Version temps réel |
| `kaki-bauhaus-3840x2160-60fps-h264.mp4` | Vidéo 4K 60 i/s en H.264, boucle de 20 s |

En haut du script de `kaki-bauhaus.html` : `SEED` change la disposition des tuiles, `ROWS` et `TILE` la taille de la grille, `SWEEP` et `TURN` le rythme des vagues, et les couleurs sont dans le bloc `:root`.

## Mettre en fond d'écran sur Mac

**Avec la vidéo (recommandé)** : [Phosphene](https://github.com/kageroumado/phosphene), gratuit et open source, pour macOS 26 Tahoe et plus récent. Installe-le avec `brew install --cask phosphene`, ajoute le fichier MP4, puis choisis-le dans *Réglages Système → Fond d'écran*, à côté des fonds Aerial d'Apple. Il marche aussi sur l'écran verrouillé, et la vidéo est décodée par la puce, donc ça consomme peu de batterie. Phosphene s'appuie sur une API privée d'Apple : une mise à jour de macOS peut le casser.

**Avec la page HTML (gratuit)** : installe [Plash](https://sindresorhus.com/plash) depuis le Mac App Store, puis ajoute le fichier local `spectrum-wave.html` comme site web. Ajoute `#clock` à la fin de l'adresse pour afficher l'heure et la date comme dans Clocks.

## Afficher l'heure comme dans Clocks

Installe [Übersicht](https://tracesof.net/uebersicht/) (`brew install --cask ubersicht`), puis clique sur son icône dans la barre des menus → *Open Widgets Folder* et dépose `spectrum-clock.jsx` dedans. La date et le jour s'affichent en haut à droite, l'heure en bas à droite, par-dessus le fond d'écran. En haut du fichier, `LOCALE` règle la langue (`'en-US'` pour l'anglais), `DATE_SIZE` la taille de la date, `TIME_SIZE` celle de l'heure et `TIME_BOTTOM` sa hauteur au-dessus du Dock.

## Régénérer la vidéo

Il faut Node.js et ffmpeg.

```sh
npm install playwright && npx playwright install chromium
node render-video.cjs                                   # 4K 60 i/s, H.264
node render-video.cjs --width 5120 --height 2880        # 5K pour un iMac / Studio Display
node render-video.cjs --codec h264,hevc                 # ajoute une version HEVC 10 bits
node render-video.cjs --page kaki-bauhaus.html          # le fond Bauhaus
```

Pour Spectrum Wave, les couleurs (`STOPS`), la durée de la boucle (`LOOP`), l'ondulation des couleurs (`RIPPLE`), l'épaisseur (`RADIUS`) et la hauteur de la vague (`AMPLITUDE`) se règlent en haut du script de `spectrum-wave.html`.
