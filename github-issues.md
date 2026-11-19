# GitHub issues to create

In your repository open **Issues > New issue** and paste each title and body. Add labels `bug` plus the severity (create labels `critical`, `high`, `medium`, `low` first if they do not exist). Close an issue only after you have retested it and written the result.

## BUG-001: Live site is stuck on 'Loading market data...' and never shows prices
**Labels:** bug, critical

**Severity:** Critical  
**Environment:** Google Chrome, Windows, https://crypto-pulse-weld.vercel.app (live). Compared with http://localhost:5173 (local).

**Steps to reproduce**
1. Open https://crypto-pulse-weld.vercel.app
2. Scroll to the 'Market Prices' section
3. Wait one minute

**Expected:** Five coin cards with current prices load, 'Coins Tracked' shows 5 and 'Updated' shows a time.

**Actual:** A spinner with 'Loading market data...' stays forever. 'Updated' shows --:--:-- and 'Coins Tracked' shows 0. The same code shows all five coins on localhost:5173.

**Cause:** The deployed front end called a hosted back end (a Render.com URL) that no longer exists, so every price request failed. Locally the app used the back end running on the developer's laptop.

**Fix:** Prices are now fetched directly from the CoinGecko API in the browser (`fetchPrices` in `src/App.jsx`), with a 30-second refresh. The back end is only needed for alerts.

---

## BUG-002: No error message when prices fail to load: the spinner never stops
**Labels:** bug, high

**Severity:** High  
**Environment:** Same as BUG-001 (found while investigating it).

**Steps to reproduce**
1. Make the price request fail (this happened on the live site because the back end was gone)
2. Watch the 'Market Prices' section

**Expected:** A clear error message with a way to retry, and old prices stay visible if a refresh fails.

**Actual:** The user only sees 'Loading market data...' indefinitely. In the original code the error was only written to the console, and the failure message was set in a state variable that is displayed in the alert form, not in the prices section.

**Cause:** `fetchPrices` caught the error but did not update the prices section, and the UI treated 'no prices' as 'still loading'.

**Fix:** Added `loading` and `error` states, an error panel with a 'Try again' button, and a warning banner when a refresh fails but older prices are shown.

---

## BUG-003: All coins show the same hard-coded '+2.4%' change and the same price bar
**Labels:** bug, high

**Severity:** High  
**Environment:** Google Chrome, Windows, http://localhost:5173 (local build).

**Steps to reproduce**
1. Open the local app and load the five coins
2. Compare the percentage badge on each card

**Expected:** Each coin shows its own real 24-hour price change, green when positive and red when negative. The bar reflects the data.

**Actual:** Bitcoin, Ethereum, Solana, Cardano and Polkadot all show '+2.4%', and every bar is the same length. Real 24-hour changes are never identical for five coins. This is fake data presented as real.

**Cause:** The percentage was written directly in the component (`<div className="price-change">+2.4%</div>`) and the bar width was fixed at 65%.

**Fix:** The app now requests `include_24hr_change=true` from CoinGecko and displays `usd_24h_change`, coloured green or red, and scales the bar width from the change.

---

## BUG-004: Browser tab title is 'frontend' instead of the app name
**Labels:** bug, low

**Severity:** Low  
**Environment:** Google Chrome, Windows, https://crypto-pulse-weld.vercel.app

**Steps to reproduce**
1. Open https://crypto-pulse-weld.vercel.app
2. Look at the browser tab title

**Expected:** The tab shows the app name, for example 'Crypto Pulse'.

**Actual:** The tab shows 'frontend', the default name from the Vite project template. The page title returned by the server is also 'frontend'.

**Cause:** `<title>` in `frontend/index.html` was never changed from the template default.

**Fix:** Change it to `<title>Crypto Pulse</title>` in `index.html`, and add a meta description.

---

## BUG-005: Price alert form accepts zero, negative and invalid target prices
**Labels:** bug, medium

**Severity:** Medium  
**Environment:** Source review of `src/App.jsx` (earlier version). Reproduce on any build that lacks the fix.

**Steps to reproduce**
1. Open the 'Set Price Alert' form
2. Enter an email, choose a coin, enter -50 (or 0) as the target price
3. Submit

**Expected:** The form rejects non-positive prices with a clear message.

**Actual:** The original input was `type="number"` with no minimum, and the original code relied on a comparison that does not handle empty or non-numeric values reliably. Negative values could be sent to the server.

**Cause:** Missing client-side validation (no `min`, weak check).

**Fix:** Added `min="0"` and `step="any"` to the input and a check that the parsed value is a finite number greater than 0 before sending.

---

## BUG-006: Price alerts do not work on the live site, although the page advertises them
**Labels:** bug, high

**Severity:** High  
**Environment:** Google Chrome, Windows, https://crypto-pulse-weld.vercel.app

**Steps to reproduce**
1. Open the live site
2. Fill in 'Set Price Alert' with an email, a coin and a valid price
3. Click 'Set Alert'

**Expected:** The alert is saved and the user receives confirmation.

**Actual:** The alert back end is not deployed, so the request cannot succeed. The page still promises 'Instant email notifications' and 'Free alerts'. In the earlier code the failure message appeared only in the alert form and was generic.

**Cause:** The Express and SQLite back end exists only on the developer's machine (alerts also need a host with persistent storage and an email service).

**Fix:** Short term: the app now shows a clear message when the back end is unavailable. Long term: deploy the back end (Render or Railway) with a persistent database and set `VITE_API_URL` in Vercel.

---

## BUG-007: Prices are shown without thousands separators, for example '$64563.00'
**Labels:** bug, low

**Severity:** Low  
**Environment:** Google Chrome, Windows, http://localhost:5173

**Steps to reproduce**
1. Open the app and look at the Bitcoin price

**Expected:** Large prices are easy to read, for example '$64,563.00'.

**Actual:** Bitcoin shows '$64563.00' and Ethereum '$1816.77'.

**Cause:** Prices are formatted with `toFixed(2)` only.

**Fix:** Use `toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })`.

---

## BUG-008: Form labels are not linked to their inputs (accessibility)
**Labels:** bug, low

**Severity:** Low  
**Environment:** Source review of `src/App.jsx` (earlier version).

**Steps to reproduce**
1. Open the alert form
2. Click the label text 'Email Address' or 'Target Price ($)'

**Expected:** Clicking a label focuses its input, and screen readers announce the label with the field.

**Actual:** The labels have no `htmlFor` and the inputs have no `id`, so they are not associated.

**Cause:** Missing `htmlFor` and `id` attributes.

**Fix:** Added matching `id` and `htmlFor` for the email, coin and price fields.

---
