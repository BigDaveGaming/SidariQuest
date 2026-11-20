#!/usr/bin/env node
// Generates the game's Greek audio with ElevenLabs, once, and saves it as MP3s.
// Run by .github/workflows/generate-audio.yml ("Generate Greek audio" in the Actions tab).
//
//   DRY_RUN=true     list the lines and the credits they'd use, spend nothing (default)
//   REGENERATE=...   exact Greek lines (one per line) to record again
//   ELEVENLABS_API_KEY  from the repo secret. Never printed.
//
// Only lines without a recording are sent, so nothing is paid for twice.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AUDIO = path.join(ROOT, "assets", "audio");
const MANIFEST = path.join(AUDIO, "manifest.json");
const VOICES = path.join(AUDIO, "voices.json");
const MODEL = "eleven_multilingual_v2";
const FORMAT = "mp3_22050_32";
const BUDGET = Number(process.env.BUDGET || 7500);
const DRY_RUN = process.env.DRY_RUN !== "false";
const REGENERATE = new Set((process.env.REGENERATE || "").split("\n").map(normalise).filter(Boolean));
const KEY = process.env.ELEVENLABS_API_KEY || "";
const API = process.env.ELEVENLABS_API_BASE || "https://api.elevenlabs.io/v1";

// Mirrors SCENES[...].local in index.html: who speaks in each place.
const SCENE_LOCAL = {van: "Spyros Rent-a-Van", apartment: "Kyria Eleni", kitchen: "Kyria Eleni", market: "Fat Spyros"};
// What each voice should sound like. Used only when voices.json has no voice for a role yet.
const ROLE_WANTS = {
  "phrasebook": {gender: "female", age: ["middle_aged", "young"], note: "clear, neutral phrasebook voice"},
  "Spyros Rent-a-Van": {gender: "male", age: ["middle_aged", "young"], note: "40s, friendly but wary"},
  "Kyria Eleni": {gender: "female", age: ["old", "middle_aged"], note: "older woman, warm"},
  "Kyrios Spyros": {gender: "male", age: ["old", "middle_aged"], note: "older man, gruff"},
  "Fat Spyros": {gender: "male", age: ["middle_aged", "old"], note: "cheerful, relaxed"},
  // Dave and Sharon: ordinary, down-to-earth British voices. Nothing posh. They also say
  // their own Greek answers in the story in this voice (the 🔊 buttons stay proper Greek).
  "Dave": {gender: "male", age: ["middle_aged", "old"], note: "ordinary British bloke, not posh", english: true},
  "Sharon": {gender: "female", age: ["middle_aged", "young"], note: "ordinary British woman, not posh", english: true}
};
const PLAYER = {m: "Dave", f: "Sharon"};
const NAMES = {m: "Ντέιβ", f: "Σάρον"};
const GREEK = /[Ͱ-Ͽἀ-῿]/;

function normalise(text) {
  return String(text || "").normalize("NFC").replace(/\s+/g, " ").trim();
}
function variants(value) {
  const forms = value && typeof value === "object" && "m" in value ? [value.m, value.f] : [value];
  return forms.flatMap(text => /\{PG\}/.test(String(text))
    ? Object.values(NAMES).map(name => String(text).replaceAll("{PG}", name))
    : [text]);
}
function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}

// ---------- 1. Collect every Greek line the game can speak ----------
function loadChapter() {
  const sandbox = {};
  vm.createContext(sandbox);
  const source = fs.readFileSync(path.join(ROOT, "chapter1.js"), "utf8");
  vm.runInContext(`${source}
    ;this.data = {steps: STORY_STEPS, phrases: PHRASES,
      challenge: typeof CHALLENGE !== "undefined" ? CHALLENGE : [],
      approach: typeof FINAL_APPROACH !== "undefined" ? FINAL_APPROACH : []};`, sandbox);
  return sandbox.data;
}

