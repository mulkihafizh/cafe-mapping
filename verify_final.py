from playwright.sync_api import sync_playwright
import time
import subprocess

def run():
    print("Starting node server...")
    server = subprocess.Popen(["node", ".output/server/index.mjs"])
    time.sleep(3)
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto('http://localhost:3000')
            time.sleep(5) # wait for map to load
            page.screenshot(path='final_build_screenshot.png')
            print("Screenshot taken.")
            browser.close()
    finally:
        print("Killing node server...")
        server.terminate()

if __name__ == '__main__':
    run()
