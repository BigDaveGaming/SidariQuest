# Chapter 1 technical audit

Baseline inspected at `0210bbc` on `feature/comedy-dialogue-chapter1`. Reviewed the README, concept, art brief, asset status, HTML/CSS/JS, manifest, service worker, source artwork, references and WebPs.

| Baseline | Finding | Playtest change |
| --- | --- | --- |
| Title and character selection | Existing approved title artwork, character cards and basic settings were wired. Fixed positioning, disabled zoom and small targets made narrow phones less forgiving. | Kept the title art, enabled browser zoom, added short-height and safe-area styling, scrollable character selection and larger targets. |
| Hire desk | Single playable lesson had shuffled choices, wrong-answer retry, word tiles, gendered Greek and a summary. Most distractors shared a joke, and the intro, apartment and shops from the concept were absent. | Kept the hire desk and added a three-beat intro, apartment and mini-market exchanges, option-specific comedy, and a chapter ending. |
| Progress | Settings and fig balance persisted. Lesson position and learned phrases reset. Abandoning a run before completion let the player repeat first-try awards. | Added per-character checkpoints, a persistent shared phrasebook, and one chapter payout on first completion. Preserves existing balances and skips the legacy van payout for saves that already marked that lesson complete. Old partial rewards have no per-question audit trail. |
| Greek and speech | Some English instructions mentioned the wrong distractor. Speech could attempt playback without an available Greek voice or start outside a direct tap. | Corrected booking phrasing, drink gender and naturally useful exchanges. Speech uses a Greek voice when available, with separate slow playback and written aids. Latin letters are an approximation. |
| Static app | Manifest URLs were correctly relative. The old worker used a fixed cache key, cached HTML indefinitely and deleted unrelated origin caches. | Precache now follows the shell and registered artwork, serves the chapter offline after a successful first load, and removes only this game’s older cache versions. The deploy workflow stamps the cache with the commit SHA. |
| Scope | Game data, state and view lived in one HTML file. No deployment workflow was present. | Moved the chapter script and progress handling into small independent scripts. The view remains in the original HTML. Pages packages only runtime files from the playtest branch. |

The prototype’s art and chapter scope diverged. The brief supplies four backgrounds and four locals for three locations, while the baseline used a CSS van office, emoji Spyros, and none of the other scenes. The approved design sheet's side labels assign older roles. The asset status supersedes those labels and defines the filenames for renamed moods.

See the [artwork review and production list](CHAPTER1_ART_PRODUCTION.md) and the [iPhone testing instructions](PLAYTEST.md).
