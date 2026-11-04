# Study Timer

A small study timer made with HTML, CSS, browser JavaScript, and a Node.js/Express backend. It starts with a 25-minute study period and a 5-minute break, plays a short sound when a phase ends, counts completed study sessions, and lets you choose different study and break lengths.

## Project folders

- `frontend/` contains the page, styles, and timer logic.
- `backend/` contains the API and the code that saves session counts.

The backend also serves the frontend, so you only need to start one local server. Timer lengths and the sound setting are saved in your browser. Completed session totals are saved in `backend/data/sessions.json` on the computer running the server. That file is created when the backend first starts and is ignored by Git.

## Run locally in VS Code

1. Install [Node.js](https://nodejs.org/) version 20 or later.
2. Open this project folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Install the project dependency:

   ```bash
   npm install
   ```

5. Start the app:

   ```bash
   npm start
   ```

6. Open `http://localhost:3000` in your browser. Keep the terminal running while you use the timer. Press `Ctrl+C` in that terminal to stop the server.

You can also check that the backend is running by opening `http://localhost:3000/api/health`. A successful response is `{"status":"ok"}`.

## GitHub workflow: feature branch to `alternate`, then `main`

These commands leave all repository and Git actions to you. Replace the example repository URL with the HTTPS URL shown on GitHub. Create an empty GitHub repository first; do not add a README, `.gitignore`, or license from GitHub because this folder already contains those files.

To make the first application change go through a pull request, first put only the project instructions and ignore rules on `main`:

```bash
git init
git branch -M main
git add README.md .gitignore
git commit -m "Add project setup instructions"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Create and publish the integration branch from `main`:

```bash
git switch -c alternate
git push -u origin alternate
```

Create a feature branch from `alternate`, then add the timer files and push that branch:

```bash
git switch -c feature/study-timer
git add frontend backend package.json package-lock.json
git commit -m "Build the study timer"
git push -u origin feature/study-timer
```

On GitHub, create a pull request with **base: `alternate`** and **compare: `feature/study-timer`**. Review it and merge it into `alternate`. For future changes, start each new feature branch from the latest `alternate`, then commit, push, and open another PR to `alternate`.

After all feature PRs are merged, switch to `alternate` in VS Code and test the complete app. If it works as expected, create a final pull request with **base: `main`** and **compare: `alternate`**. Review and merge that PR. Then update your local `main`:

```bash
git switch main
git pull origin main
```

If you prefer to put the complete project on `main` immediately, you can commit all files in the initial commit instead. The feature-branch and PR steps can still be used for later changes.


## API endpoints

- `GET /api/health` checks that the backend is available.
- `GET /api/stats?date=YYYY-MM-DD` returns the all-time and requested-day study-session counts.
- `POST /api/sessions` increments both counts when a study session finishes. The request body is `{ "date": "YYYY-MM-DD" }`.
