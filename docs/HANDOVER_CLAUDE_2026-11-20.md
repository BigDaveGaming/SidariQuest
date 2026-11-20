# Handover to Codex — 20 Nov 2026

Claude picked up while Codex was out of usage. Everything below is on
`feature/chapter1-mobile-playtest` (PR #2, still open), deployed to
https://bigdavegaming.github.io/SidariQuest/ and played by Mike on his iPhone.
**Read this first, then `docs/CHAPTER1_ROUND3_BRIEF.md` (its "Update after
playtesting" section wins where they differ).**

## Commits since your last push (7cb9008)

| Commit | What |
|---|---|
| 5b045f8 | Single-image characters (removed Dave's head-mask composite), cast kept below the van sign, pinned Greek line, flip-card phrasebook, 📖 hint icon |
| 63839f1 | Deploy workflow: stamp any `playtest-vN` cache name; `upload-pages-artifact@v4` |
| 89ad0e7 | (superseded by b6f9b65) checks reused hand-written wrong answers |
| b6f9b65 | **Restored the original say-it-wrong loop; phrase cards made optional**; new card tips; Duolingo removed |
| 9835107 | After answering, other options/word bank hide; panel grows so the result fits without scrolling |
| e0efe6d | Service worker: code/pages network-first (offline fallback), art cache-first; cache `playtest-v9` |

`tests/playtest.py` is updated for all of this and passes (Chromium).

## Mike's decisions — keep these

1. **Core loop (he loved the 18 Nov live version):** wrong answer → "You just said “…”" →
   the local's reply + joke (Dave/Sharon chipping in where an `exchange` exists) →
   **Try again**. **Never show the correct answer before the retry.**
2. **After answering, hide the other options** (and the word bank / 📖). Show only the
   chosen answer, the result box and one button (Try again / Continue). No scrolling.
3. **Phrase cards are optional and subtle.** No forced cards, no quick checks in the story.
   First time a phrase appears, 📖 glows with "New phrase". Correct answer shows
   "📖 Added to your phrasebook" (tap → flip card). Using 📖 in the end challenge costs the star.
4. **Card tips = Dave's pre-trip notes** (`CARD_TIPS` in `chapter1.js`): about the Greek
   only. Never story events, reactions, or explanations of wrong answers.
5. **One complete image per character pose. Never stack two images of the same character.**
   Dave's full body: `dave_full` only at the magnet beat (`prop:"magnet"`), otherwise
   `dave_full_no_magnet`. Reactions show as head-and-shoulders portraits
   (`dave_*/sharon_*` busts) in the result box and on Dave/Sharon's lines.
   Sharon's full-body expression sprites are consistent and still swap.
6. **Painted Greek signs must never be covered** by characters (see `[data-place="van"]`).
7. **Never name real apps/brands** (e.g. Duolingo). Sharon uses "her language app".
8. Mike likes Dave/Sharon chipping in on wrong answers. Adding more `exchange` lines is welcome.
9. Story is private (real Sidari, parody bar names). A public "Greek Odyssey" version comes
   later. Don't start it.

## Technical notes

- **Updates reaching phones:** Pages has *two* deployments running (Actions workflow
  *and* the classic branch build). The classic one publishes `sw.js` unstamped, so the cache
  name can't be relied on. That's why `sw.js` is now network-first for `.html/.js/.json`.
  Keep it that way. If you change caching, test an update on a phone that already has the
  old version saved.
- **Cards:** `PHRASES` is built in `chapter1.js` from `PHRASE_GROUPS`; cards are no longer
  story steps. Old saves pointing at `teach-*` steps resume at that phrase's moment.
  Sign cards use the accented lower-case spelling (`card.sign` holds the capitals).
- **Known:** on a 320×568 screen a few results still need a small scroll (the button
  auto-scrolls into view). 375×667 and up fit.

## Still to do (in order)

1. **ElevenLabs Greek audio:** `docs/AUDIO_ELEVENLABS_BRIEF.md`. Mike's key is the repo
   secret `ELEVENLABS_API_KEY` (TTS + Voices read, 8,000-credit cap). Free plan:
   pre-generate MP3s via a manual workflow, dry run first, never log the key, add
   "Greek voices by ElevenLabs" in Settings. Codex chooses the voices.
2. More partner chip-ins on wrong answers (Mike's request, optional).
3. Art: no-magnet Dave expression sprites so his whole body can react
   (see `docs/ASSET_STATUS.md`, "Round 3").
4. Merge PR #2 into `main` when Mike says so.

## Superseded (don't build)

- Round 2's "wrong answers return at the end" pile → replaced by the Try again loop.
- Round 3's forced first-time cards + quick checks → replaced by optional 📖 cards.
