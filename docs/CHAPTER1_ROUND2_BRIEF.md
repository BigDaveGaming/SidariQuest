# Chapter 1 — Round 2 changes (for Codex)

Build these on top of PR #2 (`feature/chapter1-mobile-playtest`). Reviewed and agreed
with Mike. Keep everything that already works: art, comedy lines, checkpoints,
offline/service worker, both characters.

---

## 1. Teach before testing (highest priority)

The game currently tests phrases the player has never been taught. Replace this with
**learn a little, then use it straight away**.

### The phrasebook
- Framing: a battered *"Greek for Beginners"* Sharon bought at the airport, with Dave's
  biro scribbles in the margins (e.g. "ask about the buffet").
- It opens **before each scene beat**, teaching **2–3 phrases** needed for the next part of
  the conversation. Not one big list at the start of the chapter.
- The existing "Phrasebook" title-screen button can stay as the review list of learned phrases.

### Each phrase card (in this order)
1. **See it and hear it**: Greek in large type, auto-plays audio, slow-audio button,
   Latin letters (if enabled), English meaning.
2. **Break it down**: each word is a tappable chip that speaks the word and shows its
   meaning. Example: `Θα` (would) · `ήθελα` (I wanted) · `ένα` (a) · `βαν` (van).
3. **One tip**: a single line, e.g. "Καλημέρα until about midday, then καλησπέρα." or
   "Dave says έτοιμος, Sharon says έτοιμη." Show the form for the chosen character.
4. **Quick check**: one easy question straight away (e.g. "Tap the one that means good
   morning").

### Difficulty ladder for each phrase across the lesson
1. **Recognise**: Greek → choose the English.
2. **Recall**: English → choose the Greek.
3. **Build**: arrange word tiles.
4. **Use**: reply to a local in the scene with no help.

### Hints and mistakes
- **📖 Hint button** in scenes reopens that phrase's card. Using it means **no fig** for that
  answer.
- **Wrong answer**: show the correct answer and the explanation (stop the tap-until-it-works
  retry). The question then goes on a **"Have another go" pile** that replays at the end
  of the lesson until each one is answered correctly.
- **Phrases recur** in later chapters (e.g. Καλημέρα again with Little Spyros at the bakery).
  Keep phrase IDs stable so later chapters can reuse them.

---

## 2. Word tiles: drag and rearrange

- Tiles can be **dragged** from the word bank into the answer row.
- Tiles in the answer row can be **dragged to reorder** them, and dragged back to the bank.
- **Tapping still works** (tap bank tile → appends; tap answer tile → returns to bank).
- Each tile speaks its word when picked up. The whole sentence is spoken when correct.
- Must work with touch on iPhone Safari (pointer events, no HTML5 drag-and-drop, which
  doesn't work on iOS). Prevent page scroll while dragging a tile.

---

## 3. Story: the "cheap all-inclusive" joke

The joke is that Dave thinks he's found a **bargain all-inclusive**, and it turns out to be
**self-catering**. Set it up, then pay it off. Remove the existing "apartment buffet"
references that don't fit this.

### Setup: on the plane (intro panel 1)
Dave, smug: *"Three hundred quid a week, Shaz. All-inclusive. For the whole summer.
I've still got it."* Sharon is filming and not listening. Prices Dave booked in the UK are
in **pounds**. Prices in Greece are in **euros**.

### Payoff: at the apartment
1. Kyria Eleni shows them in.
2. Player asks: **«Τι ώρα είναι το πρωινό;»** (What time is breakfast?)
3. Eleni, puzzled: **«Δεν έχει πρωινό.»** (There's no breakfast.)
4. Player: **«Και το βραδινό;»** (And dinner?)
5. Eleni proudly opens a door: **«Έχει κουζίνα!»** (There's a kitchen!) Cut to the
   kitchen background: two rings, a kettle, an empty fridge.
6. Dave (or Sharon) gets the **fuming** reaction. Sharon scrolls her phone:
   *"It says self-catering, Dave. In bold. Next to the picture of the kettle."*
   If playing as Sharon, adapt: she reads it out to Dave, who fumes.
7. This leads directly to the mini-market mission (they're starving).

Teach πρωινό (breakfast), βραδινό (dinner) and κουζίνα (kitchen) on phrase cards before
this exchange so the player understands the reveal from the Greek.

### Fix the apartment logic
Remove the question **"Ask where the apartment is" (Πού είναι το διαμέρισμα;)**. They're
already at the apartment with Kyria Eleni. The breakfast/dinner exchange above replaces it.
Kyria Eleni's greeting should be just **«Καλώς ήρθατε!»** (drop "Πώς μπορώ να σας βοηθήσω;").
Optionally teach the reply **«Καλώς σας βρήκαμε!»**.

---

## 4. Greek signs on the painted boards

The art has blank boards for signs, but the Greek currently shows in a banner at the top of
the screen. Put the text **on the painted boards**, positioned in % so it scales:
- Van hire background: `ΕΝΟΙΚΙΑΣΕΙΣ ΑΥΤΟΚΙΝΗΤΩΝ` on the board above the office door.
- Arrivals panel: `ΑΦΙΞΕΙΣ`, `ΑΠΟΣΚΕΥΕΣ`, `ΕΞΟΔΟΣ` on the three overhead boards (one
  each). Keep the small English captions below them.
- Remove the top banner where the sign is on the board.

---

## 5. Keep / don't change
- All Greek currently in the chapter has been checked and is correct. Don't rephrase it
  unless a change above requires it.
- Sharon's dialect: Mike's call (currently "luv"). Leave as is.
- Keep per-character checkpoints, first-try fig rules, the offline cache and commit-stamped
  cache versioning.

## Acceptance checks
- A new player is never asked a question about a phrase they haven't been shown on a card.
- Every wrong answer shows the right answer and reappears in "Have another go".
- Tiles can be dragged and reordered on iPhone Safari, and tapping still works.
- The plane setup and the breakfast/dinner/kitchen reveal play for both Dave and Sharon.
- Sign text sits on the painted boards at 320 px, 390 px and 430 px widths.
