# Crema

Order-ahead coffee landing cloned from https://crema-template.modulify.website/.

The captured page is `targets/crema/clone/`. `fixes.js` loads the Three.js r180 phone, the letter intro, drag, and the 4.5s auto-rotate. Background photos stay on their original URLs.

```sh
npm run dev:crema
npm run build --workspace=@templates/crema
```

`CREMA_PORT` pins the preview port. Otherwise the server picks a free port in 3100–3200.
