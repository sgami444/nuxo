# Nuxo Care static GitHub Pages deployment

This repository is set up to mirror the public static Emergent preview:

https://nuxo-care.preview.emergentagent.com/

and deploy the mirrored static files to GitHub Pages for:

https://nuxo.in/

## What this does

- Opens the Emergent preview in a real Chromium browser using Playwright.
- Waits for the JavaScript-rendered site to finish loading.
- Scrolls through the page so lazy-loaded images are requested.
- Saves the rendered HTML and downloaded static assets into `dist/`.
- Deploys `dist/` to GitHub Pages using GitHub Actions.

## Quick start

### 1. Create a GitHub repository

Create a new repository named something like:

```bash
nuxo-care
```

### 2. Upload/push these files

From this folder:

```bash
git init
git add .
git commit -m "Deploy Nuxo Care static site"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/nuxo-care.git
git push -u origin main
```

### 3. Enable GitHub Pages through Actions

In GitHub:

```text
Repository → Settings → Pages → Source → GitHub Actions
```

The workflow in `.github/workflows/deploy-pages.yml` will run automatically after push.

### 4. Add your custom domain in GitHub Pages

In GitHub:

```text
Repository → Settings → Pages → Custom domain
```

Enter:

```text
nuxo.in
```

Save it. Then enable **Enforce HTTPS** once GitHub allows it.

### 5. Update DNS records where you bought nuxo.in

Create these DNS records:

```text
Type   Name/Host   Value
A      @           185.199.108.153
A      @           185.199.109.153
A      @           185.199.110.153
A      @           185.199.111.153
CNAME  www         YOUR_GITHUB_USERNAME.github.io
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub username or organization name.

Remove old conflicting records for `@` or `www`, especially parking/launching-soon records.

DNS can take a few minutes to 24 hours.

## Optional: run locally before pushing

```bash
npm install
npx playwright install chromium
npm run scrape
npm run serve
```

Then open the local URL printed by `serve`.

## Important notes

- The preview URL must remain publicly accessible when the GitHub Action runs.
- If the preview URL goes away later, run the scraper once locally and commit the generated `dist/` folder, or export the original code from Emergent.
- This is a static mirror. Any backend, contact form submission, login, or API behavior will not work unless separately rebuilt.
