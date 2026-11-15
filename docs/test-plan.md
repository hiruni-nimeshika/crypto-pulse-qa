# Test plan: Crypto Pulse

| | |
|---|---|
| Author | Hiruni Nimeshika |
| Application | Crypto Pulse, real-time cryptocurrency dashboard |
| Versions tested | Local development build (http://localhost:5173) and live deployment (https://crypto-pulse.vercel.app) |
| Date | [fill in] |

## 1. Objective
Verify that Crypto Pulse shows correct, up-to-date market data, lets users manage price alerts reliably,
and works across common browsers and screen sizes, and record any defects found.

## 2. Scope
**In scope**
- Price dashboard: display of 5 or more cryptocurrencies, 30-second updates
- Price alert feature: create, store (SQLite), display, validate input
- Responsive layout (mobile, tablet, desktop) and dark theme UI
- Behaviour on errors: network offline, slow network, API failure
- REST requests made by the app to its own back end

**Out of scope**
- The CoinGecko service itself (third-party)
- Load and security penetration testing
- Native mobile apps

## 3. Test types
Functional, input validation (negative and edge), regression (automated), usability, responsive, cross-browser, API, exploratory.

## 4. Test environments
| Environment | Details |
|---|---|
| Browsers | Chrome, Firefox, Edge (latest versions) |
| Screen sizes | 375px (mobile), 768px (tablet), 1366px (desktop) |
| Operating system | Windows [version] |
| Network | Normal, throttled (DevTools "Slow 3G"), offline |

## 5. Approach and tools
| Activity | Tool |
|---|---|
| Test cases and results | Google Sheets / Excel (`docs/test-cases.xlsx`) |
| Defect tracking | GitHub Issues and a project board |
| API testing | Postman |
| Browser automation | Playwright, run in GitHub Actions |
| Evidence | Screenshots and screen recordings |

## 6. Entry and exit criteria
**Entry:** the app runs locally and on Vercel; test cases are written.
**Exit:** all planned cases executed; all Critical and High defects logged with evidence; automated suite passes or failures are explained; summary report written.

## 7. Severity levels
| Severity | Meaning |
|---|---|
| Critical | App unusable, data loss or wrong data shown as correct |
| High | A main feature fails, no reasonable workaround |
| Medium | A feature misbehaves, workaround exists |
| Low | Cosmetic issue or small usability problem |

## 8. Risks
- CoinGecko rate limits or downtime can cause failures that are not app bugs.
- Prices change constantly, so exact values cannot be asserted.
- Limited time: manual testing prioritises the dashboard and alerts.

## 9. Deliverables
Test plan, test cases with results, bug reports, browser and device matrix, automated test results, test summary report.