// Keys: plain Greek text for the Greek voices; "Dave|text" / "Sharon|text" for their own voices.
function collectLines() {
  const {steps, phrases, approach} = loadChapter();
  const lines = new Map();
  const add = (value, role) => {
    for (const text of variants(value)) {
      const key = normalise(text);
      if (!key || !GREEK.test(key)) continue;
      // A line a local actually says gets that local's voice.
      const current = lines.get(key);
      if (!current || (current.role === "phrasebook" && role !== "phrasebook")) lines.set(key, {text: key, role});
    }
  };
  // Something Dave or Sharon says out loud, in their own voice. c is "m" or "f".
  const say = (value, c) => {
    const who = PLAYER[c];
    const forms = value && typeof value === "object" && "m" in value ? [value[c]] : [value];
    for (const form of forms) {
      const text = normalise(String(form || "").replaceAll("{PG}", NAMES[c]).replaceAll("{P}", who));
      if (text) lines.set(`${who}|${text}`, {text, role: who});
    }
  };
  let scene = null;
  for (const step of steps) {
    scene = step.scene || scene;
    const local = step.speaker || SCENE_LOCAL[scene] || "phrasebook";
    if (step.gr) add(step.gr, local);
    for (const option of step.opts || []) {
      if (option.gr) {
        add(option.gr, "phrasebook");
        for (const c of ["m", "f"]) say(option.gr, c);
      }
      for (const c of ["m", "f"]) {
        for (const [character, line] of option.exchange?.[c] || []) {
          const speakerKey = Object.keys(PLAYER).find(key => PLAYER[key] === character);
          if (speakerKey) say(line, speakerKey);
        }
      }
    }
    if (step.learn) add(step.learn[0], "phrasebook");
    if (step.answer) {
      add(step.answer, "phrasebook");
      for (const answer of variants(step.answer)) for (const word of String(answer).split(" ")) add(word, "phrasebook");
      for (const word of step.extra || []) add(word, "phrasebook");
      for (const c of ["m", "f"]) say(step.answer, c);
    }
    if (step.t === "me" && step.text) for (const c of ["m", "f"]) say(step.text, c);
    for (const [character, text] of step.lines || []) {
      const c = Object.keys(PLAYER).find(key => PLAYER[key] === character);
      if (c) say(text, c);
    }
  }
  for (const card of Object.values(phrases)) add(card.gr, "phrasebook");
  for (const [character, text] of approach) {
    const c = Object.keys(PLAYER).find(key => PLAYER[key] === character);
    if (c) say(text, c);
    else add(text, "phrasebook");
  }
  return lines;
}

// ---------- 2. Voices ----------
async function api(pathname, options = {}) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(API + pathname, {
      ...options,
      headers: {"xi-api-key": KEY, ...(options.headers || {})}
    });
    if (response.ok) return response;
    if (attempt === 0 && (response.status === 429 || response.status >= 500)) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      continue;
    }
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`ElevenLabs ${response.status} on ${pathname.split("?")[0]}: ${detail}`);
  }
}

