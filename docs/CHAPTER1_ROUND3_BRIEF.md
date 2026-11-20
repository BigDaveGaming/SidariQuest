# Chapter 1 — Round 3 changes (for Codex)

Reviewed on iPhone and in Chromium at 375 × 667 and 390 × 844, against
`feature/chapter1-mobile-playtest` @ `7cb9008`. Agreed with Mike. Build on top of that
branch. Keep the story, comedy, Greek, saves, stars and offline behaviour as they are.

---

## 1. Fix: characters drawn over older versions of themselves (bug)

**Cause:** Dave is drawn as a composite. `#daveBody` (`dave_full` / `dave_full_no_magnet`)
sits underneath, and `#player` (`dave_full_<expression>`) is laid over it with a soft
radial `mask-image` on the head (`.dave-composite .dave-expression`). The two heads are
not pixel-aligned, so the feathered mask shows both heads at once: a ghost outline, a
doubled face edge, two sets of sunglasses. That is the "overlaid on an old version" look.

**Fix:**
- Remove the head-mask composite. **Each character must be one complete image per pose.**
  Never stack two figures of the same character.
- Dave's magnet: use `dave_full` (with magnet) **only** for the magnet beat at the van. Everywhere
  else use a no-magnet image. If no-magnet versions of the expressions don't exist yet, use
  `dave_full_no_magnet` for all expressions for now and **add the missing files to
  `docs/ASSET_STATUS.md`**: `dave_full_<pleased|cringe|confused|shocked|talking|fuming>_no_magnet`.
- Audit **every** scene, the intro panels, the cutscene avatars and the end screen for any
  other stacked or doubled figures. Intro panels already have Dave and Sharon painted in:
  nothing should be drawn on top of them.
- Check each sprite's edges on a coloured background for halos or leftover pixels and note any
  that need re-exporting in `docs/ASSET_STATUS.md`.

---

## 2. Scene layout fixes

- **Characters cover the signs.** At the van hire office, Dave's head sits across the
  `ΕΝΟΙΚΙΑΣΕΙΣ ΑΥΤΟΚΙΝΗΤΩΝ` board, so it can't be read. Position or scale the cast so painted
  boards with Greek on them stay fully visible. Check every location.
- **The Greek line scrolls out of view.** On a "What is Spyros asking?" question, the Greek
  he said was scrolled off the top of the panel, leaving just the prompt and options. The
  Greek being tested (with its 🔊 button) must **always be visible above the options**: keep
  it pinned at the top of the panel, or make the panel fit without scrolling.

---

## 3. Phrase cards: redesign

The current card is a beige box with the Greek, Latin letters, English, a "Play slowly" link,
word chips, instructions, the tip and a quiz all at once. Problems:
- The quick check sits directly under the card, which shows the English answer, so it
  tests nothing. The wrong-answer message even says "Check the English on the card".
- Too much on one screen with no clear focus. Doesn't look or feel like Sharon's phrasebook.
- On a 375 × 667 screen the quiz is pushed below the fold.
- Audio controls don't match: a grey speaker button (looks disabled) plus a text link.
- Sign phrases only appear in capitals, so there are no accents and the Latin letters lose the
  stress ("Enikiasis Aftokiniton").
- Word chips repeat what the tip already says.

### New design: a flip card
- **Looks like a page from Sharon's battered "Greek for Beginners"**: paper texture, a coffee
  ring, ruled lines. The tip appears as **Dave's biro scribble** in the margin (handwriting
  style font, slightly rotated). Dave or Sharon (whoever is being played) peeks in from a
  corner with a matching expression.
- **Front:** the Greek, large. Two matching round buttons side by side: **🔊 normal** and
  **🐢 slow**. Latin letters underneath (if enabled). "Tap to flip".
- **Back:** the English meaning, a simple **word-by-word breakdown** (`θα` would · `ήθελα` I
  wanted · `ένα` a · `βαν` van) shown as a small list (no tapping needed), and the tip as
  Dave's scribble. A **Got it** button.
- **Sign phrases:** show the sign as it appears (blue sign style, capitals), then the
  normal spelling with accents underneath: *Ενοικιάσεις αυτοκινήτων* and the Latin
  letters with stress: *Enikiásis aftokiníton*.
- When 2–3 cards come together, show **"1 of 3" dots** and allow swiping between them.
- The whole card must **fit on a 375 × 667 screen without scrolling**.
- Flip animation should respect `prefers-reduced-motion` (fade instead).

### The check comes after, with the card hidden
- After **Got it** on the last card, the card goes away and the check appears on its own.
- Use a check that actually tests memory, e.g. **play the audio only** and pick the meaning,
  or show the Greek **without** the English and pick the meaning.
- Wrong answer: show the right answer, then show that card again briefly before moving on.

---

## 4. When cards appear: first time only, then a hint icon

- **First time a phrase appears** in the story: the flip card pops up (the teaching moment).
- **After that:** the phrase is only available behind a **📖 hint icon** in the corner of the
  scene. Tapping it slides the same flip card up over the scene. Using it means **no fig**
  for that answer (as now).
- **On replays, or for phrases already learned:** no pop-up, just the hint icon.
- Remove the current always-shown card + quick-check pattern.

---

## Acceptance checks
- No character is ever drawn twice or over an older version of itself, in any scene, on
  either character.
- Painted Greek signs are never covered by characters.
- The Greek being asked about is always visible on screen with its 🔊 button.
- Phrase cards flip, look like the phrasebook, have matching 🔊 / 🐢 buttons, and fit on a
  375 × 667 screen without scrolling.
- The check never appears on the same screen as the card's English answer.
- A phrase's card pops up only the first time; afterwards it's only behind 📖.
- `docs/ASSET_STATUS.md` lists any new art needed (e.g. no-magnet Dave expressions).
