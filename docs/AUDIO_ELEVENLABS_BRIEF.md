# Greek audio with ElevenLabs (for Codex)

Replace the phone's robotic Greek voice with pre-recorded ElevenLabs audio. Recordings are
generated **once** by a GitHub Action, committed to the repo as MP3s, cached offline, and
played by the game. The phone voice stays as a fallback.

## Setup already done by Mike
- ElevenLabs account on the **free plan** (10,000 credits/month).
- API key saved as the repository secret **`ELEVENLABS_API_KEY`**.
- Key is restricted to **Text to Speech: Access** and **Voices: Read**, with an **8,000 credit
  cap**. Nothing else is allowed.
- **Never** print, log, echo or commit the key. Never call ElevenLabs from the browser.

---

## 1. GitHub Action: "Generate Greek audio"

- Trigger: **`workflow_dispatch` only** (a manual **Run workflow** button). Never on push.
- Inputs:
  - `dry_run` (boolean, default **true**): list the lines that would be generated, the
    character count and the estimated credits, then stop without calling ElevenLabs.
  - `regenerate` (optional text): IDs or texts to force-regenerate.
- Permissions: `contents: write` (to commit the MP3s back). Runs on the branch it's started from.
- Steps: check out → run the script → commit any new files in `assets/audio/` and the
  manifest with a message like "Add Greek audio (N lines)" → push.

## 2. The script (`scripts/generate-audio.*`)

1. **Collect every Greek string the game can speak** from the chapter data:
   local lines, options, sign text, build answers, phrase cards **and each word in the
   word-by-word breakdowns**, challenge items, and anything else passed to `speak()`.
   - Expand `{PG}` for **both** characters (Ντέιβ and Σάρον) and both `m`/`f` gendered forms.
   - For sign text in capitals, generate from the **lower-case accented** spelling (e.g.
     «Ενοικιάσεις αυτοκινήτων»). Capitals have no accents and are read badly.
   - Normalise whitespace. Keep punctuation (it affects intonation). Remove duplicates.
2. **File naming:** `assets/audio/<hash>.mp3`, where hash = short SHA-1 of
   `text + voice_id + model_id`. Changing a line, voice or model automatically makes a new file.
3. **Manifest:** `assets/audio/manifest.json` mapping `text → file` (and voice). The game reads this.
4. **Only generate what's missing.** Skip any text already in the manifest with an existing file.
5. **Budget guard:** before calling the API, total the characters for missing lines. If that would
   exceed **7,500 credits** in one run, stop with a clear message listing what was skipped. (The
   key itself is capped at 8,000.)
6. **API call:** ElevenLabs Text to Speech, with a model that supports Greek well (multilingual),
   `language_code: "el"` if the model supports it, MP3 output at a small bitrate (~64 kbps mono
   is plenty for short phrases). Retry once on a 429/5xx, then fail that line and carry on.
7. Print a summary: generated, skipped, failed, credits used (approximate).

## 3. Voices

Mike hasn't picked voices. **Choose them yourself**, then list your choices (voice name and ID)
in this doc so they can be changed later.
- Pick voices that sound natural speaking **Greek** (native or near-native Greek accent).
  Listen to/test a few Greek lines before committing to one.
- If library/shared voices aren't usable through the API on the free plan, use the best
  premade voices that handle Greek well. Don't upgrade the plan.
- Voice mapping (keep it in one config file so it's easy to change):
  - **Spyros Rent-a-Van:** male, 40s, friendly but wary
  - **Kyria Eleni:** older woman, warm
  - **Kyrios Spyros:** older man, gruff, measured
  - **Fat Spyros:** male, cheerful, relaxed
  - **Phrasebook / default** (cards, word breakdowns, options, player's own Greek lines):
    one clear, neutral voice, slightly slower delivery
- Dave and Sharon's **English** lines are **not** voiced. Greek only.

## 4. Game playback

- `speak(text)` first looks up `text` in the manifest. If there's a file, play it with an
  `<audio>`/`Audio` element. If not, fall back to the current speechSynthesis voice.
- **🔊 normal / 🐢 slow:** slow uses `playbackRate ≈ 0.7` with `preservesPitch = true`
  (and the `webkit` prefix for Safari), so there's no need for separate slow recordings.
- **iPhone autoplay:** Safari blocks audio that isn't started by a tap. Auto-play on card open
  must fail silently. Unlock audio on the first user tap (e.g. Play or Let's go), and keep 🔊
  as the reliable way to hear a line.
- Stop any current audio before playing the next.
- **Offline:** add `assets/audio/manifest.json` and all audio files to the service worker
  precache (the commit-stamped cache version will pick them up).
- Keep downloads light: total audio for Chapter 1 should be well under 2 MB.

## 5. Attribution

The free plan requires crediting ElevenLabs when content is published. Add a small
"Greek voices by ElevenLabs" line to the Settings screen (and any credits screen).

## Acceptance checks
- Running the workflow with `dry_run: true` lists every Greek line and the estimated credits
  without spending any.
- A real run generates only missing lines, commits the MP3s and manifest, and never prints the key.
- Every Greek line in Chapter 1 (both characters, both gender forms, all card words) has a
  recording, or a clear "missing" entry in the run summary.
- 🔊 and 🐢 play the recordings on iPhone Safari, and work offline after the first load.
- Lines without a recording still speak using the phone voice.
- Chosen voices are documented here.
