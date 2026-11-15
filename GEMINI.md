# GitHub Pages (`orlandopasion000.github.io`) Root Protection & Sub-App Isolation Rules

You MUST follow these rules whenever working with `orlandopasion000.github.io` or syncing sub-apps (`orlandotimer`, `orlandochrome`, `orlandorecharge`, etc.):

1. **Never Overwrite the Root OVPJ Homepage or Favicon**:
   - The root `index.html` and `favicon.ico` of `orlandopasion000.github.io` belong exclusively to **Sir Orlando V. Pasion, Jr. — Official Portfolio & Digital Resource Library** (with the green-ring OVPJ Masterpiece crest and test question reviewers).
   - NEVER copy a sub-app's `index.html`, `favicon.ico`, `app.js`, `style.css`, `manifest.webmanifest`, or `sw.js` into the root directory (`/`) of `orlandopasion000.github.io`.

2. **Strict Subfolder Isolation for Web Apps**:
   - Every standalone web app MUST live inside its own dedicated subdirectory in `orlandopasion000.github.io`:
     - **Orlando Timer**: `/orlandotimer/` (and `/orlandotimer.html` using `<base href="/orlandotimer/">`)
     - **OrlandoChrome**: `/orlandochrome/` (and `/orlandochrome.html` using `<base href="/orlandochrome/">`)
     - **OrlandoRecharge**: `/orlandorecharge/` (and `/orlandorecharge.html`)
   - When syncing files from a standalone app repository (such as `scratch/orlandotimer`), sync ONLY into `scratch/orlandopasion000.github.io/<app-folder>/`.

3. **Service Worker (`sw.js`) Scope Isolation**:
   - Never register a sub-app Service Worker at the root scope (`https://orlandopasion000.github.io/`).
   - Always scope each sub-app's Service Worker strictly to its own subdirectory (e.g., `navigator.serviceWorker.register('/orlandotimer/sw.js', { scope: '/orlandotimer/' })`).
