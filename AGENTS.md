# Hegemony Automa development

`dist/` is the editable source for the current browser app. `docs/` is the GitHub Pages copy generated from `dist/`.

For every code change:

1. Edit files in `dist/` and add or update tests in `tests/`.
2. Run `npm test`.
3. Run `npm run sync-docs`.
4. Run `npm run check-docs` and confirm that `docs/` matches `dist/`.
5. Commit both the source changes and their generated `docs/` copies.

Do not edit `docs/` directly. Do not remove rule-source notes or silently resolve ambiguous rules. Keep unsupported or unverified behavior explicit in the UI. The current fully automated rules target the two-player game with the Working Class automa and a human Capitalist player.

The app has no runtime package dependencies. `npm start` serves `dist/` at `http://127.0.0.1:4173`. The main automated suite is `npm test`; browser scripts in `tests/*-browser.cjs` require Playwright as their first command-line argument and are optional unless the task changes UI behavior.

