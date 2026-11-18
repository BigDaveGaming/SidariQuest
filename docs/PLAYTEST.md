# Chapter 1 playtest

## Open the game

Use the HTTPS testing link in the pull request. GitHub Pages uses the development branch with the **Chapter 1 playtest** workflow. Its expected URL is [bigdavegaming.github.io/SidariQuest](https://bigdavegaming.github.io/SidariQuest/).

If Pages is disabled, a repository administrator can open [Settings → Pages](https://github.com/BigDaveGaming/SidariQuest/settings/pages), select **GitHub Actions** under **Build and deployment → Source**, and allow `feature/chapter1-mobile-playtest` in the `github-pages` environment's deployment branch policy if restrictions are enabled. Then re-run the latest **Chapter 1 playtest** workflow from [Actions](https://github.com/BigDaveGaming/SidariQuest/actions). If there is no run to re-run, push a commit to the development branch to trigger it. Verify the run's deployment URL before sharing it.

To run locally from the repository root:

```sh
python -m http.server 8000
```

Open http://localhost:8000/. Loopback works for desktop service-worker testing. For an iPhone, use the HTTPS testing link.

## iPhone checklist

1. Open the game in Safari in portrait. Confirm the title, menu and character cards fit with the address bar visible. Pick either character. Scroll the dialogue after a wrong answer and check that **Try again** stays reachable.
2. At the hire desk, pick two different wrong greetings and read both reactions. Check that you must choose **Καλημέρα!** before you can continue. Try an incorrect word order when asking for the van.
3. Leave at the hire desk, reload, and choose **Continue Adventure**. Check the checkpoint, pronunciation and translation settings. Finish the apartment and mini-market scenes and note your final fig total.
4. Open the phrasebook, replay Chapter 1, and check that the balance stays fixed. Choose the other character and check **Είμαι έτοιμος** for Dave and **Είμαι έτοιμη** for Sharon.
5. Try a speaker button with a Greek iOS voice available. In Settings, check the slow-audio toggle. If the speaker is disabled, look for a Greek voice under iOS accessibility speech settings. Voice availability and offline speech depend on the device.
6. With the game first fully loaded online, close it and reopen it in Airplane Mode. Repeat from the Home Screen after using Safari’s **Share → Add to Home Screen**. Check the icon, loading, safe areas, both title and dialogue controls, and whether the device’s Greek voice works offline.

Report a bug through [GitHub Issues](https://github.com/BigDaveGaming/SidariQuest/issues/new) or on the playtest pull request. Include the testing URL, iPhone model, iOS version, Safari tab or Home Screen, player character, scene, exact taps, expected result, actual result, and a screenshot or short recording if practical. Mention whether this was a fresh or resumed game, and whether you were offline.

## Automated smoke test

With Python Playwright and the requested browser installed:

```sh
python tests/playtest.py --engine chromium
python tests/playtest.py --engine webkit
```

The test serves the project under a GitHub Pages-style subpath. It checks both characters, two distinct wrong choices, incorrect tile order and retry, reload after both incorrect and correct answers, phrasebook, replay rewards, saved settings, manifest icon dimensions, offline navigation and small/large viewports. Physical iPhone safe-area, Home Screen and system voice behavior require on-device testing.
