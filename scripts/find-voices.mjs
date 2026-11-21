// Searches the ElevenLabs Voice Library and saves each voice's preview, so Mike can listen in the chat.
// Costs no credits. SEARCH="cockney, east end" (comma separated), GENDER=male.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets", "audio", "samples", "library");
const KEY = process.env.ELEVENLABS_API_KEY || "";
const API = process.env.ELEVENLABS_API_BASE || "https://api.elevenlabs.io/v1";
const terms = (process.env.SEARCH || "").split(",").map(term => term.trim()).filter(Boolean);
const gender = process.env.GENDER || "male";
if (!KEY) throw new Error("ELEVENLABS_API_KEY is not set.");

const found = new Map();
for (const term of terms) {
  const query = new URLSearchParams({page_size: "40", search: term, gender, language: "en"});
  const response = await fetch(`${API}/shared-voices?${query}`, {headers: {"xi-api-key": KEY}});
  if (!response.ok) throw new Error(`ElevenLabs ${response.status}: ${(await response.text()).slice(0, 200)}`);
  for (const voice of (await response.json()).voices || []) if (!found.has(voice.voice_id)) found.set(voice.voice_id, voice);
}
// Deep, gruff, older voices first; posh and young ones last.
const about = voice => `${voice.name} ${voice.accent || ""} ${voice.descriptive || ""} ${voice.description || ""} ${voice.age || ""}`;
const score = voice => {
  const text = about(voice);
  return (/deep|gravel|gruff|rough|raspy|husky|low|bass|hard|tough|gangster|geezer|east end|cockney/i.test(text) ? 3 : 0)
    + (/middle|old/i.test(voice.age || "") ? 2 : 0) - (/posh|rp\b|refined|young/i.test(text) ? 3 : 0);
};
const voices = [...found.values()].sort((a, b) => score(b) - score(a)).slice(0, Number(process.env.LIMIT || 12));
fs.rmSync(OUT, {recursive: true, force: true});
fs.mkdirSync(OUT, {recursive: true});
const list = [];
let n = 0;
for (const voice of voices) {
  if (!voice.preview_url) continue;
  const preview = await fetch(voice.preview_url);
  if (!preview.ok) continue;
  n++;
  const file = `${String(n).padStart(2, "0")}-${voice.name.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").slice(0, 40).toLowerCase()}.mp3`;
  fs.writeFileSync(path.join(OUT, file), Buffer.from(await preview.arrayBuffer()));
  list.push(`${file}\t${voice.name}\t${voice.accent || ""}\t${voice.age || ""}\t${(voice.description || voice.descriptive || "").replace(/\s+/g, " ").slice(0, 160)}`);
}
fs.writeFileSync(path.join(OUT, "list.tsv"), list.join("\n") + "\n");
console.log(`Saved ${list.length} previews:\n${list.join("\n")}`);
