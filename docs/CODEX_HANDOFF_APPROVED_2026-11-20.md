# Sidari Quest — approved gameplay and story handoff (20 November 2026)

**For Codex. Read this document alongside `docs/CHAPTER1_ROUND2_BRIEF.md` and the existing Chapter 1 implementation. This document supersedes any conflicting story, wrong-answer, rewards, and save-menu instructions in earlier briefs.**

## Status and guardrails

The project owner has **personally completed Chapter 1 as BOTH Dave and Sharon on a physical iPhone**. Preserve the working iPhone playthrough, art, dialogue controls, offline support, checkpoints, speech settings, and Greek learning features. This is not a request to replace the app or rewrite everything. Implement changes incrementally on the active development branch `feature/chapter1-mobile-playtest`, reconcile with `main`, test, and submit a PR for review; **do not merge automatically**. If the existing branch/PR state has changed, inspect it first.

The central premise is **“Learn Greek. Cause Chaos.”** The player learns practical modern spoken Greek by making dialogue choices, including deliberately absurd wrong ones. The resulting character reactions are part of the entertainment, not disposable error messages.

## 1. Canon: long summer holiday, NOT moving to Greece

Dave and Sharon are on a **long summer holiday in Corfu**, not relocating. Remove any prologue references to them moving to or living permanently in Greece.

- Dave heard from a bloke in the pub that speaking Greek gets you “local prices”, supposedly half what tourists pay. **This is false**, and should never be presented as factual travel advice. Dave believes it and keeps seeking imaginary discounts.
- **Gobby Sharon is NOT the sensible voice of reason**. She is every bit as overconfident as Dave. She thinks she can already speak Greek because she does **Duolingo in the bath**, and she is proud of her streak. She also believes that speaking Greek will help with prices. She has some real vocabulary but often impractical sentences, and makes mistakes herself.
- Dave is convinced he knows enough Greek to save money, hire a van and buy beer. Their competing confidence, mutual teasing and gradual actual learning power the comedy.
- Sharon says **“luv”**, not “darlin’”. Avoid exaggerated fake Scouse expressions. Locals are generally grounded and sensible; the visitors cause the chaos.
- The battered Greek phrasebook remains a teaching device; Sharon's Duolingo habit and phrasebook can coexist. Dave's notes can include “ASK FOR LOCAL PRICE”.

## 2. REPLACE plane-snoring intro: opening cutscene as the plane lands

Replace the existing image/story of Dave asleep or snoring. The plane is **descending towards Corfu**, with the island and sea visible through the windows. **Dave is awake and excited; Sharon is on her phone finishing Duolingo.** Use character expressions and a dialogue-led cutscene. This is the prologue, **not a quiz**. Keep it brisk, tap-to-advance, and skippable on replay.

### Approved dialogue — “Final Approach”

**Dave:** “Look at that, Shaz. We're nearly there!”

**Sharon:** “Hang on, Dave. I've got one question left.”

**Dave:** “You've been on that thing the whole flight.”

**Sharon:** “It's called learning Greek, luv. I've got a 187-day streak.”

**Dave:** “Well, I've got a better idea. Fella down the pub reckons if you speak Greek, you get local prices. Half what the tourists pay.”

**Sharon:** “Well, obviously. That's why I've been learning it.”

**Dave:** “Go on, then. Say something.”

**Sharon:** “Η χελώνα τρώει φράουλες.”

**Dave:** “What's that?”

**Sharon:** “The turtle eats strawberries.”

**Dave:** “Sound. Ask the turtle where we get cheap beer.”

**Sharon:** “At least I can speak it. What do you know?”

**Dave:** “Kalimari.”

**Sharon:** “That's squid, Dave.”

**Dave:** “See? We'll never starve.”

*[The plane banks over the water towards the runway.]*

**Dave:** “Anyway, I've sorted us out. Three hundred quid a week, Shaz. All-inclusive. For the whole summer. I've still got it.”

**Sharon:** “You'd better have, Dave.”

*[Sharon returns to her phone. Dave grins out of the window, unaware of the self-catering surprise.]*

**Production note:** The “Kalimari”/squid exchange is an intentional character joke about a mistaken word, not a phrase to teach as correct Greek. The Greek sentence `Η χελώνα τρώει φράουλες.` means “The turtle eats strawberries.” Dave's “local prices” theory is a running misconception.

