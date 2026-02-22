#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
from playwright.sync_api import sync_playwright, expect

def verify_og_image():
    """
    Verifies that the Open Graph image meta tag points to a .png file.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Wait for server to start roughly - ensure server is running on port 5173
            url = "http://localhost:5173"
            print(f"Navigating to {url}...")
            page.goto(url, timeout=10000)

            # Check for the OG image meta tag
            og_image = page.locator('meta[property="og:image"]')
            # Expect it to be attached
            expect(og_image).to_be_attached()

            content = og_image.get_attribute("content")
            print(f"Found OG Image: {content}")

            if "zen-eyer-og-image.png" in content:
                print("SUCCESS: OG Image uses .png extension.")
            else:
                print(f"FAILURE: OG Image does not use .png extension. Found: {content}")
                exit(1)

            # Ensure directory exists
            os.makedirs("verification", exist_ok=True)

            # Take a screenshot
            screenshot_path = "verification/og_verification.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"Error during verification: {e}")
            exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    verify_og_image()
