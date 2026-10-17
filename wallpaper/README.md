# Spectrum Wave

Fond d'écran animé inspiré de la vague de l'app Clocks sur macOS : un ruban de cercles translucides en forme de vague. Le ruban garde sa forme et c'est le dégradé (vert, bleu, rose, jaune, orange, puis magenta et indigo) qui avance et ondule à l'intérieur. La boucle dure 60 s et se répète sans coupure.

| Fichier | Usage |
| --- | --- |
| `spectrum-wave.html` | Version temps réel, nette à n'importe quelle résolution (4K, 5K, 6K) |
| `spectrum-wave-3840x2160-60fps-h264.mp4` | Vidéo 4K 60 i/s en H.264 (CRF 14), boucle de 60 s, compatible avec toutes les apps |
| `render-video.cjs` | Script qui régénère la vidéo depuis la page HTML |
| `spectrum-clock.jsx` | Widget [Übersicht](https://tracesof.net/uebersicht/) : l'heure et la date comme sur l'écran Clocks |

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
```

Les couleurs (`STOPS`), la durée de la boucle (`LOOP`), l'ondulation des couleurs (`RIPPLE`), l'épaisseur (`RADIUS`) et la hauteur de la vague (`AMPLITUDE`) se règlent en haut du script de `spectrum-wave.html`.
