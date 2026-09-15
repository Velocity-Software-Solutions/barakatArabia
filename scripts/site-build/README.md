# Site generator (index2.html, index2-ar.html, projects/*)

All page text lives in `content.js` (English + Arabic side by side). To add or edit a project,
change the `PROJECTS` list there, then rebuild:

    npm install sharp
    node build-site.js <output-folder> <folder-with-project-photos>

Project photos are read as `pNN-K.jpg` (NN = the project's `src`, K = photo number).
The build writes the pages, responsive WebP images, sitemap.xml, robots.txt and .htaccess.
The shared stylesheet and script (`assets/v2/site.css`, `assets/v2/site.js`) are edited directly;
bump `V` in build-site.js after changing them so browsers fetch the new version.

## Service pages (services/*.html)

Service landing pages are built by `build-services.js` from `services-content.js`. Their styles,
icons and page script are copied from `projects/hilton-garden-inn-new-cairo(-ar).html`, so the
design stays in step with the project pages. The same script writes `sitemap.xml` (homepage,
service and project pages with hreflang pairs).

    node scripts/site-build/build-services.js          # pages + sitemap
    node scripts/site-build/build-services.js --og     # also share images (npm install sharp)

Note: the live homepage (index.html / index-ar.html) and the project pages are now hand-edited.
Don't regenerate them with build-site.js — it would overwrite those edits and the .htaccess.
