# Adding something

1. Add an entry to `list.json` under the right section (`id` is `owner/repo` for GitHub, `owner/model` for Hugging Face, or a URL).
2. Run `node build.mjs`. It checks the entry against its live source and rewrites `README.md`. Commit both files.
3. Open a pull request. CI runs `node build.mjs --check` and fails on a dead, renamed or archived entry.

**What belongs:** open-source (or a real free tier), usable today, about training, evaluating or shipping *small* models, and checkable by script.
**What does not:** paid products, hype, and anything we cannot verify.
