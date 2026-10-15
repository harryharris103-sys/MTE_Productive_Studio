# MTE Productive Studio — handoff summary (v0.0.4)

Files: `index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg` (PWA, single-file app, fabric.js 5.3.1 canvas).
Rule for releases: bump `VERSION` in index.html AND `V` in sw.js together (e.g. `mte-studio-v0.0.2`).

## v0.0.4 changes
- **Light mode** (header sun/moon button, remembered per device; dark stays default). Colours are CSS variables (`--d`, `--p`, `--l`, `--m`, `--t`, `--gt`, `--stage`, ...); gold text uses a darker gold in light mode for contrast.
- **Hamburger (☰)** now shows/hides the project options row (name, canvas size, colour mode, scale, export format, live text, embed project) on desktop as well as mobile. It used to do nothing on desktop because that row was always visible.
- **Shapes menu** groups Rectangle, Rounded, Ellipse, Triangle, Star, Hexagon and eight line types (straight, dashed, dotted, arrow, double arrow, curve, zigzag, wave). Lines are paths, so *Edit points* works on them.
- **Import fonts** (+ Font; .ttf .otf .woff .woff2), stored in IndexedDB on the device. Caveat: layered PDF live text uses base-14 fonts, so custom fonts fall back there; use PNG/SVG, or turn off *Live text*.
- **Brush tool**: hard/soft round, marker, airbrush, dots; stamp brushes (soft, chalk, splatter, dry bristle) with spacing, scatter, size jitter, follow-stroke, opacity and blend mode; import brush tips from PNG/JPG (stored on device). Each stroke is its own layer. Photoshop `.abr` packs are not parsed yet.

## v0.0.3 changes
- **LibreOffice route**: `lo.html` + `lo-thread.js` host ZetaOffice (LibreOffice WASM) in its own tab; Office tab buttons *Edit in LibreOffice* / *Get LibreOffice copy*; `sw.js` adds COOP/COEP to `lo.html`. Setup and open items: `LIBREOFFICE-SETUP.md` (needs `zeta.js` from the zetajs npm package).
- **Font styling**: strikethrough, overline, superscript/subscript (selected text while editing), UPPER/lower/Title case, Ctrl+B/I/U while editing; B/I/U/S/O apply to the selected characters when editing, else the whole layer. Underline/strike/overline now export to layered PDF; PSD text carries italic, underline, strikethrough.

## v0.0.2 changes
- Manual **Save / Save as** (Ctrl+S, Ctrl+Shift+S) writes a `.mte` project to disk (File System Access API where available, otherwise a download); unsaved dot beside the buttons.
- JPEG export option (alongside JPG); 300 dpi scale option (3.125x).
- **Video** tab: loads `video.html` (placed next to index.html) in an iframe on first open.

## Done in v0.0.1
- Renamed to **MTE Productive Studio**; new logo (icon.svg + header); version badge `v0.0.1`.
- **Editable SVG**: import splits SVG into individual layers (paths, shapes, text -> editable text boxes). "Edit points" drags path anchors/curve handles; "To path" converts rect/triangle/ellipse; "SVG code" window views/edits/re-applies markup. Export SVG keeps live text and real units (mm/in/cm).
- **Letterhead removed**; replaced by an **Office workspace** (tab "Office"): DOCX/PPTX text edited in place (formatting preserved), XLSX/ODS/CSV cell grid (SheetJS), always "Save copy". **LibreOffice engine slot**: iframe to a page you host (ZetaOffice/LibreOffice WASM or Collabora), postMessage contract `ready/open/save/saved`. Full LibreOffice not bundled yet (needs hosting + COOP/COEP headers).
- **Future video editor**: `MTE.addWorkspace({id,label,mount(el),openFile?})` registers a new tab/workspace; the Office tab uses the same API.
- Mobile: compact top bar, collapsible options, bottom tool strip, Panel bottom-sheet, dvh + safe areas.
- Text align left/centre/right/justify. Object align left/centre/right/top/middle/bottom (to canvas or selection).
- Effects: 16 blend modes, "Blend on white" (Multiply), "Blend on black" (Screen), Blend-If knock-out white/black with level + softness (images), clipping masks (clip to layer below / release).
- Arrow-key nudge (Shift = 10 px), Ctrl+D duplicate.
- Canvas size: presets (social, A3-A6, Letter/Legal, call/business card, sticker, barcode label, web) + custom W/H with px/in/mm/cm and DPI; works for New project and for resizing.
- Gradients: linear/radial fills for shapes, text and canvas background (target selector).
- **New project in a new tab** (`?p=<id>` isolated autosave per tab).
- RGB / CMYK document mode: CMYK inputs per fill, vector colours exported as DeviceCMYK. No ICC profile; images stay RGB.
- **PSD**: import keeps live text, blend modes, opacity, hidden state, smart objects (Edit smart object -> Update & return; content kept in memory only). Export writes layers, live text, blend modes.
- **PDF/AI**: layered export (PDF optional-content layers, live base-14 text, blend/opacity, embedded editable project for lossless round-trip). Import: embedded project > PDF layers (one editable layer each) > vector (best effort) > flat. AI export is PDF-compatible.

## Known limits / next steps (not verified in a real browser yet)
0. PDF/AI import brings in one chosen page at a time; multi-page projects are not implemented.
1. All browser features need a first test pass (written without a browser; PDF writer verified with qpdf/pypdf only).
2. PSD: shape layers, masks, clipping flags arrive as pixels; smart-object data is lost on reload; CMYK PSD not written.
3. AI: only PDF-compatible files; native Illustrator vectors are not parsed.
4. Real LibreOffice integration (bridge page + cross-origin isolation) is the next Office milestone.
5. CMYK needs ICC conversion for true print accuracy.
