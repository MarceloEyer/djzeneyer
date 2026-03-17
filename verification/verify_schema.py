import json
import os
import time
from playwright.sync_api import sync_playwright

def verify_seo():
    print("Starting verification process...")
    # Clean port if needed
    os.system("kill -9 $(lsof -t -i:3000) 2>/dev/null || true")

    # Start server in background
    os.system("npm run dev -- --port 3000 > dev.log 2>&1 &")
    time.sleep(10)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/home/jules/verification/video")
        page = context.new_page()

        print("Navigating to events page...")
        page.goto("http://localhost:3000/en/events")

        # Wait for data load and rendering
        page.wait_for_timeout(10000)

        found = False
        scripts = page.locator('script[type="application/ld+json"]').all()
        for script in scripts:
            try:
                data = json.loads(script.inner_text())

                # Check for @graph property instead of root @type
                graph = data.get('@graph', [])
                event_series = None

                for item in graph:
                    if item.get('@type') == 'EventSeries':
                        event_series = item
                        break

                if not event_series and data.get('@type') == 'EventSeries':
                    event_series = data

                if event_series:
                    found = True
                    print("\n✅ Found EventSeries Schema!")

                    sub_events = event_series.get('subEvent', [])
                    for event in sub_events:
                        offers = event.get('offers')
                        if offers:
                            url = offers.get('url')
                            if isinstance(url, str):
                                print(f"✅ Event '{event.get('name')}' has a valid string Offer URL: {url}")
                            else:
                                print(f"❌ Event '{event.get('name')}' has an INVALID Offer URL type: {type(url)}")
            except Exception as e:
                pass

        if not found:
            print("❌ EventSeries Schema not found.")

        page.screenshot(path="/home/jules/verification/verification.png")
        page.wait_for_timeout(1000)

        context.close()
        browser.close()
        os.system("kill -9 $(lsof -t -i:3000) 2>/dev/null || true")

if __name__ == "__main__":
    verify_seo()
