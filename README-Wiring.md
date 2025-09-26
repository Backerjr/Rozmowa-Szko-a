# Wiki → GitHub Pages Wiring (Just the Docs)

This scaffold mirrors your repository **Wiki** (`<repo>.wiki.git`) into a nice, searchable **GitHub Pages** site using the **Just the Docs** theme.

## How it works
- A GitHub Action clones your repo’s **Wiki** into `wiki_src/`
- It builds a Jekyll site from those Markdown pages
- It deploys the static site to **GitHub Pages**

## Setup (5 steps)
1. Copy the `.github/workflows/wiki-to-pages.yml` into your repo.
2. Edit the env vars at the top:
   - `GH_USERNAME`: your GitHub username or org
   - `REPO_NAME`: your main repository name (without `.wiki`)
   - (Optional) `CUSTOM_DOMAIN`: e.g. `rozmowaszkola.pl` (leave empty to skip CNAME)
3. Commit & push to `main`.
4. In **Settings → Pages**, set **Build and deployment** to **GitHub Actions**.
5. Run the workflow via **Actions → Deploy Wiki to GitHub Pages → Run workflow** (or wait for the 6‑hour sync).

## Notes
- Your actual Wiki content lives in a separate repo: `<owner>/<repo>.wiki.git`. Edit via the **Wiki** tab or clone-push.
- The action does **not** modify your wiki; it only reads from it.
- The theme is **Just the Docs** with built-in search and clean sidebar nav.

## Troubleshooting
- **Empty site?** Ensure your wiki has at least `Home.md`. The action auto-creates `index.md` if missing.
- **Theme not loading?** GitHub sometimes needs 1–2 minutes after first deploy. Refresh and check **Pages** logs.
- **Custom domain/HTTPS:** Add your domain to `CUSTOM_DOMAIN` and set DNS to GitHub Pages IPs; enforce HTTPS in Settings → Pages.

Happy documenting!
