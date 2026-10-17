# MTE Productive Studio — handoff summary (v0.0.9)

Files: `index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg` (PWA, single-file app, fabric.js 5.3.1 canvas).
Rule for releases: bump `VERSION` in index.html AND `V` in sw.js together (e.g. `mte-studio-v0.0.2`).

## v0.0.9 changes (written without a browser test)
- **AI selection removed** (the transformers.js model failed to run for the user). `sw.js` no longer special-cases huggingface.co.
- **Object Selection** now works like Photoshop's: drag a *Rectangle or Lasso* around the object (lasso pixels are treated as outside background); click for similar colour. New / Add / Subtract, Invert, Isolate, Mask.
- **Quick Select** (was Paint Select): brush, then *Auto-expand to edges* grows the stroke through pixels of similar colour (3 colour centres from the stroke, Sobel edge barrier, step limit, capped at 3 brush radii), Add / Subtract / New; untick for a plain brush. Functions `qsGrow`, `manualDone`.

## v0.0.8 changes (written without a browser test: please test each item)
- **Invert selection fixed**: the outline smoothing cut 25% off every long straight edge, so inverted (and box/AI) selections were wrong. It now cuts at most ~1 grid pixel; the polygon tracer was checked against random masks.
- **Layer opacity panel** (above Object selection in the side panel): slider, number box, 25/50/75/100% buttons, works on multiple selected layers. *Fill transparency* fades only the solid fill of shapes and text (not borders/effects). The old Opacity slider in the Fill section still works and stays in sync.
- (AI object selection from v0.0.8 was removed in v0.0.9.)

## v0.0.7 changes (written without a browser test: please test each item)
- **Mockups removed** (button, dialog and code). The v0.0.5 mockup notes below are history only; the old build can be reinstated from v0.0.6.
- **Rename layers**: double-click a layer name or tap the pencil; Enter saves, Esc cancels.
- **Eraser** (*Eraser* button): size, hardness, strength; rubs out pixels of the picked layer to transparent (non-image layers are rasterised, FX kept). Respects a selection. Shares the `#ovT` overlay with Blur/Pen/mask painting.
- **Object Selection** (*Obj Select* or Select menu): drag a box to isolate an object from its background (colour clusters from the box border vs the middle, 3 refinement passes, keeps the main blob, fills holes); click to pick a similar-coloured region (tolerance slider) for hair, clothes, eyes, sky. New / Add / Subtract. Works on the picked image layer, else the visible canvas, at up to 1000 px and returns a smooth vector outline (`SX.t==='poly'`), so every existing selection operation works on it. It is colour/edge based, not an AI model: it does not know what a person or an eye is. A real model (e.g. SAM / MediaPipe) could be plugged into `objDone`.
- **Invert selection** (Select menu, Ctrl+Shift+I, panel button) works for any selection; panel also has Isolate to new layer and Mask layer.
- **Shape borders** (*Border* button; panel appears when a shape is selected): colour, width, solid/dashed/dotted, corner join (sharp/round/bevel), no border, corner rounding. Rectangles use rx/ry; triangles and polygons become editable rounded paths (`shapePts`, `shapeCr`) and can be re-adjusted; ellipses have no corners. Edit points on a rounded path detaches it from the slider.

## v0.0.6 changes (written without a browser test: please test each item)
- **Layer Styles (FX)**: tool button *FX* (or the `fx` button on a layer row). Dialog with Blending Options, Drop Shadow, Outer Glow, Inner Shadow, Inner Glow, Stroke (outside/inside/center), Color / Gradient / Pattern Overlay, Bevel & Emboss. Stored on the layer as `o.fx`, live preview, per-effect tick to hide, *Effects visible* switch (also the dot on the layer row), *Remove all effects*, Cancel restores. Effects are drawn by one patched `fabric.Object.prototype.render` in document pixels, so they follow move/scale/rotate and export with PNG/JPG/WEBP. Limits: not inside groups; layered PDF/PSD export bakes them into the layer image (live text loses them); no Satin/Contour/Texture.
- **Layer masks** (*Mask* menu): reveal all, hide all, from selection, paint (hide/reveal brush with size, hardness, opacity), invert, switch off/on, delete. Mask is an alpha canvas in the layer's own space (max 2048 px), saved as `o.maskData`. Layer row shows a square button: tap to paint, Shift+tap to switch off. Effects follow the masked shape.
- **Curves adjustment layer** (*Curves* button): `fabric.Curves`, non-destructive, adjusts everything below it (strength = layer opacity). Panel: preset, RGB/R/G/B channel, histogram of what is below, Auto, Input/Output fields, click to add points, drag, double-click to remove. Monotone cubic curve. Covers the whole canvas; the layer is not mouse-pickable (select it in Layers).
- **Curvature Pen** (*Curv. Pen*): click to add points, path curves through them; drag to move, double-click = corner, click first point to close, Enter finishes, Esc cancels, Delete removes a point. Path or filled shape with stroke width/colour. Result is a normal path layer (Edit points works).
- **Blur tool**: modes Brush (size, hardness, strength, blur radius; stays inside a marquee selection), Whole layer, Selected area. Rasterises the layer (keeps its FX), uses native canvas blur with a JS fallback for Safari.
- Shared overlay canvas `#ovT` serves Pen, Blur and mask painting. New code sits in one block before `/* ===== boot ===== */`.
- Next ideas: apply mask (bake), Object Selection and invert selection, Satin/Contour/Texture, curves eyedroppers.

## v0.0.5 changes
- **Transparent background**: *Transparent* in New project, and a *Make background transparent* toggle in the Fill panel. PNG and WEBP keep transparency whenever the canvas background is transparent (JPG still fills white).
- **Selection tools** (Select menu): rectangular, elliptical and lasso marquee with marching ants; Copy, Copy merged, Cut, Paste, Paste in place, Layer via copy (Ctrl+J), Layer via cut (Ctrl+Shift+J), Clear (Delete). Operations act on the layer picked in the Layers panel; text and shapes are rasterised when cut or erased. Without a selection Ctrl+C/X/V copy whole layers. Pasting an image from another app works too.
- **Mockups** (Mockup button): phone, tablet, laptop, browser window, poster frame, business card, T-shirt, mug. All vector, no external files. The current canvas is grouped as one layer ("Your design"), clipped to the screen/print area and placed on the scene; undo reverts, Ungroup edits the artwork. T-shirt and mug use Multiply so white backgrounds drop out.
- **Photoshop .abr brushes**: v6-v10 files are decoded (verified: all 16 tips of `16-free-ink-brushes.abr` match a reference decoder byte for byte, names and default spacing included). v1/v2 files are handled by best-effort code that has not been tested against a real file. Tips become stamp brushes (256 px, saved on the device).
- **Video and Office are external modules**: the built-in Office editor was removed (v0.0.4 is kept in `archive/index-v0.0.4.html`). Both tabs load their own HTML file in an iframe. *Modules...* (project options row) or *Source...* on the tab sets a GitHub repo link (resolved to `https://owner.github.io/repo/<file>`; Pages must be enabled), per-module file names, or full URLs. Contract for `office.html` / `video.html`: post `{mte:'ready'}` to the parent when loaded; the parent then sends `{mte:'open',name,bytes}` for files opened in the Studio (Office files such as docx, pptx, xlsx are routed to the Office module). `lo.html` / `lo-thread.js` (LibreOffice WASM host) are unchanged and can be reused by `office.html`.

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
