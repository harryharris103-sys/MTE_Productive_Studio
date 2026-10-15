# LibreOffice in MTE Productive Studio (v0.0.3 host, kept for the Office module)

> Since v0.0.5 the built-in Office tab is gone: Office is an external `office.html` module. `lo.html` and `lo-thread.js` still work as a standalone LibreOffice host; the `BroadcastChannel` contract below is what the old Office tab used, so `office.html` can reuse it.

The Office tab's **Edit in LibreOffice** button opens `lo.html` in its own tab. It runs ZetaOffice
(LibreOffice compiled to WebAssembly) entirely in the browser: no server, no cloud service.
The Studio and `lo.html` exchange files over a same-origin BroadcastChannel (`mte-lo`).

## Files (all in one folder)
`index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg`, `lo.html`, `lo-thread.js` and **`zeta.js`**.

`zeta.js` is not included. Get it from the zetajs npm package (`npm pack zetajs`, unpack, copy
`source/zeta.js` next to `lo.html`). If the file sits elsewhere in the package, copy it from there.

## Hosting requirements
1. HTTPS (GitHub Pages is fine) or `localhost`.
2. `lo.html` must be cross-origin isolated (COOP `same-origin` + COEP). GitHub Pages cannot send these
   headers, so `sw.js` adds them to `lo.html` (COEP `credentialless`). Open the Studio once so the service
   worker installs, then use the button (reload `lo.html` once if it reports "blocked").
   On Netlify/Cloudflare you can instead set the two headers in a `_headers` file.
3. Browser: Chrome, Edge or Firefox. Safari does not support `credentialless`.

## Engine files
By default `lo.html` loads the engine from `https://cdn.zetaoffice.net/zetaoffice_latest/`
(`soffice_base_url` at the top of the script). The first load downloads a large WASM bundle.
For a fixed version or offline use, host the `soffice.*` files yourself and set `soffice_base_url = ''`.

## Message contract
- Studio -> lo: `{mte:'ping'}`, `{mte:'open',name,bytes}`, `{mte:'save'}`
- lo -> Studio: `{mte:'ready'}`, `{mte:'saved',name,bytes}`, `{mte:'error',msg}`
- lo.html <-> worker (`lo-thread.js`, over `zetajs.mainPort`): `open`, `save`, `ready`, `opened`, `saved`, `error`

Open writes the bytes to `/tmp/<name>` in the WASM file system and loads it. Save calls the document's
`store()` (keeps the original format) and reads the file back.

## Not verified yet
Written from the zetajs documentation without running it. First things to check: `zeta.js` path,
`Module.uno_main` resolving, `FS` being visible in the worker script, and `store()` keeping docx/xlsx/pptx format.
