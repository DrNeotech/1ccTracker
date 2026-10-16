# 1ccTracker
A maintained fork of doopu's original 1cc tracker made using canvas graphics. Features all Touhou games 1-20 with all progress saved in local storage. I'll be adding new games as they release and I'm always open to feature suggestions.

## Build and deploy

The app source is `src/index.ts`. Run `npm ci` followed by `npm run build` to compile it and assemble the complete static site in `dist/`.

GitHub Actions builds and deploys the site to GitHub Pages whenever changes are pushed to `main` (or when the workflow is run manually). In the repository settings, set **Pages > Build and deployment > Source** to **GitHub Actions**.