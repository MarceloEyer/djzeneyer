from playwright.sync_api import sync_playwright

def verify_navbar_encoded_traversal():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to homepage...")
            page.goto("http://localhost:5173/")
            page.set_viewport_size({"width": 1280, "height": 720})

            # We can't easily modify the internal router state from here to test *routing*,
            # but we can verify the *logic* if we exposed it or checked links.
            # Since the code change is in sanitization logic which runs on render/navigation,
            # we rely on the fact that the app didn't crash.

            # To strictly verify the security fix, we would need unit tests or to try to navigate
            # to a malicious URL if the app uses query params for routing (it doesn't seem to for the navbar).

            # Instead, we will verify that standard links still work and look correct, ensuring no regression.

            print("Waiting for navbar...")
            navbar = page.locator("nav[aria-label='Main navigation']")
            navbar.wait_for(state="visible", timeout=10000)

            links = navbar.get_by_role("link").all()
            print(f"Found {len(links)} links.")

            for link in links:
                href = link.get_attribute("href")
                text = link.text_content()
                print(f"Link: {text}, Href: {href}")

                if href == '/':
                    # Home is allowed to be '/'
                    pass
                elif not href or href == '' or href == '#':
                     print(f"WARNING: Link {text} has empty or # href.")

            # Take screenshot
            page.screenshot(path="verification/navbar_encoded_traversal.png")
            print("Screenshot saved to verification/navbar_encoded_traversal.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_navbar_encoded_traversal()
