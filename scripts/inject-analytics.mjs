import fs from "node:fs";
import path from "node:path";

const ENABLE_ANALYTICS =
  process.env.ENABLE_ANALYTICS === "1" ||
  process.env.ENABLE_ANALYTICS === "true";

const indexPath = path.resolve("index.html");
const html = fs.readFileSync(indexPath, "utf8");
const startMarker = "<!-- ANALYTICS_START -->";
const endMarker = "<!-- ANALYTICS_END -->";

const lines = html.split(/\r?\n/);
const startIndex = lines.findIndex(line => line.includes(startMarker));
const endIndex = lines.findIndex((line, index) => index > startIndex && line.includes(endMarker));

if (startIndex === -1 || endIndex === -1) {
  throw new Error("Analytics markers not found in index.html");
}

const indent = lines[startIndex].match(/^\s*/)?.[0] ?? "";
const snippetLines = ENABLE_ANALYTICS
  ? [
      "<!-- Google Analytics (Minimal Setup) -->",
      '<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>',
      "<script>",
      "  window.dataLayer = window.dataLayer || [];",
      "  function gtag(){dataLayer.push(arguments);}",
      "  gtag('js', new Date());",
      "  gtag('config', 'GA_MEASUREMENT_ID', {",
      "    'anonymize_ip': true,",
      "    'allow_google_signals': false,",
      "    'allow_ad_features': false",
      "  });",
      "</script>",
    ].map(line => `${indent}${line}`)
  : [];

const replacement = [lines[startIndex], ...snippetLines, lines[endIndex]];
lines.splice(startIndex, endIndex - startIndex + 1, ...replacement);

const replaced = lines.join("\n");
if (replaced !== html) {
  fs.writeFileSync(indexPath, replaced, "utf8");
}

console.log(
  ENABLE_ANALYTICS
    ? "Analytics enabled for index.html"
    : "Analytics disabled for index.html"
);
