import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const build = fileURLToPath(new URL("./build.mjs", import.meta.url));
const previous = "# Published list\n\nBoth resources were verified.\n";
const first = "https://example.test/first";
const second = "https://example.test/second";

function fixture(t, status) {
  const cwd = mkdtempSync(join(tmpdir(), "model-training-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const readme = join(cwd, "README.md");
  writeFileSync(readme, previous);
  writeFileSync(join(cwd, "list.json"), JSON.stringify({
    sections: [{
      kind: "link",
      title: "Resources",
      items: [
        { id: first, name: "First", what: "First resource" },
        { id: second, name: "Second", what: "Second resource" },
      ],
    }],
  }));
  const preload = `globalThis.fetch = async (url) => {
    if (url === ${JSON.stringify(first)}) return new Response(null, { status: 200 });
    if (url === ${JSON.stringify(second)}) return new Response(null, { status: ${status} });
    throw new Error("Unexpected request");
  };`;
  return {
    run: (...args) => spawnSync(process.execPath, [
      "--import", `data:text/javascript,${encodeURIComponent(preload)}`, build, ...args,
    ], { cwd, encoding: "utf8", env: { ...process.env, GITHUB_TOKEN: "fixture" } }),
    read: () => readFileSync(readme, "utf8"),
  };
}

test("preserves the published README when a source is unavailable", (t) => {
  const { run, read } = fixture(t, 503);
  for (const args of [["--check"], []]) {
    const result = run(...args);
    assert.match(result.stderr, /second: HTTP 503/);
    assert.equal(read(), previous);
    assert.equal(result.status, 1);
  }
});

test("writes the complete list only when all sources verify", (t) => {
  const { run, read } = fixture(t, 200);
  assert.equal(run("--check").status, 0);
  assert.equal(read(), previous);
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.ok(read().includes(`[First](${first})`));
  assert.ok(read().includes(`[Second](${second})`));
});
