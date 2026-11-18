"use strict";

const SAVE_KEY = "sidariQuest";
function loadProgress(storage) {
  let saved = {};
  try { saved = JSON.parse(storage.getItem(SAVE_KEY)) || {}; } catch {}
  return {
    c: ["m", "f"].includes(saved.c) ? saved.c : null,
    tr: saved.tr !== false,
    slow: saved.slow === true,
    english: saved.english === true,
    figs: Number.isSafeInteger(saved.figs) && saved.figs >= 0 ? saved.figs : 0,
    completedLessons: Array.isArray(saved.completedLessons) ? saved.completedLessons : [],
    runs: saved.runs && typeof saved.runs === "object" ? saved.runs : {},
    phrases: saved.phrases && typeof saved.phrases === "object" ? saved.phrases : {}
  };
}

function completeChapter(progress, chapter, run, wasLegacyQuestion) {
  // Finished van-hire saves already received the legacy lesson reward.
  const legacy = chapter === "chapter1" && progress.completedLessons.includes("chapter1-lesson1");
  if (progress.completedLessons.includes(chapter)) return 0;
  const figs = Object.entries(run.answers)
    .filter(([step, result]) => result === "first" && (!legacy || !wasLegacyQuestion(step))).length;
  progress.completedLessons.push(chapter);
  progress.figs += figs;
  return figs;
}
