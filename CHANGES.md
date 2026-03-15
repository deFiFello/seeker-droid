# SeekerDroid Fix Package — Migration Guide

## What was broken and what this fixes

### Bug 1: MWA "Can't find a wallet" error (CRITICAL)
**Root cause:** `WalletButton.tsx` auto-triggered `signMessage` in a `useEffect` with `setTimeout`.
Android Chrome blocks MWA intent navigation from non-user-initiated events (trusted event policy).

**Fix:** Removed the auto-trigger entirely. `signMessage` now only fires from a direct button tap
in `page.tsx`. The `WalletButton` handles **connect only** — verification is a separate user action.

### Bug 2: `autoConnect: true` compounded the MWA failure
**Root cause:** `SolanaProvider` had `autoConnect={true}`, which tried to reconnect on page load
without a user gesture — another trusted event violation.

**Fix:** Set `autoConnect={false}`. Connection is now explicitly user-initiated via the Connect button.

### Bug 3: Duplicate sign logic between WalletButton and page
**Root cause:** Both components called `signMessage` independently, causing race conditions and
potential double-prompts.

**Fix:** `WalletButton` only handles connect/disconnect. `page.tsx` owns the verification flow.

---

## Files to replace in your repo

```
src/components/SolanaProvider.tsx  → replaces existing
src/components/WalletButton.tsx    → replaces existing
src/app/page.tsx                   → replaces existing
src/app/layout.tsx                 → replaces existing
public/manifest.json               → replaces existing
public/icons/                      → NEW directory, copy entirely
  icon-192x192.png
  icon-192x192-maskable.png
  icon-512x512.png
  icon-512x512-maskable.png
  dapp-store-badge.png
  solana-mobile-logo.png
public/favicon.ico                 → replaces existing
twa-manifest.json                  → replaces existing (root of repo)
```

## Additional steps YOU must do

### 1. Add android.keystore to .gitignore
```
# Add this line to .gitignore
android.keystore
```
Then: `git rm --cached android.keystore` to remove it from tracking.

### 2. Add SHA-256 fingerprint to twa-manifest.json
Run this to get your keystore fingerprint:
```bash
keytool -list -v -keystore android.keystore -alias android
```
Copy the SHA-256 fingerprint and add it to `twa-manifest.json`:
```json
"fingerprints": [
  { "type": "sha256cert", "value": "YOUR:SHA:256:HERE" }
]
```

### 3. Set up Digital Asset Links
Create `public/.well-known/assetlinks.json`:
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "app.vercel.seeker_droid.twa",
    "sha256_cert_fingerprints": ["YOUR:SHA:256:HERE"]
  }
}]
```
This is required for the TWA to launch in trusted full-screen mode without the browser bar.

### 4. Rebuild the TWA
```bash
bubblewrap build
```

### 5. Test on Android Chrome
- Open https://seeker-droid.vercel.app on Android Chrome
- Tap "Connect" — MWA bottom sheet should appear
- Authorize in wallet app
- Tap "Verify Mobile Identity" — sign prompt should appear
- Both actions should work cleanly without "can't find wallet" errors
