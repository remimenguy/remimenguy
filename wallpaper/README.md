# Spectrum Wave

Fond d'écran animé inspiré de la vague de l'app Clocks sur macOS : un ruban de cercles translucides qui passe du vert au bleu, au rose, au jaune puis à l'orange, et qui ondule lentement. La boucle dure 40 s et se répète sans coupure.

| Fichier | Usage |
| --- | --- |
| `spectrum-wave.html` | Version temps réel, nette à n'importe quelle résolution (4K, 5K, 6K) |
| `spectrum-wave-3840x2160-60fps-h264.mp4` | Vidéo 4K 60 i/s en H.264 (CRF 14), compatible avec toutes les apps |
| `render-video.cjs` | Script qui régénère la vidéo depuis la page HTML |

## Mettre en fond d'écran sur Mac

**Avec la page HTML (gratuit)** : installe [Plash](https://sindresorhus.com/plash) depuis le Mac App Store, puis ajoute un site web en choisissant le fichier local `spectrum-wave.html`. Ajoute `#clock` à la fin de l'adresse pour afficher l'heure et la date comme dans Clocks.

**Avec la vidéo** : utilise une app de fond d'écran vidéo (Backdrop, par exemple) avec le fichier MP4. C'est l'option la plus économe en batterie, car la vidéo est décodée par la puce.

## Régénérer la vidéo

Il faut Node.js et ffmpeg.

```sh
npm install playwright && npx playwright install chromium
node render-video.cjs                                   # 4K 60 i/s, H.264
node render-video.cjs --width 5120 --height 2880        # 5K pour un iMac / Studio Display
node render-video.cjs --codec h264,hevc                 # ajoute une version HEVC 10 bits
```

Les couleurs (`STOPS`), la durée de la boucle (`LOOP`), l'épaisseur (`RADIUS`) et la hauteur de la vague (`AMPLITUDE`) se règlent en haut du script de `spectrum-wave.html`.
