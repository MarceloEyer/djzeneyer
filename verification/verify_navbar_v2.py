from playwright.sync_api import sync_playwright

def verify_navbar_v2():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to homepage...")
            page.goto("http://localhost:5173/")
            page.set_viewport_size({"width": 1280, "height": 720})

            print("Waiting for any nav element...")
            # Fallback to finding any nav
            navbar = page.locator("nav").first
            navbar.wait_for(state="visible", timeout=10000)

            links = navbar.get_by_role("link").all()
            print(f"Found {len(links)} links in first nav.")

            for link in links:
                href = link.get_attribute("href")
                text = link.text_content()
                print(f"Link: {text}, Href: {href}")

            page.screenshot(path="verification/navbar_v2.png")
            print("Screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_navbar_v2()
