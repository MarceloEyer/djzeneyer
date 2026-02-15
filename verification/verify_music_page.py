from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_music_page(page: Page):
    print("Navigating to Music Page...")
    page.goto("http://localhost:5173/music")

    # Wait for the title to be visible
    print("Waiting for title...")
    expect(page.get_by_role("heading", name="Music Hub")).to_be_visible()

    # Wait for tracks to load (using a selector that should be present when tracks are loaded)
    # The tracks are in a grid.
    print("Waiting for tracks...")
    # Expect at least one track card or loading to finish
    # The loading spinner has class 'animate-spin'
    # We want to wait until the spinner is gone and content is there.
    # Or just wait for network idle, but explicit wait is better.

    # Let's wait for a button "Download Grátis" which is on the cards.
    # But it might take time to fetch from remote API.
    try:
        page.wait_for_selector('text=Download Grátis', timeout=10000)
    except Exception:
        print("Timeout waiting for tracks. Taking screenshot anyway to debug.")

    # Interact with search to trigger the memoized code
    print("Interacting with search...")
    page.fill('input[name="music-search"]', "Zouk")

    # Wait a bit for React to update (though it should be instant now!)
    time.sleep(1)

    # Take screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification/music_page_refactor.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_music_page(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
