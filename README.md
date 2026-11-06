# Leads Ledger

A small Chrome toolbar extension for saving websites you want to come back to. Built for Scrimba’s Learn JavaScript, Module 6: Build a Chrome Extension.

## Install the extension

1. Download this repository using **Code → Download ZIP**, then unzip it.
2. In desktop Chrome, open `chrome://extensions` and turn on **Developer mode**.
3. Choose **Load unpacked** and select the folder that contains `manifest.json`.
4. Visit a regular website, open the puzzle-piece menu and click **Leads Ledger**. Pin it if you want a toolbar shortcut.

## Try it

- Type a website and press **Save input** or Enter. A bare domain gets an https:// prefix.
- Click **Save tab** in the toolbar popup to capture the page you’re viewing.
- Reopen the popup to see your saved links. Click a link to open it in a new tab.
- Double-click **Delete all** to clear the list. With a keyboard, focus the button and activate it twice.

## Web preview

The same HTML, CSS and JavaScript work as a static site. Paste a URL to try saving it. Capturing the active browser tab is available in the installed extension. Saved links stay in the browser that saved them. The website and extension have separate lists.

## How it works

- `manifest.json` tells Chrome which popup to open and requests temporary access to the active tab.
- `index.js` handles button clicks, checks web addresses, renders links and stores the list using localStorage.
- `index.html`, `index.css` and `icon.png` make up the interface.

The extension has no sign-in, remote database, tracking, or build step. It requests only the activeTab permission.
