# QA report: Crypto Pulse

| | |
|---|---|
| Application | Crypto Pulse, real-time cryptocurrency price dashboard |
| Live site | https://crypto-pulse-weld.vercel.app |
| Source | https://github.com/hiruni-nimeshika/crypto-pulse |
| Tested by | Hiruni Nimeshika |
| Observation date | 17 November 2026 |
| Report prepared | 19 November 2026 |
| Browser / OS | Google Chrome, Windows |
| Stack | React (Vite), Node.js, Express, SQLite, CoinGecko API, Vercel |

## 1. Summary

I tested Crypto Pulse by using the live site and the local development build, comparing their behaviour, and reviewing the source of `src/App.jsx`. The live deployment was **unusable**: it never loaded any prices. I traced this to a dead back end URL, fixed it, and added missing error handling, real data and input validation. In total I recorded **8 defects: 1 Critical, 3 High, 1 Medium and 3 Low**.

**Release verdict (before fixes):** not ready. The live site showed no data, and the data that appeared locally was partly fake.
**Verdict after fixes:** ready for a demo, with one known limitation: price alerts need a deployed back end (BUG-006).

## 2. Scope and approach

**In scope:** price dashboard (load, refresh, display), error handling, price alert form (validation and submission), UI formatting, page title, basic accessibility.
**Out of scope:** CoinGecko's own service, load and security testing, native mobile apps.

**Method**
- Exploratory testing of the live site and the local build (screenshots taken at the time and attached).
- Comparison of live versus local behaviour to isolate the cause.
- Code review of `src/App.jsx`.
- An automated Playwright check suite and CI workflow are in the `crypto-pulse-qa` repository.

## 3. Defect summary

| ID | Severity | Area | Title | Status |
|---|---|---|---|---|
| [BUG-001](bugs/BUG-001.md) | Critical | Dashboard / deployment | Live site is stuck on 'Loading market data...' and never shows prices | Fixed in code, live retest needed |
| [BUG-002](bugs/BUG-002.md) | High | Error handling | No error message when prices fail to load: the spinner never stops | Fixed in code, live retest needed |
| [BUG-003](bugs/BUG-003.md) | High | Data accuracy | All coins show the same hard-coded '+2.4%' change and the same price bar | Fixed in code, live retest needed |
| [BUG-004](bugs/BUG-004.md) | Low | Usability / branding / SEO | Browser tab title is 'frontend' instead of the app name | Open (verify) |
| [BUG-005](bugs/BUG-005.md) | Medium | Input validation (alerts) | Price alert form accepts zero, negative and invalid target prices | Fixed in code (found in code review), retest needed |
| [BUG-006](bugs/BUG-006.md) | High | Alerts / deployment | Price alerts do not work on the live site, although the page advertises them | Open (known limitation), now shown clearly to the user |
| [BUG-007](bugs/BUG-007.md) | Low | UI / formatting | Prices are shown without thousands separators, for example '$64563.00' | Open (verify) |
| [BUG-008](bugs/BUG-008.md) | Low | Accessibility | Form labels are not linked to their inputs (accessibility) | Fixed in code (found in code review), retest needed |

| Severity | Count |
|---|---|
| Critical | 1 |
| High | 3 |
| Medium | 1 |
| Low | 3 |
| **Total** | **8** |

## 4. Key finding in detail (BUG-001)

On 17 November 2026 at 07:50 and 07:58, the live site showed 'Loading market data...' indefinitely, 'Updated: --:--:--' and 'Coins Tracked: 0', while `http://localhost:5173` showed five coins. Because the same code worked locally, the fault was in the deployment, not the logic. The source contained a comment noting the old Render URL was dead, which confirmed the cause: the deployed front end depended on a back end that no longer existed.

The fix removed the dependency for prices by fetching directly from CoinGecko and added a visible error state, so a failure can never again look like endless loading.

## 5. Test coverage

| Area | Result of observation | Evidence |
|---|---|---|
| Live site loads prices | Failed (BUG-001) | Screenshots, 17 Nov |
| Local site loads prices | Passed | Screenshot, 17 Nov |
| Failure handling | Failed (BUG-002) | Screenshot and code |
| Data accuracy (24-hour change) | Failed (BUG-003) | Screenshot and code |
| Page title | Failed (BUG-004) | Screenshot |
| Alert form validation | Defect found (BUG-005) | Code review |
| Alerts on live site | Defect found (BUG-006) | Code review |
| Price formatting | Minor defect (BUG-007) | Screenshot |
| Form accessibility | Minor defect (BUG-008) | Code review |
| Responsive layout, cross-browser, API timing | Not yet covered in this report | See the retest checklist |

## 6. Retest results

Run [docs/retest-checklist.md](retest-checklist.md) on the live site after the fixes are deployed and fill in the results here.

| Item | Result | Date |
|---|---|---|
| Live prices load (BUG-001) | [Pass / Fail] | [date] |
| Error state and retry (BUG-002) | [Pass / Fail] | [date] |
| Real 24-hour change (BUG-003) | [Pass / Fail] | [date] |
| Page title (BUG-004) | [Pass / Fail] | [date] |
| Alert validation (BUG-005) | [Pass / Fail] | [date] |
| Alert message on live site (BUG-006) | [Pass / Fail] | [date] |
| Price formatting (BUG-007) | [Pass / Fail] | [date] |
| Label focus (BUG-008) | [Pass / Fail] | [date] |

## 7. Risks and recommendations

1. **Deploy the alert back end** with persistent storage (SQLite files are wiped on free hosts) and an email service, then set `VITE_API_URL` in Vercel.
2. **Add automated checks** to CI so a broken deployment (like BUG-001) is caught before users see it.
3. **CoinGecko's free tier is rate limited.** Add caching or an API key if traffic grows, and keep the error state so a rate limit is shown clearly.
4. **Keep the page title and metadata** meaningful for sharing and search.

## 8. Conclusion

The most serious problem (an unusable live deployment) came from a configuration dependency that was invisible in local testing. The project now reports errors clearly, shows real data and validates input. Remaining work: deploy the back end and complete the retest above.

## 9. Lessons learned

- Testing only on the developer machine hides deployment problems. Always test the deployed version.
- A missing error state turns every failure into an endless spinner. Loading, success, error and empty states should all be designed.
- Hard-coded placeholder values must never look like real data.