**Art:** Update/recreate the existing plane-landing scene so Dave is visibly awake, Sharon is using her phone, and the existing approved designs/style remain consistent. Do not replace the geographic shape of Corfu with an invented generic island. Keep the established intro sequence as appropriate, but replace the old snoring opening.

## 3. Preserve “YOU SAID…” → actual reaction → have another go

This mechanic is **non-negotiable** and one of the game's strongest features. The owner, who already knows enough Greek to pass Chapter 1, intentionally selected **«Καλή όρεξη!»** at the van-hire desk simply to see the reaction.

For an incorrect dialogue choice:
1. Show **“YOU SAID: [literal English meaning]”** and the actual Greek phrase selected.
2. Show the **scripted local reaction**, followed by Dave/Sharon's character-specific comedy response.
3. Give a short, accurate explanation of what the phrase means and the appropriate response.
4. Let the player **“Have another go”** and proceed when correct. Preserve a way to encounter all wrong reactions on replays.
5. Do not turn this into a generic red X or impersonal “incorrect” quiz panel.

**Specific approved reaction for choosing `Καλή όρεξη!` (“Enjoy your meal!”) instead of greeting Spyros at van hire:**

**Playing as BIG DAVE:**
- Spyros: **“Thank you. But I am not eating.”**
- Sharon: **“He's trying to hire a van, not feed you, luv.”**
- Dave: **“Just being polite, weren't I?”**

**Playing as GOBBY SHARON:**
- Spyros: **“Thank you. But I am not eating.”**
- Dave: **“He's got a point, Shaz. Unless the clipboard's edible.”**
- Sharon: **“Oh, shut up, Dave. I'm learning.”**

Then explain `Καλή όρεξη!` = “Enjoy your meal!”; for the morning van-hire greeting the correct answer is `Καλημέρα!` (“Good morning!”). Show **Have another go**. Keep the local's exact line and the character-specific responses as above. Preserve other funny wrong options and their individual reactions, not just this one.

**Important design refinement:** A player may deliberately choose wrong answers to enjoy the comedy. **Do not punish exploration in story dialogue by reducing chapter stars.** Where the older Round 2 brief says “wrong answer goes into a Have another go pile”, retain its learning intent, but do not delay the in-scene character reaction or remove the immediate opportunity to retry. If missed phrases need spaced review, implement that as a separate end-of-lesson practice flow, not a substitute for the story's “Have another go” interaction.

## 4. Replace FIG rewards with STARS — separate story exploration from assessment

Remove the fig **currency/reward mechanic** in favour of a simple **1–3 star rating per completed chapter**. A decorative fig in the artwork may remain if it makes sense; it must not function as points/currency.

**Strong preference:** Do **not** deduct stars because the player intentionally explored funny wrong dialogue options in the story. Instead, award stars based on a **short, clearly labelled end-of-chapter Greek challenge** covering phrases actually taught in that chapter, with no story-comedy penalty. Use accuracy and optional hint use in this assessment, not story-dialogue wrong answers.

- **3 stars** = strong independent performance.
- **2 stars** = good performance, some errors or assistance.
- **1 star** = chapter completed, substantial help or errors.
- Completing the chapter always earns **at least one star**.
- Show best stars per chapter, **separately for Dave and Sharon**.
- Replaying a chapter can improve stars, **never lower** the saved best.
- The challenge must be short enough not to kill the pacing; no need to repeat all four exercise formats for every phrase.
- No star penalty for using the wrong answer intentionally to see a joke in normal story mode.

**Migration:** Existing `sidariQuest` localStorage progress includes `figs`, `completedLessons`, `runs`, etc. Inspect actual save schema before editing. Migrate safely: preserve completed chapters, checkpoints, chosen character, language/audio preferences, and historical progress. Do not fabricate “3 stars” from figs; a safe default for legacy completed chapters is **1 completion star** until the player replays the new challenge. Do not erase old saves on update. Tests should cover migration.

## 5. New Game, Continue, Replay, Change Character, Reset

Owner completed Chapter 1 with both characters on iPhone and needs a way to start over.

