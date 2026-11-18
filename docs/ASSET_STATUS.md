# Sidari Quest — Chapter 1 Asset Status

Baseline inventory before the mobile playtest. See the [current art audit and production list](CHAPTER1_ART_PRODUCTION.md) for integrated artwork and open files.

**For the art AI (ChatGPT):** this file lists every Chapter 1 image, where it
is, and what (if anything) needs fixing. Please analyse the files in
`art/raw/`, fix or replace them as described, and deliver replacements as a
zip using the **exact same file names and folder structure** as the brief
(`docs/ART_BRIEF_CHAPTER1.txt`).

## Folder layout

| Folder | What's in it |
|---|---|
| `art/reference/` | Approved style references. Match these. |
| `art/raw/` | Original PNGs as delivered by the art AI (some have problems — see below) |
| `assets/` | Cleaned, compressed `.webp` versions the game actually uses (made by Claude) |
| `docs/` | Concept, art brief, this status file |
| root | The playable game (`index.html`, PWA files) |

## Approved references

- `art/reference/style_reference_title_screen.png` — overall style, Dave and Sharon's look.
- `art/reference/locals_approved_designs_sheet.png` — **approved designs for the four locals.**
  Keep these faces, hair, clothes and personalities. (Ignore the sheet's labels and side
  panels: Fat Spyros runs the **mini market**, not a bar; Kyrios Spyros is the **landlord**,
  not a taverna owner.)

## Rules every image must meet

1. Cut-outs: **real transparent background** (alpha 0 around the figure, alpha 255 on the
   figure). No white or checkerboard backgrounds, no semi-transparent figures.
2. **No labels, captions, numbers or text** painted into character images.
3. **No slivers** of neighbouring images along the edges (don't crop from a shared sheet).
4. Face/bust images: head and shoulders, **identical framing** for every expression of the
   same character, at least **1024 × 1024**.
5. Dave and Sharon face slightly **right**; all locals face slightly **left**.
6. No real brand logos (including three-stripe trainers/sliders).
7. Backgrounds: portrait 1024 × 1536, no characters, **shop/street signs left blank**.

## Status

Legend: ✅ done · 🔧 needs fixing · ❌ missing

### A. Title

| File | Status | Notes |
|---|---|---|
| `title/title_background.png` | ✅ | Perfect. |
| `title/logo.png` | ✅ | |
| `title/tagline.png` | ✅ | |

### B. Character select

| File | Status | Notes |
|---|---|---|
| `characters/dave_full.png` | ✅ | Approved version (magnet in hand, plain flip-flops). |
| `characters/sharon_full.png` | 🔧 minor | Tiny stray speck beside her bag. Otherwise approved. |

### C. Dave's faces (`characters/dave_*.png`)

| File | Status | Notes |
|---|---|---|
| normal, proud, cringe, talking | 🔧 | Cut from a shared sheet: fake transparency, possible edge slivers. Redo as true individual cut-outs, same designs. |
| confused | 🔧 | As above, plus a **white patch** between head and arm. |
| fuming, shocked | 🔧 | As above, plus **slivers of neighbouring images** along the top edge. Keep the steam puffs on fuming. |

Expressions are approved. This is a technical redo only.

### D. Sharon's faces (`characters/sharon_*.png`)

| File | Status | Notes |
|---|---|---|
| all 7 | 🔧 | **Broken alpha: the whole figure is ~4% opaque** (nearly invisible). Also white fringing in her hair. |
| fuming, shocked | 🔧 | Plus slivers of the neighbouring image on the right edge. |
| proud | 🔧 | Plus a white patch by her hand. |

Expressions are approved. Technical redo only.

### E. Locals (`locals/*.png`)

| File | Status | Notes |
|---|---|---|
| all 12 | 🔧 | Rectangular crops (≈430 × 250) with **white backgrounds and caption labels** baked in, facing right. Redo each as a separate transparent cut-out, ≥1024 px, facing **left**, no labels, using the approved sheet. |

The renamed moods are fine. Final file names:

- Spyros Rent-a-Van: `spyros_van_normal`, `spyros_van_proud`, `spyros_van_confused`
- Kyria Eleni: `eleni_normal`, `eleni_pleased`, `eleni_exasperated`
- Kyrios Spyros: `kyrios_spyros_normal`, `kyrios_spyros_stern`, `kyrios_spyros_explaining`
- Fat Spyros: `fat_spyros_normal`, `fat_spyros_laughing`, `fat_spyros_fed_up`

### F. Backgrounds — ❌ all missing

`bg_van_hire.png`, `bg_apartment_outside.png`, `bg_apartment_kitchen.png`, `bg_minimarket.png`
(see brief section F).

### G. Intro comic — ❌ all missing

`intro_1_landing.png`, `intro_2_baggage.png`, `intro_3_arrivals.png` (see brief section G).

### H. Extras — ❌ all missing

`icon.png` (1024 × 1024 app icon), `fig.png` (reward icon) (see brief section H).

## Summary

- ✅ 4 done · 🔧 27 to fix · ❌ 9 missing (40 total)
- Priority: 1) locals (E), 2) backgrounds (F), 3) Sharon's faces (D), 4) Dave's faces (C),
  5) intro (G), 6) extras (H).
