# Analytics and Most Read setup

The guide includes an optional GoatCounter integration for shared public read counts. It is disabled by default, so the site does not send analytics traffic until you explicitly configure it.

## What becomes available

After setup, the guide can show:

- a read count in the metadata of each concept page
- a small total-read count in the footer
- a **Most Read** section on the homepage
- a **Most read** sorting option in Explore Concepts
- SPA pageview tracking for hash routes such as `#/concept/rag`, `#/playground`, and `#/research-lab`

The Most Read ranking is generated during the GitHub Pages build and refreshed by the scheduled Pages workflow every six hours. Visitors therefore load one small popularity file instead of requesting the counters for all concepts themselves.

## 1. Create a GoatCounter site

Create a site at GoatCounter and choose a site code. If your dashboard address is:

```text
https://my-guide.goatcounter.com
```

then your site code is:

```text
my-guide
```

## 2. Allow public visitor counters

In the GoatCounter site settings, enable:

**Allow adding visitor counts on your website**

GoatCounter keeps this disabled by default. The Agentic AI Master Guide uses the public JSON visitor-counter endpoint to display concept counts and build the Most Read ranking.

## 3. Enable analytics in the guide

Open:

```text
src/analytics-config.js
```

Change:

```js
export const analyticsConfig = {
  provider: 'goatcounter',
  enabled: true,
  siteCode: 'my-guide',
  sitePath: '/agentic-ai-master-guide/',
  respectDoNotTrack: true,
  showConceptCounts: true,
  showSiteTotal: true,
  showMostRead: true,
  mostReadLimit: 5,
  mostReadPeriod: 'week',
  popularRefreshHours: 6
};
```

Only replace `my-guide` with your actual GoatCounter site code.

Keep `sitePath` as `/agentic-ai-master-guide/` while the guide is hosted at the current GitHub Pages project URL. If the site later moves to a custom domain root, change it to `/`.

## 4. Push the change to `master`

The normal GitHub Pages workflow will:

1. run the smoke tests and JavaScript syntax checks
2. fetch the current weekly visitor count for every concept
3. write `public/analytics-popular.json`
4. build the static site
5. deploy the updated guide

The workflow also runs every six hours so the Most Read ranking can refresh without a code change.

## How SPA tracking works

The site uses hash routing. GoatCounter is loaded with automatic on-load counting disabled, and the guide manually records the current path whenever the hash route changes. A concept is therefore recorded using a path such as:

```text
/agentic-ai-master-guide/#/concept/rag
```

The same path is used when the build script asks GoatCounter for the public counter value, so tracking and displayed counts stay aligned.

## Privacy and failure behaviour

`respectDoNotTrack` is enabled by default in this project. When the browser has Do Not Track enabled, the guide does not load the tracking script.

Analytics is optional. If GoatCounter is blocked, unavailable, not configured, or public visitor counters are disabled, the learning guide still works and the analytics UI stays hidden rather than displaying invented numbers.

## Configuration options

| Setting | Purpose |
| --- | --- |
| `enabled` | Master switch for analytics |
| `siteCode` | GoatCounter site code before `.goatcounter.com` |
| `sitePath` | Public path used when recording and retrieving hash routes |
| `respectDoNotTrack` | Skip tracking when the browser requests DNT |
| `showConceptCounts` | Show read count on concept pages |
| `showSiteTotal` | Show total recorded reads in the footer |
| `showMostRead` | Show homepage Most Read and popularity sorting |
| `mostReadLimit` | Number of homepage concepts to show |
| `mostReadPeriod` | GoatCounter counter period used for ranking, currently `week` |
| `popularRefreshHours` | Cache/version interval used by the browser; keep aligned with the scheduled workflow |

## Troubleshooting

If tracking is enabled but no counts appear:

1. Confirm the GoatCounter site code is correct.
2. Confirm **Allow adding visitor counts on your website** is enabled.
3. Open a concept page on the public GitHub Pages URL rather than localhost.
4. Check whether a browser extension or network filter is blocking GoatCounter.
5. Run the Pages workflow manually after enabling the configuration so `analytics-popular.json` is regenerated immediately.
