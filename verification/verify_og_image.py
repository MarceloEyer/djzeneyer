
from playwright.sync_api import sync_playwright, expect

def verify_og_image():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Wait for server to start roughly
            page.goto("http://localhost:5173", timeout=10000)

            # Check for the OG image meta tag
            og_image = page.locator('meta[property="og:image"]')
            content = og_image.get_attribute("content")
            print(f"Found OG Image: {content}")

            if "zen-eyer-og-image.svg" in content:
                print("SUCCESS: OG Image uses .svg extension.")
            else:
                print(f"FAILURE: OG Image does not use .svg extension. Found: {content}")
                exit(1)

            # Take a screenshot of the page just to have something visual,
            # though the meta tag isn't visible.
            page.screenshot(path="/home/jules/verification/og_verification.png")

        except Exception as e:
            print(f"Error: {e}")
            exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    verify_og_image()
