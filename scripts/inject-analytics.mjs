import fs from "node:fs";
import path from "node:path";

const ENABLE_ANALYTICS =
  process.env.ENABLE_ANALYTICS === "1" ||
  process.env.ENABLE_ANALYTICS === "true";

const indexPath = path.resolve("index.html");
const html = fs.readFileSync(indexPath, "utf8");
const startMarker = "<!-- ANALYTICS_START -->";
const endMarker = "<!-- ANALYTICS_END -->";

if (!html.includes(startMarker) || !html.includes(endMarker)) {
  throw new Error("Analytics markers not found in index.html");
}

const snippet = ENABLE_ANALYTICS
  ? `    <!-- Google Analytics (Minimal Setup) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID', {
        'anonymize_ip': true,
        'allow_google_signals': false,
        'allow_ad_features': false
      });
    </script>`
  : "";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const markerPattern = new RegExp(
  `${escapeRegExp(startMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}`,
  "m"
);

const replaced = html.replace(
  markerPattern,
  `${startMarker}\n${snippet}${snippet ? "\n" : ""}${endMarker}`
);

fs.writeFileSync(indexPath, replaced, "utf8");
console.log(
  ENABLE_ANALYTICS
    ? "Analytics enabled for index.html"
    : "Analytics disabled for index.html"
);
