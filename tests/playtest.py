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


def play(page, character, retry=False, resume=False):
    page.locator("#bPlay").click()
    if page.locator("#select").is_visible():
        page.locator(f'.card[data-c="{character}"]').click()
        page.locator("#bGo").click()
    tested_retry = False
    if retry:
        assert page.evaluate("CHAPTER.steps.every(step => step.opts?.every(option => option.en) ?? true)")
    for position, step in enumerate(page.evaluate("CHAPTER.steps")):
        panel = page.locator("#panel")
        if step["t"] == "q":
            correct = next(o for o in step["opts"] if o.get("ok"))
            if retry and not tested_retry and step.get("kind") == "reply":
                responses = []
                for option in [o for o in step["opts"] if not o.get("ok")]:
                    label = option.get("gr", option.get("en"))
                    panel.locator(".opt").filter(has_text=label).click()
                    responses.append(panel.locator(".fb.bad b").inner_text())
                    meaning = panel.locator(".fb.bad .answer-meaning").inner_text()
                    assert meaning == f'You just said “{option["en"]}”'
                    assert not panel.get_by_role("button", name="Continue").count()
                    panel.get_by_role("button", name="Try again").click()
                assert len(set(responses)) == 2
                if resume:
                    page.reload()
                    page.get_by_role("button", name="Continue Adventure").click()
                    assert page.evaluate("run.idx") == position
                    assert page.evaluate("run.answers[run.idx]") == "missed"
                tested_retry = True
            label = correct.get("gr", correct.get("en"))
            if isinstance(label, dict):
                label = label[character]
            label = label.replace("{PG}", "Σάρον" if character == "f" else "Ντέιβ")
            panel.locator(".opt").filter(has_text=label).click()
            assert panel.locator(".fb.good").is_visible()
            if resume and position == 4:
                page.reload()
                page.get_by_role("button", name="Continue Adventure").click()
                assert panel.locator(".fb.good").is_visible()
                assert not panel.locator(".opt").count()
        if step["t"] == "build":
            if retry:
                panel.locator(".tiles .tile", has_text="αυτοκίνητο").click()
                panel.get_by_role("button", name="Check").click()
                assert panel.locator(".fb.bad").is_visible()
                panel.get_by_role("button", name="Try again").click()
            for word in step["answer"].split():
                panel.locator(".tiles .tile").get_by_text(word, exact=True).click()
            panel.get_by_role("button", name="Check").click()
            assert panel.locator(".fb.good").is_visible()
        panel.get_by_role("button", name="Continue").click()
    assert page.get_by_role("heading", name="Chapter 1 complete").is_visible()


def check(browser_type, base, server, executable=None):
    browser = browser_type.launch(executable_path=executable)
    mobile = {"viewport": {"width": 390, "height": 844}, "has_touch": True}
    ctx = browser.new_context(**mobile)
    page = ctx.new_page()
    failures = []
    page.on("pageerror", lambda error: failures.append(str(error)))
    page.on("response", lambda response: failures.append(response.url) if response.status >= 400 else None)
    page.goto(base)
    page.evaluate("navigator.serviceWorker.ready")
    page.wait_for_function("navigator.serviceWorker.controller")
    assets = page.evaluate("""async () => {
      const manifest = await (await fetch('manifest.json')).json();
      return await Promise.all(manifest.icons.map(async icon => {
        const image = new Image();
        image.src = icon.src;
        await image.decode();
        return icon.sizes === image.naturalWidth + 'x' + image.naturalHeight;
      }));
    }""")
    assert all(assets)
    page.locator("#bSettings").click()
    page.locator("#tEnglish").click()
    assert page.locator("#tEnglish").get_attribute("aria-pressed") == "true"
    page.locator("#bClose").click()
    play(page, "m", retry=True, resume=True)
    fig_count = page.evaluate("S.figs")
    assert fig_count == page.evaluate("qTotal") - 2
    page.get_by_role("button", name="Back to title").click()
    page.locator("#bBook").click()
    assert page.locator("#book .lr").count() == page.evaluate("qTotal")
    page.get_by_role("button", name="Back to title").click()
    play(page, "m")
    assert page.evaluate("S.figs") == fig_count
    page.get_by_role("button", name="Back to title").click()
    page.locator("#bSettings").click()
    page.locator("#bChange").click()
    page.locator('.card[data-c="f"]').click()
    page.reload()
    server.shutdown()
    server.server_close()
    page.goto(base + "?offline=1")
    play(page, "f", retry=True)
    assert page.evaluate("S.figs") == fig_count
    assert page.evaluate('S.phrases["Είμαι έτοιμη"]') == "I'm ready"
    assert page.evaluate("S.english")
    assert not failures, failures
    for width, height in [(320, 568), (430, 932), (1280, 800)]:
        page.set_viewport_size({"width": width, "height": height})
        page.goto(base)
        assert page.locator("#bPlay").is_visible()
        assert page.evaluate("document.documentElement.scrollWidth === innerWidth")
        button = page.locator("#bPlay").bounding_box()
        assert button and button["y"] + button["height"] <= height
        page.locator("#bPlay").click()
        assert page.locator("#panel .next").is_visible()
        page.locator("#bQuit").click()
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
    print(f"{args.engine}: both characters, retry, resume, replay, phrasebook, manifest, offline, and viewport smoke checks passed")
