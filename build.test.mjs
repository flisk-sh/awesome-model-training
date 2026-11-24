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
    write: (text) => writeFileSync(readme, text),
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

test("writes the complete list only when all sources verify, and --check passes on the fresh README", (t) => {
  const { run, read } = fixture(t, 200);
  // --check also compares README.md to a fresh build, so it fails on the stub README
  // and passes once build.mjs has written the real one.
  assert.equal(run("--check").status, 1);
  assert.equal(read(), previous);
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.ok(read().includes(`[First](${first})`));
  assert.ok(read().includes(`[Second](${second})`));
  const checked = run("--check");
  assert.equal(checked.status, 0, checked.stderr);
});

// A hand edit to README.md used to pass --check, which only asked whether the sources were alive.
// Now the published file is compared to a fresh build with the live numbers blanked, so an
// unverified edit fails the same way a dead link does.
test("fails --check when the published README was edited by hand", (t) => {
  const { run, read, write } = fixture(t, 200);
  assert.equal(run().status, 0, "build must write a matching README first");
  write(read().replace("First resource", "Hand-typed claim"));
  const result = run("--check");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /does not match a fresh build/);
});
