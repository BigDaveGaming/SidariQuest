"""Browser smoke test. Run with Python Playwright and Chromium or WebKit installed."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        return super().translate_path(path.removeprefix("/SidariQuest"))

    def log_message(self, *args):
        pass


def answer_text(value, character):
    if isinstance(value, dict):
        value = value[character]
    return value.replace("{PG}", "Σάρον" if character == "f" else "Ντέιβ").replace(
        "{P}", "Sharon" if character == "f" else "Dave"
    )


def option(panel, label):
    return panel.locator(".opt").filter(has_text=label).first


def drag(page, origin, target, edge=0.5, touch=None):
    origin.scroll_into_view_if_needed()
    start = origin.bounding_box()
    end = target.bounding_box()
    assert start and end
    x1, y1 = start["x"] + start["width"] / 2, start["y"] + start["height"] / 2
    x2, y2 = end["x"] + end["width"] * edge, end["y"] + end["height"] / 2
    if touch:
        touch.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x1, "y": y1}]})
        for frame in range(1, 9):
            touch.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [
                {"x": x1 + (x2 - x1) * frame / 8, "y": y1 + (y2 - y1) * frame / 8}
            ]})
        touch.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
    else:
        page.mouse.move(x1, y1)
        page.mouse.down()
        page.mouse.move(x2, y2, steps=8)
        page.mouse.up()


def play(page, character, *, explore=False, help_on_challenge=False, replay=False, touch=None):
    page.locator("#bPlay").click()
    if page.locator("#select").is_visible():
        page.locator(f'.card[data-c="{character}"]').tap()
        page.locator("#bGo").tap()
    panel = page.locator("#panel")
    assert panel.get_by_text("Final Approach", exact=True).is_visible()
    if replay:
        panel.get_by_role("button", name="Skip prologue").tap()
    else:
        assert panel.get_by_role("button", name="Skip prologue").is_hidden()
        lines = page.evaluate("FINAL_APPROACH")
        for i, (_, line, *_) in enumerate(lines):
            assert panel.get_by_text(line, exact=True).is_visible()
            if i == 3 and explore:
                page.reload()
                page.get_by_role("button", name="Continue Adventure").tap()
                assert panel.get_by_text(line, exact=True).is_visible()
            panel.get_by_role("button", name="Next line" if i < len(lines) - 1 else "Continue", exact=True).tap()
    taught = set()
    locals_seen = set()
    for step in page.evaluate("steps.slice(1)"):
        kind = step["t"]
        if kind == "teach" and page.evaluate("run.step") != step["id"]:
            # Phrases learned on an earlier play skip their card and live behind 📖.
            assert page.evaluate("(id) => isKnown(id)", step["phrase"])
            taught.add(step["phrase"])
            continue
        assert page.evaluate("run.step") == step["id"]
        if page.locator("#cast").is_visible():
            body = page.locator("#player")
            assert page.locator("#playerActor img").count() == 1
            if character == "m":
                expected = "assets/dave_full.webp" if step.get("prop") == "magnet" else "assets/dave_full_no_magnet.webp"
                assert body.get_attribute("src") == expected
            page.wait_for_function("document.querySelector('#player').naturalWidth > 0")
            local = page.locator("#localFigure").get_attribute("alt")
            if local not in locals_seen:
                page.wait_for_function("document.querySelector('#localFigure').naturalWidth > 0")
                locals_seen.add(local)
        if kind == "teach":
            assert panel.locator(".pb-front .pb-head").is_visible()
            assert panel.get_by_role("button", name="Got it").is_hidden()
            panel.locator(".pb").tap()
            page.wait_for_timeout(600)
            assert panel.locator(".pb.flipped").count() == 1
            if step["phrase"] == "van" and explore:
                assert panel.locator(".pb-words dd").first.inner_text() == "would"
            panel.get_by_role("button", name="Got it").tap()
            taught.add(step["phrase"])
            while panel.locator(".q-head .who").filter(has_text="Quick check").count():
                greek = panel.locator(".q-head .g").first.inner_text()
                english = page.evaluate(
                    "(gr) => fill(Object.values(PHRASES).find(card => fill(card.gr) === gr).en)", greek)
                option(panel, english).tap()
                assert panel.locator(".fb.good").is_visible()
                panel.locator(".next").tap()
            continue
        if kind == "challenge":
            assert panel.get_by_role("heading", name="Greek challenge").is_visible()
            assert {step["phrase"], *step["alternatives"]} <= taught
            card = page.evaluate("(id) => PHRASES[id]", step["phrase"])
            if help_on_challenge and step["phrase"] == "handover":
                panel.locator(".hint-btn").tap()
                assert page.locator("#hintSheet.on .pb").is_visible()
                page.locator("#bHintClose").tap()
                distractor = page.evaluate("(id) => PHRASES[id]", step["alternatives"][0])
                option(panel, answer_text(distractor["en"], character)).tap()
            else:
                label = answer_text(card["gr" if step.get("recall") else "en"], character)
                option(panel, label).tap()
            if step["phrase"] == "handover" and explore and not help_on_challenge:
                page.reload()
                page.get_by_role("button", name="Continue Adventure").tap()
                assert page.evaluate("run.challenge['challenge-handover'].correct")
            panel.locator(".next").tap()
            continue
        if kind in {"q", "build"}:
            assert step["phrase"] in taught
        if kind == "q":
            if explore and step["phrase"] == "morning":
                option(panel, "Καλή όρεξη!").tap()
                if character == "m":
                    assert body.get_attribute("src") == "assets/dave_full_no_magnet.webp"
                assert panel.locator(".fb .react-face img").get_attribute("src") == (
                    "assets/dave_cringe.webp" if character == "m" else "assets/sharon_cringe.webp")
                assert panel.get_by_text("YOU SAID: Enjoy your meal!", exact=True).is_visible()
                assert panel.locator(".said-greek").inner_text() == "Καλή όρεξη!"
                assert [x.split(" ", 1)[0] for x in panel.locator(".reaction-line").all_inner_texts()] == (
                    ["Spyros", "Dave", "Sharon"] if character == "f" else ["Spyros", "Sharon", "Dave"]
                )
                expected = (
                    ["He's got a point, Shaz. Unless the clipboard's edible.", "Oh, shut up, Dave. I'm learning."]
                    if character == "f" else
                    ["He's trying to hire a van, not feed you, luv.", "Just being polite, weren't I?"]
                )
                for line in ["Thank you. But I am not eating.", *expected]:
                    assert panel.get_by_text(line, exact=False).count()
                assert not panel.get_by_role("button", name="Continue", exact=True).count()
                panel.get_by_role("button", name="Have another go", exact=True).tap()
                option(panel, "Καληνύχτα!").tap()
                assert panel.get_by_text("Good night? I've only just opened.", exact=False).count()
                panel.get_by_role("button", name="Have another go", exact=True).tap()
            correct = next(o for o in step["opts"] if o.get("ok"))
            option(panel, answer_text(correct.get("gr", correct["en"]), character)).tap()
            assert panel.locator(".fb.good").is_visible()
        elif kind == "build":
            words = step["answer"].split()
            bank, row = panel.locator(".tiles"), panel.locator(".answer")
            if explore:
                # Move from bank, reorder within the answer and return a word to the bank.
                drag(page, bank.get_by_text(words[1], exact=True), row, .12, touch)
                assert row.locator(".tile").all_inner_texts() == [words[1]]
                bank.get_by_text(words[0], exact=True).tap()
                drag(page, row.get_by_text(words[0], exact=True), row.get_by_text(words[1], exact=True), .18, touch)
                assert row.locator(".tile").all_inner_texts() == words[:2]
                drag(page, row.get_by_text(words[1], exact=True), bank, touch=touch)
                assert row.locator(".tile").all_inner_texts() == [words[0]]
                words = words[1:]
            for word in words:
                bank.get_by_text(word, exact=True).tap()
            panel.get_by_role("button", name="Check", exact=True).tap()
            assert panel.locator(".fb.good").is_visible()
        panel.get_by_role("button", name="Continue", exact=True).tap()
    assert locals_seen == {"Spyros Rent-a-Van", "Kyria Eleni", "Kyrios Spyros", "Fat Spyros"}
    assert page.get_by_role("heading", name="Chapter 1 complete").is_visible()


def check(browser_type, base, server, executable=None):
    browser = browser_type.launch(executable_path=executable)
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    page = ctx.new_page()
    page.set_default_timeout(9000)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("response", lambda response: errors.append(response.url) if response.status >= 400 else None)
    page.goto(base)
    page.evaluate("navigator.serviceWorker.ready")
    page.wait_for_function("navigator.serviceWorker.controller")
    legacy = {
        "c": "m", "tr": False, "english": True, "slow": True, "figs": 12,
        "completedLessons": ["chapter1"], "phrases": {"Καλημέρα": "Good morning"},
        "runs": {"chapter1-m": {"idx": 7, "answers": {"4": "first"}}, "chapter1-f": {"idx": 28}}
    }
    migrated = page.evaluate("(save) => loadProgress({getItem: () => JSON.stringify(save)})", legacy)
    assert migrated["best"] == {"m": 1, "f": 0} and migrated["legacyFigs"] == 12
    assert migrated["tr"] is False and migrated["english"] and migrated["slow"]
    assert migrated["runs"]["chapter1-m"]["step"] == "legacy-7"
    assert migrated["runs"]["chapter1-m"]["answers"] == {"legacy-4": "first"}
    assert migrated["runs"]["chapter1-f"]["step"] == "legacy-28"
    assert migrated["phrases"] == legacy["phrases"]
    assert page.evaluate("""() => {
      const save = {best:{m:2, f:0}, completedLessons:[]};
      const stars = completeChapter(save, 'm', {
        a:{correct:false}, b:{correct:false}, c:{correct:true,hint:true}
      });
      return stars === 1 && save.best.m === 2 && save.completedLessons.includes("chapter1");
    }""")

    page.locator("#bSettings").tap()
    page.locator("#tEnglish").tap()
    page.locator("#bClose").tap()
    touch = ctx.new_cdp_session(page) if browser_type.name == "chromium" else None
    play(page, "m", explore=True, touch=touch)
    assert page.evaluate("S.best") == {"m": 3, "f": 0}
    page.get_by_role("button", name="Back to title").tap()

    play(page, "m", replay=True, help_on_challenge=True)
    assert page.evaluate("S.best.m") == 3
    assert page.locator("#end .score").inner_text() == "Greek challenge: ★★"
    page.get_by_role("button", name="Back to title").tap()

    # Verify title flows and restart safety with two saved checkpoints.
    page.evaluate("S.runs['chapter1-m']={...newRun(),step:'legacy-13'}; save(); show('title')")
    page.locator("#bSettings").tap()
    page.locator("#bChange").tap()
    page.locator('.card[data-c="f"]').tap()
    page.locator("#bGo").tap()

    server.shutdown()
    server.server_close()
    page.goto(base + "?offline=1")
    play(page, "f", explore=True, help_on_challenge=True)
    assert page.evaluate("S.best") == {"m": 3, "f": 2}
    assert page.evaluate("S.runs['chapter1-m'].step") == "legacy-13"
    assert page.evaluate("S.english")
    page.get_by_role("button", name="Back to title").tap()

    page.evaluate("S.runs['chapter1-f']={...newRun(),step:'legacy-31'}; save(); show('title')")
    page.locator("#bNew").tap()
    page.once("dialog", lambda dialog: dialog.dismiss())
    page.locator("#bGo").tap()
    assert page.evaluate("S.runs['chapter1-f'].step") == "legacy-31"
    page.once("dialog", lambda dialog: dialog.accept())
    page.locator("#bGo").tap()
    assert page.evaluate("S.runs['chapter1-f'].step") == "legacy-0"
    assert page.evaluate("S.runs['chapter1-m'].step") == "legacy-13"
    assert page.evaluate("S.best") == {"m": 3, "f": 2}
    assert page.evaluate("S.english")
    page.locator("#bQuit").tap()

    for width, height in [(320, 568), (390, 844), (430, 932)]:
        page.set_viewport_size({"width": width, "height": height})
        assert page.locator("#bPlay").is_visible()
        assert page.evaluate("document.documentElement.scrollWidth === innerWidth")
        for scene, labels in [("van", ".van-board"), ("arrivals", ".airport-board")]:
            page.evaluate("""(scene) => {
                show('lesson'); idx=steps.findIndex(step=>step.scene===scene); render();
            }""", scene)
            stage = page.locator("#scene").bounding_box()
            for label in page.locator(labels).all():
                box = label.bounding_box()
                assert box and stage
                assert box["x"] >= stage["x"] and box["y"] >= stage["y"]
                assert box["x"] + box["width"] <= stage["x"] + stage["width"]
                assert box["y"] + box["height"] <= stage["y"] + stage["height"]
        page.locator("#bQuit").tap()
    page.locator("#bSettings").tap()
    page.once("dialog", lambda dialog: dialog.dismiss())
    page.locator("#bReset").tap()
    assert page.evaluate("S.best.f") == 2
    page.once("dialog", lambda dialog: dialog.accept())
    page.locator("#bReset").tap()
    assert page.evaluate("S.best") == {"m": 0, "f": 0}
    assert page.evaluate("S.english && Object.keys(S.runs).length === 0")
    assert not errors, errors
    browser.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--engine", choices=("chromium", "webkit"), default="chromium")
    parser.add_argument("--executable")
    args = parser.parse_args()
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(Handler, directory=ROOT))
    Thread(target=server.serve_forever, daemon=True).start()
    with sync_playwright() as playwright:
        check(getattr(playwright, args.engine), f"http://127.0.0.1:{server.server_port}/SidariQuest/", server, args.executable)
    print(f"{args.engine}: Chapter 1, rating, migration, controls, offline and viewport smoke checks passed")