- **Continue Adventure:** resume current character's checkpoint; handle already-completed Chapter 1 gracefully (chapter select / replay, not dead end).
- **New Game:** choose Dave or Sharon and begin Chapter 1 again. Explicit confirmation before overwriting that character's current story run. **Reset only the selected character by default**; never silently erase the other character.
- **Replay Chapter:** replay completed story and jokes without losing earned best stars or learning achievements. Replaying can improve the rating via a new end-of-chapter challenge.
- **Change Character:** preserve each character's independent run/checkpoint, completion and star records.
- **Reset Progress:** optional explicit full-reset action in settings, with clear warning/confirmation.
- **Preserve global preferences** (transliteration, translations, audio speed, etc.) across New Game and story resets.
- Clarify in UI whether New Game resets the selected character's story run versus a full data wipe. Prefer preserving unlocked learning records and best stars for ordinary replay; use an explicit **“Erase this character's progress”** action if a truly clean save is needed.
- Avoid save corruption if users switch characters, restart, refresh mid-scene, replay, or reopen from iPhone Home Screen.

## 6. Keep the valuable Round 2 teaching and story changes

Continue to implement `docs/CHAPTER1_ROUND2_BRIEF.md` **except where superseded above**:
- Teach **2–3 practical phrases before each scene beat**, using the battered phrasebook, spoken Greek, optional transliteration, word-by-word chips, one tip, and a quick check. **Never test untaught Greek.**
- Build a difficulty progression across the lesson (recognise → recall → word tiles → real scene use), **not four tedious drills for every new phrase**.
- Word tiles should drag/reorder on iPhone Safari via pointer events, with tap alternatives and appropriate spoken feedback.
- The apartment's **all-inclusive vs self-catering** reveal remains: Eleni greets them `Καλώς ήρθατε!`; teach `πρωινό`, `βραδινό`, `κουζίνα`; ask about breakfast and dinner; Eleni reveals the kitchen (two rings, kettle, empty fridge); Sharon finds “self-catering” on the booking; they head to the mini-market. Adapt reactions for selected character. Remove illogical “where is the apartment?” question.
- Overlay accurate Greek signage **on the painted boards** (van hire `ΕΝΟΙΚΙΑΣΕΙΣ ΑΥΤΟΚΙΝΗΤΩΝ`; arrivals `ΑΦΙΞΕΙΣ`, `ΑΠΟΣΚΕΥΕΣ`, `ΕΞΟΔΟΣ`) rather than a detached banner. Check 320/390/430px.
- Keep verified Greek intact unless a change specifically requires adjustment. Maintain offline service-worker/cache versioning and character-specific checkpoints.

## 7. Geographic accuracy

Any Corfu map (including chapter selection, transitions or decorative location images) must reflect **real Corfu coastline and orientation**; Sidari on the north coast, Corfu Town and airport farther south. Do not use an invented generic island outline or misleading invented roads. If accurate geography cannot be produced in this round, avoid displaying a fake map and log the asset as a known issue.

## 8. Acceptance checks / delivery

1. Physically or via iOS/WebKit-equivalent checks, Chapter 1 is completable as **both characters**; the real iPhone owner will retest.
2. Plane opening has **awake Dave and Duolingo Sharon**, approved lines, correct long-holiday premise, and is skippable on replay.
3. At van hire, `Καλή όρεξη!` triggers the **exact** approved local + Dave/Sharon reactions; “YOU SAID” and “Have another go” remain usable on iPhone.
4. Other wrong answers still yield distinctive funny reactions, and are accessible on replay.
5. No fig points are awarded; stars are based on a brief end-chapter Greek assessment, **not on exploratory wrong story choices**. Saved best rating never decreases.
6. New Game, Continue, Replay, Change Character and reset confirmations work; existing saves migrate without loss.
7. Untaught phrases are introduced before assessment; phrasebook, audio, touch word tiles, signs, and self-catering payoff function.
8. No fake Corfu map; responsive mobile layout, safe areas, reload/checkpoint, offline PWA and tests continue working.
9. Update tests/docs for new semantics. Provide a concise implementation report with files changed, tests run, limitations and a working playtest link if verified.
10. Open/update PR for review. **Do not auto-merge.**

**Scope priority:** (1) preserve comedy + exact dialogue and plane prologue; (2) save/replay flows; (3) stars + migration; (4) Round 2 teaching/UI; (5) map/art polish. Preserve the working build at each step.
