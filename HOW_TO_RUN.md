# How to use this kit (step by step)

Everything here is prepared for you, but **the results must come from your own testing.**
Nothing in this kit contains invented bugs, and you should never add one you did not reproduce.

## A. One-time setup (15 minutes)
1. Install **Node.js** (version 18 or newer) from nodejs.org if you don't have it.
2. Create a new GitHub repository named `crypto-pulse-qa` and upload this whole folder, or clone it and copy the files in.
3. Open a terminal in this folder and run:
   ```
   npm install
   npx playwright install
   ```
4. Install **Postman** (free) if you want to do the API testing step.

## B. Run the automated checks (10 minutes)
1. In another terminal, start your app: go to your Crypto Pulse folder and run `npm run dev` (it should open at http://localhost:5173).
2. Back in this folder run `npm test`. Wait for it to finish (about 2 minutes).
   Screenshots are saved to `screenshots/<browser>/` for every check.
3. Run `npm run report` to open the HTML report, and `npm run summary` to write
   `docs/auto-test-results.md` plus draft bug files in `docs/bugs/`.
4. Optional: `npm run test:refresh` checks the 30-second auto-refresh (takes about 40 seconds).
5. Optional: `npm run test:live` repeats the checks against the live Vercel site.

## C. Turn findings into real bug reports (1 to 2 hours)
1. Open each `docs/bugs/DRAFT-xxx.md`. Reproduce the problem **by hand** in the browser.
2. If it is real: fill in the steps, expected and actual result, choose severity, attach a screenshot,
   rename the file to `BUG-xxx.md`, and open a GitHub Issue with the same text.
3. If it is not real (for example, a failing check caused by the test, not the app), delete the draft.

## D. Manual testing (the most important part, 4 to 6 hours)
1. Open `docs/test-cases.xlsx`. Run each case in your browser and fill in **Actual result, Status, Severity, Bug ID, Tester, Date**.
   Change or add cases to match how your app really behaves. The pre-written cases are a starting point.
2. Spend 45 minutes on exploratory testing and write notes in `docs/exploratory-notes.md`.
3. Test the main flows in Chrome, Firefox and Edge, and at 375px, 768px and 1366px (browser DevTools, device mode). Fill in `docs/browser-device-matrix.md`.
4. Log every confirmed bug in GitHub Issues (labels: `bug` and a severity).

## E. API tests (2 hours)
1. In Chrome DevTools open the Network tab and reload the app. Note the requests your app makes.
2. Recreate them in Postman, add tests (status code, response time, fields) and negative cases.
3. Export the collection to `api-tests/crypto-pulse.postman_collection.json`.

## F. Finish
1. Copy `docs/test-summary-report-template.md` to `docs/test-summary-report.md` and fill it in with your real numbers.
2. Fill in the `[...]` parts of `README.md`.
3. Push to GitHub, check that the Actions tab shows a green run, and add the link to your CV and LinkedIn.

## G. Send me your results
Paste the numbers (cases run, passed, bugs by severity), your 3 best bugs, and the repo link,
and I will help polish the bug reports, the summary report and your CV bullets.

## Note on what is tested
The automated checks are generic (load, title, console errors, failed requests, headings, images, keyboard,
speed, horizontal scrolling at three sizes, offline behaviour, optional 30-second refresh). Tests for your exact
buttons (such as creating a price alert) need your app's element names. If you paste your `App.jsx`
(or the alert component) here, I can write those specific tests for you.
