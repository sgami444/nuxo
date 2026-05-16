# Transfer `nuxo.in` to the New Static Site Repo

This plan keeps the existing `nuxo-care-github-pages` repo intact and moves the live `nuxo.in` GitHub Pages site to a new repo based on:

```txt
C:\Users\sgami\Documents\nuxo\nuxo
```

## Goal

Deploy the plain HTML/CSS/JS site from `C:\Users\sgami\Documents\nuxo\nuxo` to `nuxo.in` without using the current GitHub Actions workflow.

## Recommended Approach

Create a new GitHub repo for the static site, publish it with GitHub Pages using "Deploy from a branch", then move the `nuxo.in` custom domain from the old repo to the new repo.

## Steps

1. Create a new GitHub repository.

   Suggested name:

   ```txt
   nuxo-static-site
   ```

2. Push the files from the new static site folder:

   ```txt
   C:\Users\sgami\Documents\nuxo\nuxo
   ```

   This folder already contains static files such as:

   ```txt
   index.html
   about.html
   contact.html
   services.html
   styles.css
   script.js
   ```

3. In the new repo, add a root-level file named `CNAME`.

   The file should contain exactly:

   ```txt
   nuxo.in
   ```

4. In the old repo, remove the custom domain from GitHub Pages.

   Go to:

   ```txt
   Settings > Pages > Custom domain
   ```

   Remove:

   ```txt
   nuxo.in
   ```

   This does not delete the old repo or its code. It only releases the domain from the old Pages deployment.

5. In the new repo, enable GitHub Pages without a custom workflow.

   Go to:

   ```txt
   Settings > Pages
   ```

   Use these settings:

   ```txt
   Source: Deploy from a branch
   Branch: main
   Folder: / root
   ```

6. In the new repo's GitHub Pages settings, set the custom domain:

   ```txt
   nuxo.in
   ```

7. Wait for GitHub Pages to publish the site.

   After GitHub validates the domain and provisions HTTPS, enable:

   ```txt
   Enforce HTTPS
   ```

   This option can take some time to become available.

## DNS Records

If `nuxo.in` already points to GitHub Pages, DNS may not need to change.

For the apex/root domain `nuxo.in`, the DNS records should be:

```txt
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
```

Optional `www` record:

```txt
CNAME www YOUR_GITHUB_USERNAME.github.io
```

Replace `YOUR_GITHUB_USERNAME` with the actual GitHub username or organization that owns the Pages site.

Do not point the `www` CNAME to the repository URL. GitHub recommends pointing it directly to:

```txt
YOUR_GITHUB_USERNAME.github.io
```

## Important Notes

- The custom domain is controlled in the GitHub Pages settings for the repo.
- A `CNAME` file alone does not fully move the domain.
- DNS alone does not choose which GitHub repo serves `nuxo.in`.
- Only one GitHub Pages repo can actively claim `nuxo.in` at a time.
- The old repo can remain as-is for history or backup.
- The current custom GitHub Actions workflow is not needed for the new plain static site setup.

## Verification

After setup, check:

```txt
https://nuxo.in
https://www.nuxo.in
```

Also confirm in the new repo:

```txt
Settings > Pages
```

The page should show that the site is published and the custom domain is configured.
