# BraveVest Web

React + Vite frontend for the BraveVest marketplace.

## Dev

```
npm install
npm run dev
```

→ http://localhost:5173 (BrowserRouter-style URLs in dev)

## Production — GitHub Pages

This app is deployed to **GitHub Pages** at:

    https://<your-username>.github.io/BraveVest/

Because GH Pages is a **static host** with no server-side rewrite rules:

- **Routing uses `HashRouter`** — URLs look like `/#/marketplace/foo`.
  Do NOT switch back to `BrowserRouter` unless you move to Vercel/Netlify/Cloudflare.
- **`vite.config.js` sets `base: '/BraveVest/'`** during CI.
  If you rename the GitHub repo, update `REPO_NAME` in the workflow too.
- **`public/404.html`** redirects deep links (`/marketplace/foo`) to hash routes.
- **`public/.nojekyll`** disables Jekyll so `_next`-style files aren't stripped.

## Deploy

Automatic on push to `main` via `.github/workflows/deploy-web-pages.yml`.

Manual trigger: GitHub → Actions → "Deploy Web to GitHub Pages" → Run workflow.

## Repo settings

GitHub → Settings → Pages:

- **Source:** GitHub Actions (NOT "Deploy from a branch")

If the site 404s:

1. Confirm the workflow ran successfully (Actions tab).
2. Confirm Pages source = "GitHub Actions".
3. Confirm `REPO_NAME` in `vite.config.js` matches the repo name (case-sensitive).
4. Inspect page → Network tab → assets should be `/BraveVest/assets/*` returning 200.
