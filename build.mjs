// node build.mjs [--check] : verifies every entry against its live source and rebuilds README.md.
// Both modes fail if any entry cannot be verified. --check never writes anything.
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const list = JSON.parse(readFileSync("list.json", "utf-8"));
const checkOnly = process.argv.includes("--check");
let token = process.env.GITHUB_TOKEN;
if (!token) { try { token = execFileSync("gh", ["auth", "token"], { encoding: "utf-8" }).trim(); } catch { /* unauthenticated: low rate limit */ } }
const gh = { "user-agent": "awesome-model-training", accept: "application/vnd.github+json", ...(token ? { authorization: `Bearer ${token}` } : {}) };
const stars = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));
const day = (iso) => (iso ? iso.slice(0, 10) : "?");
const problems = [];
const COMMERCIAL = new Set(["apache-2.0", "mit", "bsd-3-clause", "bsd-2-clause", "mpl-2.0"]);

async function repo(item) {
  const r = await fetch(`https://api.github.com/repos/${item.id}`, { headers: gh });
  if (!r.ok) throw new Error(`GitHub ${r.status}`);
  const d = await r.json();
  if (d.archived) problems.push(`${item.id}: archived`);
  if (d.full_name.toLowerCase() !== item.id.toLowerCase()) problems.push(`${item.id}: renamed to ${d.full_name}`);
  return { name: d.full_name, url: d.html_url, lic: d.license?.spdx_id && d.license.spdx_id !== "NOASSERTION" ? d.license.spdx_id : "see repo", stars: stars(d.stargazers_count), updated: day(d.pushed_at) };
}
async function model(item) {
  const r = await fetch(`https://huggingface.co/api/models/${item.id}`);
  if (!r.ok) throw new Error(`Hugging Face ${r.status}`);
  const d = await r.json();
  const lic = d.cardData?.license ?? (d.tags ?? []).find((t) => t.startsWith("license:"))?.slice(8) ?? "see card";
  return { name: item.id, url: `https://huggingface.co/${item.id}`, lic, commercial: COMMERCIAL.has(String(lic).toLowerCase()) ? "yes" : "read the licence", downloads: d.downloads, updated: day(d.lastModified) };
}
async function link(item) {
  const r = await fetch(item.id, { redirect: "follow", headers: { "user-agent": gh["user-agent"] } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return { name: item.name, url: item.id };
}

let out = `# awesome-model-training

Free, open tools for training and shipping **small specialist models**, with the facts read from the live source and re-checked by a script. Licence, stars and last-updated date are not typed by hand.

**What goes in:** open-source (or a real free tier), actively usable, and something we can verify. **What stays out:** paid products, anything we cannot check, and hype. Free tiers change, so check limits yourself.

Last checked: ${new Date().toISOString().slice(0, 10)} · [How the list stays honest](#how-it-stays-honest)

<!--TOC-->

`;
for (const sec of list.sections) {
  out += `## ${sec.title}\n\n${sec.blurb ? sec.blurb + "\n\n" : ""}`;
  const rows = [];
  for (const item of sec.items) {
    try {
      const m = await ({ repo, model, link }[sec.kind])(item);
      rows.push({ item, m });
    } catch (e) { problems.push(`${item.id}: ${e.message}`); }
  }
  if (sec.kind === "repo") out += "| Project | What it is for | Licence | Stars | Updated |\n|---|---|---|---|---|\n" + rows.map(({ item, m }) => `| [${m.name}](${m.url}) | ${item.what} | ${m.lic} | ${m.stars} | ${m.updated} |`).join("\n") + "\n\n";
  else if (sec.kind === "model") out += "| Model | What it is | Licence (from its card) | Fine to sell with? | Updated |\n|---|---|---|---|---|\n" + rows.map(({ item, m }) => `| [${m.name}](${m.url}) | ${item.what} | ${m.lic} | ${m.commercial} | ${m.updated} |`).join("\n") + "\n\n";
  else out += rows.map(({ item, m }) => `- [${m.name}](${m.url}): ${item.what}`).join("\n") + "\n\n";
}
out += `## Lessons from a real run

From training a 1.5B model on a MacBook ([full numbers and failures](https://github.com/flisk-sh/flisk-model)):

- **A generated test can lie.** The model scored 62 of 62 on machine-written questions and 16 of 26 on questions written in natural wording. Write a second test by hand, *before* you change anything, and keep it out of training.
- **Ground truth from code beats ground truth from a model.** Build examples from structured specs and let a real validator check them.
- **Memory is the real limit on a Mac.** A 16 GB machine with Docker running swapped heavily and crashed the GPU job ("Impacting Interactivity"). Free the RAM, save checkpoints often, and use a trainer that resumes.
- **Shorter answers are a free win.** Compact JSON cut answer length from about 75 tokens to about 25.
- **Read the licence.** Of three same-family models, one was research-only.

## How it stays honest

\`node build.mjs\` reads \`list.json\`, checks every entry against GitHub or Hugging Face, and rewrites this file. \`node build.mjs --check\` runs in CI and fails on a dead, renamed or archived entry. To add something, edit \`list.json\` and open a pull request: it must pass the check.

[MIT](LICENSE)
`;
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/ /g, "-");
out = out.replace("<!--TOC-->", "**Contents:** " + [...list.sections.map((x) => x.title), "Lessons from a real run"].map((t) => `[${t}](#${slug(t)})`).join(" · "));
if (problems.length) { console.error("Problems:\n  " + problems.join("\n  ")); process.exit(1); }
if (!checkOnly) { writeFileSync("README.md", out); console.log(`README.md written (${list.sections.reduce((n, s) => n + s.items.length, 0)} entries, 0 problems)`); }
else console.log("all entries verified");
