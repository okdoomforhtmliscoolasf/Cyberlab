# CYBERLAB — Build 10.0

A neo-brutalist, responsive cybersecurity learning playground built with HTML, CSS and vanilla JavaScript.

## Features
- Dashboard with six modules, XP, rank and local progress saving
- Signal spotting: fictional suspicious-message awareness exercise
- Password lab: local educational indicator; never enter real passwords
- Log investigator: triage fictional audit events
- Network school: interactive concept cards
- Incident room: defensive decision-making scenario
- Knowledge check: five-question assessment
- Light/dark contrast toggle
- Responsive desktop and mobile layout
- No build step, backend, API keys, network scanner or external target access

## Run locally
Open `index.html` in a modern browser. Internet is only needed for optional Google Fonts; system fonts will be used if unavailable.

## Publish on GitHub Pages
1. Create a repository named `cyberlab`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open Settings → Pages.
4. Choose Deploy from a branch, select `main` and `/(root)`, then Save.
5. Wait for deployment and open the published URL.

## Safety and scope
All scenarios and log records are fictional. The app does not scan, connect to, probe or test real systems. The password lab is an intentionally simplified educational indicator, not a strength audit or crack-time estimator. Never enter actual credentials. Only assess systems when you have explicit permission and a clearly defined scope.

## Progress
Progress is saved in localStorage on the current browser/device. It is not synced across devices.
