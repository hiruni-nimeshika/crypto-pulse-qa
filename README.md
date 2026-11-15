[README.md](https://github.com/user-attachments/files/34874587/README.md)

# Crypto Pulse QA Suite

A quality assurance package for **Crypto Pulse**, my real-time cryptocurrency dashboard
(React, Node.js, Express, SQLite, CoinGecko API).

- **Live app:** [https://crypto-pulse.vercel.app](https://crypto-pulse-weld.vercel.app/)
- **App source:** https://github.com/hiruni-nimeshika/crypto-pulse

> Fill the results below in only after you have run the tests. Replace every `[...]` with your real numbers.

## What I tested
Functional behaviour (price dashboard, 30-second refresh, price alerts), input validation, responsive layout,
cross-browser behaviour (Chrome, Firefox, Edge), API requests, and robustness (offline, slow network).

## Results at a glance
| Item | Result |
|---|---|
| Manual test cases written / executed | [..] / [..] |
| Pass rate | [..]% |
| Bugs found (Critical / High / Medium / Low) | [..] ([..] / [..] / [..] / [..]) |
| Browsers and screen sizes | [Chrome, Firefox, Edge] x [375px, 768px, 1366px] |
| Automated checks | [..] checks, run in GitHub Actions |

## Deliverables
| Document | Where |
|---|---|
| Test plan | [docs/test-plan.md](docs/test-plan.md) |
| Test cases and results | [docs/test-cases.xlsx](docs/test-cases.xlsx) |
| Bug reports | [docs/bugs/](docs/bugs/) and the GitHub Issues tab |
| Exploratory testing notes | [docs/exploratory-notes.md](docs/exploratory-notes.md) |
| Browser and device matrix | [docs/browser-device-matrix.md](docs/browser-device-matrix.md) |
| Automated test results | [docs/auto-test-results.md](docs/auto-test-results.md) |
| Test summary report | [docs/test-summary-report.md](docs/test-summary-report.md) |
| Screenshots | [screenshots/](screenshots/) |
| Postman collection | [api-tests/](api-tests/) |

## How to run the automated checks
```bash
npm install
npx playwright install
# start Crypto Pulse in another terminal (npm run dev), then:
npm test                # runs against http://localhost:5173
npm run test:live       # runs against the live Vercel site
npm run report          # opens the HTML report
npm run summary         # writes docs/auto-test-results.md and draft bug reports
```

## What I learned
[2 or 3 sentences in your own words: the most interesting bug, what you would test differently, what you would automate next.]
