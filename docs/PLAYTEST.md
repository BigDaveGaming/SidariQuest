# Chapter 1 playtest

## Open the game

Open the public [Chapter 1 playtest](https://bigdavegaming.github.io/SidariQuest/) in Safari. The deployment follows `feature/chapter1-mobile-playtest`.

If Pages is disabled, a repository administrator can open [Settings → Pages](https://github.com/BigDaveGaming/SidariQuest/settings/pages), select **GitHub Actions** under **Build and deployment → Source**, and allow `feature/chapter1-mobile-playtest` in the `github-pages` environment's deployment branch policy if restrictions are enabled. Then re-run the latest **Chapter 1 playtest** workflow from [Actions](https://github.com/BigDaveGaming/SidariQuest/actions). If there is no run to re-run, push a commit to the development branch to trigger it. Verify the run's deployment URL before sharing it.

To run locally from the repository root:

```sh
python -m http.server 8000
```

Open http://localhost:8000/. Loopback works for desktop service-worker testing. For an iPhone, use the HTTPS testing link.

## iPhone checklist

1. Open Safari in portrait. Play Final Approach, reload during a line, and resume. On replay, check the option to skip the prologue.
2. At the hire desk, choose **Καλή όρεξη!** as Dave and as Sharon. Check the Greek, literal English, Spyros’s reply, the two character lines, the explanation and **Have another go**. Explore another wrong choice.
3. Tap the phrasebook word chips and try **Play slowly** using a Greek iOS voice. At the word bank, drag a tile to the answer, reorder it and drag it back. Check the tap alternatives.
4. Play through the breakfast, dinner and kitchen reveal. Finish the three-question Greek challenge. On replay, open a challenge hint and verify that an earlier best rating stays saved.
5. Check the Greek text on the painted boards, on both the van hire and arrivals art. Try short and tall portrait screens and check that controls stay reachable.
6. In Settings, change characters and return to each saved checkpoint. Confirm that cancelling New Game keeps the old checkpoint and that accepting it restarts only the selected character. Only test Reset Progress with a disposable save.
7. After a full online load, reopen in Airplane Mode, including once from Safari’s **Share → Add to Home Screen**. Check the icon, safe areas, saved progress, and whether the device’s own Greek voice works offline.

Report a bug through [GitHub Issues](https://github.com/BigDaveGaming/SidariQuest/issues/new) or on the playtest pull request. Include the testing URL, iPhone model, iOS version, Safari tab or Home Screen, player character, scene, exact taps, expected result, actual result, and a screenshot or short recording if practical. Mention whether this was a fresh or resumed game, and whether you were offline.

## Automated smoke test

With Python Playwright and the requested browser installed:

```sh
python tests/playtest.py --engine chromium
python tests/playtest.py --engine webkit
```

The test serves the project under a GitHub Pages-style subpath. It covers both characters, the exact wrong-greeting dialogue, challenge hints and rating, save migration, independent restarts, pointer reorder and touch-button alternatives, viewport checks, and offline navigation after the server stops. Physical iPhone safe-area, Home Screen and system voice behavior require on-device testing.

Legacy completion was stored as a shared flag. The upgrade records a one-star completion for the selected character when that flag is present, keeps both checkpoints and the learned phrase list, and retains the former fig count as history without using it for ratings. The other character earns stars in their own challenge.
