"use strict";

const SAVE_KEY = "sidariQuest";
const CHARACTERS = ["m", "f"];

function loadProgress(storage) {
  let saved = {};
  try { saved = JSON.parse(storage.getItem(SAVE_KEY)) || {}; } catch {}
  const c = CHARACTERS.includes(saved.c) ? saved.c : null;
  const completedLessons = Array.isArray(saved.completedLessons) ? saved.completedLessons : [];
  const best = {};
  for (const character of CHARACTERS) {
    const stars = saved.best?.[character];
    best[character] = Number.isInteger(stars) && stars >= 1 && stars <= 3 ? stars : 0;
  }
  // The old completion flag was shared. Credit its last selected character once.
  if (saved.version !== 2 && c && completedLessons.includes("chapter1")) best[c] ||= 1;

  const runs = {};
  for (const character of CHARACTERS) {
    const key = "chapter1-" + character;
    const run = saved.runs?.[key];
    if (run && typeof run === "object") {
      const step = run.step || (Number.isInteger(run.idx) && run.idx >= 0 && run.idx <= 34 ? "legacy-" + run.idx : null);
      if (!step) continue;
      const answers = Object.fromEntries(Object.entries(run.answers || {}).map(([id,result]) =>
        [/^\d+$/.test(id) ? "legacy-" + id : id, result]
      ));
      if (!run.step) delete answers["legacy-24"]; // The breakfast question replaced an unrelated exchange.
      runs[key] = {...run, step, answers, learned: run.learned || {}, challenge: run.challenge || {}};
    }
  }

  return {
    version: 2, c, tr: saved.tr !== false, slow: saved.slow === true, english: saved.english === true,
    completedLessons, runs, best,
    phrases: saved.phrases && typeof saved.phrases === "object" ? saved.phrases : {},
    visited: {m: !!saved.visited?.m || !!best.m, f: !!saved.visited?.f || !!best.f},
    // Keep prior points as history only. They have no value in the star system.
    legacyFigs: saved.legacyFigs ?? saved.figs ?? 0
  };
}

function newRun() {
  return {step:"legacy-0", answers:{}, learned:{}, challenge:{}, cutscene:0};
}

function completeChapter(progress, character, challenge) {
  const results = Object.values(challenge);
  const correct = results.filter(answer => answer.correct).length;
  const stars = correct === 3 && results.every(answer => !answer.hint) ? 3 : correct >= 2 ? 2 : 1;
  progress.best[character] = Math.max(stars, progress.best[character]);
  if (!progress.completedLessons.includes("chapter1")) progress.completedLessons.push("chapter1");
  return stars;
}
