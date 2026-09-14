Arabic pages are generated as static HTML so they work without JavaScript and can be indexed directly.

After editing `index.html` or `home.html`, update matching strings in `arabic-translations.json`, then run from the project root:

```sh
node scripts/build-arabic.mjs
```

The generator refreshes `index-ar.html` and `home-ar.html`, reciprocal language links, canonical URLs, and language metadata. It reports any English text missing a translation. Keep brand logos, image paths, contact destinations, project years, and reported values consistent with the source pages. Shared language navigation and Arabic layout adjustments are in `assets/css/languages.css`.