async function chooseVoices(roles) {
  const chosen = readJson(VOICES, {});
  // Roles without a voice, or stuck with an English one, get (re)chosen.
  const pinned = roles.filter(role => chosen[role]?.name && !chosen[role]?.id);
  const missing = roles.filter(role => !pinned.includes(role)) .filter(role => !chosen[role]?.id
    || (chosen[role].greek === false && process.env.ALLOW_NON_GREEK !== "true"));
  if (!missing.length && !pinned.length) return chosen;
  if (!KEY) {
    console.log(`No API key, so voices for ${missing.join(", ")} can't be chosen yet.`);
    return chosen;
  }
  const {voices} = await (await api("/voices")).json();
  // A voice named in voices.json without an id is pinned to that role by name.
  for (const role of pinned) {
    const match = voices.find(voice => voice.name.toLowerCase().startsWith(chosen[role].name.toLowerCase()));
    if (!match) throw new Error(`voices.json names "${chosen[role].name}" for ${role}, but that voice isn't in My Voices.`);
    const english = (ROLE_WANTS[role] || {}).english;
    chosen[role] = {id: match.voice_id, name: match.name, labels: match.labels || {}, pinned: true,
      greek: english ? null : (match.labels?.language === "el" || /greek/i.test(`${match.labels?.accent || ""} ${match.name}`))};
    console.log(`Voice for ${role}: ${match.name} (picked by name)`);
  }
  const used = new Set(roles.filter(role => !missing.includes(role)).map(role => chosen[role].id));
  const labels = voice => voice.labels || {};
  // A native Greek voice matters most: an English voice reads Greek with an accent.
  // Only a voice that is itself Greek counts. (Many English voices list Greek as a language
  // they *can* speak, which isn't the same as sounding Greek.)
  const greek = voice => labels(voice).language === "el"
    || /greek|ελλην/i.test(`${labels(voice).accent || ""} ${voice.name || ""} ${voice.description || ""}`);
  // Voices Mike added himself beat ElevenLabs' built-in ones.
  const added = voice => voice.category && voice.category !== "premade";
  console.log("Voices on the account:");
  for (const voice of voices) {
    console.log(`  - ${voice.name} [${voice.category || "?"}] ${Object.values(labels(voice)).join(", ")}${greek(voice) ? " (Greek)" : ""}`);
  }
  // Locals first, so the phrasebook doesn't take the only Greek voice of a gender.
  for (const role of [...missing].sort((a, b) => (a === "phrasebook") - (b === "phrasebook"))) {
    const want = ROLE_WANTS[role] || ROLE_WANTS.phrasebook;
    const sameGender = voices.filter(voice => labels(voice).gender === want.gender);
    const candidates = sameGender.length ? sameGender : voices;
    const about = voice => `${Object.values(labels(voice)).join(" ")} ${voice.name || ""} ${voice.description || ""}`;
    const posh = voice => /posh|received pronunciation|\brp\b|refined|sophisticat|aristocrat|upper.class|classy|elegant|luxur|regal|proper/i.test(about(voice));
    const british = voice => /british|english|northern|cockney|scouse|liverpool|manchester|yorkshire|geordie|midlands|essex|london|working.class|down.to.earth/i.test(about(voice));
    const age = voice => want.age.indexOf(labels(voice).age) === 0 ? 2 : want.age.includes(labels(voice).age) ? 1 : 0;
    const score = want.english
      ? voice => (added(voice) ? 7 : 0) + (british(voice) ? 6 : 0) - (posh(voice) ? 8 : 0) - (greek(voice) ? 6 : 0)
          - (/american|australian/i.test(about(voice)) ? 3 : 0) + (used.has(voice.voice_id) ? 0 : 3) + age(voice)
      : voice => (greek(voice) ? 10 : 0) + (added(voice) && greek(voice) ? 2 : 0) + (used.has(voice.voice_id) ? 0 : 3) + age(voice);
    const pick = [...candidates].sort((a, b) => score(b) - score(a))[0];
    if (!pick) throw new Error("No ElevenLabs voices available on this account.");
    used.add(pick.voice_id);
    chosen[role] = {id: pick.voice_id, name: pick.name, why: want.note, labels: labels(pick), greek: want.english ? null : greek(pick)};
    const tag = want.english ? (posh(pick) ? " [sounds posh: add a down-to-earth British voice]" : " [English]")
      : greek(pick) ? " [Greek]" : " [not Greek: add Greek voices in ElevenLabs]";
    console.log(`Voice for ${role}: ${pick.name} (${Object.values(labels(pick)).join(", ")})${tag}`);
  }
  return chosen;
}

// ---------- 3. Generate what's missing ----------
const fileFor = (text, voiceId) =>
  crypto.createHash("sha1").update(`${text}|${voiceId}|${MODEL}`).digest("hex").slice(0, 12) + ".mp3";

