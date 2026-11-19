# Retest checklist (run this on the live site after you redeploy)

Open https://crypto-pulse-weld.vercel.app in Chrome, press **Ctrl+Shift+R**, then work through each line. Write Pass or Fail, and take a screenshot of anything that fails.

| # | Check | Expected | Result |
|---|---|---|---|
| 1 | Prices load within 5 seconds | 5 coins shown, 'Updated' shows a time | |
| 2 | 'Coins Tracked' number | 5 | |
| 3 | Percentage badges | Five different numbers; green if positive, red if negative | |
| 4 | Compare one coin with coingecko.com | Prices are close | |
| 5 | Wait 35 seconds | 'Updated' time changes | |
| 6 | DevTools (F12) > Network > Offline, reload | Error message and 'Try again' button, no endless spinner | |
| 7 | Set back to Online, click 'Try again' | Prices load | |
| 8 | Alert form: price -50 | Clear error, nothing sent | |
| 9 | Alert form: price 0 | Clear error, nothing sent | |
| 10 | Alert form: empty price | Browser asks to fill the field | |
| 11 | Alert form: valid price 50000 on the live site | Clear message (alerts need the back end) or success if the back end is deployed | |
| 12 | Click the label 'Target Price ($)' | The price field gets focus | |
| 13 | Browser tab title | 'Crypto Pulse' | |
| 14 | Resize to 375px wide (DevTools device mode) | No sideways scrolling, everything readable | |
| 15 | Open in Firefox and Edge | Same behaviour | |
| 16 | Bitcoin price format | Thousands separators, for example $64,563.00 | |

After this, update the 'Retest result' line in each bug file and the table in section 6 of the QA report.