async function main() {
  const lines = collectLines();
  const roles = [...new Set([...lines.values()].map(line => line.role))];
  const voices = await chooseVoices(roles);
  const manifest = readJson(MANIFEST, {lines: {}});
  const old = manifest.lines || {};

  const todo = [];
  const kept = {};
  for (const [key, {text, role}] of lines) {
    const voice = voices[role];
    const existing = old[key];
    const file = voice ? fileFor(text, voice.id) : existing?.file;
    const recorded = existing && existing.file === file && fs.existsSync(path.join(AUDIO, existing.file));
    if (recorded && !REGENERATE.has(text)) kept[key] = existing;
    else todo.push({key, text, role, voice, file});
  }

  const notGreek = roles.filter(role => voices[role] && voices[role].greek === false);
  if (!DRY_RUN && notGreek.length && process.env.ALLOW_NON_GREEK !== "true") {
    throw new Error(`Not recording: ${notGreek.join(", ")} would get an English voice. ` +
      "Add Greek voices to My Voices in ElevenLabs and run again, or tick \"Allow non-Greek voices\".");
  }
  if (!DRY_RUN) {
    fs.mkdirSync(AUDIO, {recursive: true});
    fs.writeFileSync(VOICES, JSON.stringify(voices, null, 2) + "\n");
  }
  const credits = todo.reduce((sum, line) => sum + line.text.length, 0);
  const summary = [
    `Lines in the game: ${lines.size} (Greek voices ${[...lines.values()].filter(line => !PLAYER.m.includes(line.role) && line.role !== "Sharon").length}, Dave and Sharon ${[...lines.values()].filter(line => line.role === "Dave" || line.role === "Sharon").length})`,
    `Already recorded: ${Object.keys(kept).length}`,
    `To record: ${todo.length} (about ${credits} credits)`,
    `Budget for this run: ${BUDGET} credits`
  ];
  console.log(summary.join("\n"));
  for (const line of todo) console.log(`  [${line.role}] ${line.text}`);

  let spent = 0, made = 0;
  const skipped = [], failed = [];
  if (!DRY_RUN) {
    if (!KEY) throw new Error("ELEVENLABS_API_KEY is not set. Add it under Settings → Secrets and variables → Actions.");
    fs.mkdirSync(AUDIO, {recursive: true});
    for (const line of todo) {
      if (!line.voice) { failed.push(`${line.text} (no voice)`); continue; }
      if (spent + line.text.length > BUDGET) { skipped.push(line.text); continue; }
      try {
        const response = await api(`/text-to-speech/${line.voice.id}?output_format=${FORMAT}`, {
          method: "POST",
          headers: {"Content-Type": "application/json", "Accept": "audio/mpeg"},
          body: JSON.stringify({
            text: line.text,
            model_id: MODEL,
            voice_settings: {stability: 0.55, similarity_boost: 0.75}
          })
        });
        fs.writeFileSync(path.join(AUDIO, line.file), Buffer.from(await response.arrayBuffer()));
        kept[line.key] = {file: line.file, role: line.role};
        spent += line.text.length;
        made++;
      } catch (error) {
        failed.push(`${line.text}: ${error.message}`);
      }
    }
    // Keep only lines the game still uses, and remove recordings nothing points to.
    const sorted = Object.fromEntries(Object.entries(kept).sort(([a], [b]) => a.localeCompare(b, "el")));
    fs.writeFileSync(MANIFEST, JSON.stringify({
      model: MODEL,
      voices: Object.fromEntries(Object.entries(voices).map(([role, voice]) => [role, voice.name])),
      lines: sorted
    }, null, 2) + "\n");
    const inUse = new Set(Object.values(sorted).map(entry => entry.file));
    for (const file of fs.readdirSync(AUDIO)) {
      if (file.endsWith(".mp3") && !inUse.has(file)) fs.unlinkSync(path.join(AUDIO, file));
    }
  }

  const result = DRY_RUN
    ? ["**Practice run: nothing was sent to ElevenLabs.** Run again with the practice box unticked to record."]
    : [`Recorded ${made} lines, about ${spent} credits.`,
       skipped.length ? `Skipped ${skipped.length} to stay within the budget. Run again to record them.` : "",
       failed.length ? `Failed ${failed.length}:\n${failed.map(line => `- ${line}`).join("\n")}` : ""];
  const report = ["## Greek audio", ...summary.map(line => `- ${line}`), "",
    "### Voices", ...roles.map(role => `- ${role}: ${voices[role]?.name || "not chosen yet"}`), "",
    ...result.filter(Boolean)].join("\n");
  console.log("\n" + result.filter(Boolean).join("\n"));
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + "\n");
  if (!DRY_RUN && failed.length && !made) process.exitCode = 1;
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
