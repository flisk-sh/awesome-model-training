# awesome-small-model-training

Free, open tools for training and shipping **small specialist models**, with the facts read from the live source and re-checked by a script. Licence, stars and last-updated date are not typed by hand.

**What goes in:** open-source (or a real free tier), actively usable, and something we can verify. **What stays out:** paid products, anything we cannot check, and hype. Free tiers change, so check limits yourself.

Last checked: 2026-10-30 · [How the list stays honest](#how-it-stays-honest)

## Train on a Mac (Apple Silicon)

Everything here runs on a MacBook with 16 GB. This is what the Flisk model was trained with.

| Project | What it is for | Licence | Stars | Updated |
|---|---|---|---|---|
| [ml-explore/mlx-lm](https://github.com/ml-explore/mlx-lm) | Fine-tune (LoRA, QLoRA, DoRA), fuse, quantize and serve LLMs on Apple Silicon. The tool behind the worked example below. | MIT | 7.5k | 2026-10-30 |
| [ml-explore/mlx](https://github.com/ml-explore/mlx) | The array framework under it: NumPy-like, runs on the Mac GPU with unified memory. | MIT | 29k | 2026-10-30 |
| [ml-explore/mlx-examples](https://github.com/ml-explore/mlx-examples) | Worked examples for MLX, from text generation to fine-tuning. | MIT | 9.0k | 2026-04-06 |

## Fine-tuning libraries

Pick one. They all do LoRA/QLoRA; they differ in speed, memory use and how much they hide.

| Project | What it is for | Licence | Stars | Updated |
|---|---|---|---|---|
| [unslothai/unsloth](https://github.com/unslothai/unsloth) | Fast, low-memory LoRA training with free Colab and Kaggle notebooks. | Apache-2.0 | 79k | 2026-10-30 |
| [huggingface/peft](https://github.com/huggingface/peft) | The standard library for LoRA and other parameter-efficient methods. | Apache-2.0 | 22k | 2026-10-30 |
| [huggingface/trl](https://github.com/huggingface/trl) | Supervised fine-tuning plus preference methods (DPO and friends) on top of PEFT. | Apache-2.0 | 20k | 2026-10-30 |
| [axolotl-ai-cloud/axolotl](https://github.com/axolotl-ai-cloud/axolotl) | Config-file driven fine-tuning of many models, single GPU to multi-GPU. | Apache-2.0 | 13k | 2026-10-30 |
| [hiyouga/LlamaFactory](https://github.com/hiyouga/LlamaFactory) | A broad fine-tuning toolkit with a web UI, for many model families. | Apache-2.0 | 76k | 2026-10-29 |
| [meta-pytorch/torchtune](https://github.com/meta-pytorch/torchtune) | PyTorch-native, readable fine-tuning recipes. | BSD-3-Clause | 5.8k | 2026-09-09 |

## Run, quantize and serve

Turning a trained model into something people can call.

| Project | What it is for | Licence | Stars | Updated |
|---|---|---|---|---|
| [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp) | Run models on CPU and GPU, convert to GGUF, quantize, and constrain output with grammars. | MIT | 133k | 2026-10-30 |
| [ollama/ollama](https://github.com/ollama/ollama) | One-command local model server with an OpenAI-compatible API and a Modelfile format. | MIT | 185k | 2026-10-30 |
| [vllm-project/vllm](https://github.com/vllm-project/vllm) | High-throughput GPU serving engine. | Apache-2.0 | 96k | 2026-10-30 |

## Make the output valid

For structured answers such as JSON or config files, force the output to match a schema instead of hoping.

| Project | What it is for | Licence | Stars | Updated |
|---|---|---|---|---|
| [dottxt-ai/outlines](https://github.com/dottxt-ai/outlines) | Structured generation: constrain a model to a JSON schema, regex or grammar. | Apache-2.0 | 16k | 2026-09-21 |
| [guidance-ai/llguidance](https://github.com/guidance-ai/llguidance) | Fast constrained decoding engine used by several serving stacks. | MIT | 904 | 2026-10-29 |
| [mlc-ai/xgrammar](https://github.com/mlc-ai/xgrammar) | Efficient grammar-constrained decoding for LLM serving. | Apache-2.0 | 2.0k | 2026-10-29 |

## Test your model

A model you cannot measure is a model you cannot improve.

| Project | What it is for | Licence | Stars | Updated |
|---|---|---|---|---|
| [EleutherAI/lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) | The standard harness for benchmarking language models. | MIT | 14k | 2026-09-14 |
| [huggingface/lighteval](https://github.com/huggingface/lighteval) | Lightweight evaluation toolkit from Hugging Face. | MIT | 2.6k | 2026-10-29 |

## Data

| Project | What it is for | Licence | Stars | Updated |
|---|---|---|---|---|
| [huggingface/datasets](https://github.com/huggingface/datasets) | Load, share and process datasets of any size. | Apache-2.0 | 22k | 2026-10-30 |
| [argilla-io/distilabel](https://github.com/argilla-io/distilabel) | Build synthetic datasets and feedback pipelines for fine-tuning. | Apache-2.0 | 3.4k | 2026-10-26 |

## Small open models with a clear licence

Licence column is read from each model's own card. Check it before you sell anything built on a model.

| Model | What it is | Licence (from its card) | Fine to sell with? | Updated |
|---|---|---|---|---|
| [Qwen/Qwen2.5-Coder-1.5B-Instruct](https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct) | Small coding model. Fine-tuned in the worked example below. | apache-2.0 | yes | 2025-01-12 |
| [Qwen/Qwen2.5-Coder-7B-Instruct](https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct) | Larger coding sibling. | apache-2.0 | yes | 2025-01-12 |
| [Qwen/Qwen2.5-Coder-3B-Instruct](https://huggingface.co/Qwen/Qwen2.5-Coder-3B-Instruct) | The middle size. Note its licence is different from the other two. | other | read the licence | 2025-01-12 |
| [HuggingFaceTB/SmolLM2-1.7B-Instruct](https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct) | Small general model built for on-device use. | apache-2.0 | yes | 2025-04-21 |
| [microsoft/Phi-4-mini-instruct](https://huggingface.co/microsoft/Phi-4-mini-instruct) | Small reasoning-leaning model from Microsoft. | mit | yes | 2025-12-10 |

## Learn how it works

| Project | What it is for | Licence | Stars | Updated |
|---|---|---|---|---|
| [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT) | The simplest, fastest repo for training and fine-tuning medium-sized GPTs. | MIT | 64k | 2025-11-12 |
| [rasbt/LLMs-from-scratch](https://github.com/rasbt/LLMs-from-scratch) | Build a GPT-style model step by step, with code and explanations. | see repo | 108k | 2026-10-30 |

## Free compute

Free tiers change often, so check the current limits before you plan around them.

- [Google Colab](https://colab.research.google.com): Free notebooks with a GPU for short sessions. Many fine-tuning notebooks run here.
- [Kaggle Notebooks](https://www.kaggle.com/docs/notebooks): Free GPU hours per week in the browser.
- [Hugging Face LLM course](https://huggingface.co/learn/llm-course): A free course on transformers, fine-tuning and evaluation.

## Worked example

A full small-model project with its numbers published, including the failures.

| Project | What it is for | Licence | Stars | Updated |
|---|---|---|---|---|
| [flisk-sh/flisk-model](https://github.com/flisk-sh/flisk-model) | Trains a 1.5B model on a MacBook to write Flisk config files, graded by the real validator, with Claude, Qwen and prompted baselines. | MIT | 0 | 2026-10-30 |

## Lessons from a real run

From training a 1.5B model on a MacBook ([full numbers and failures](https://github.com/flisk-sh/flisk-model)):

- **A generated test can lie.** The model scored 62 of 62 on machine-written questions and 16 of 26 on questions written in natural wording. Write a second test by hand, *before* you change anything, and keep it out of training.
- **Ground truth from code beats ground truth from a model.** Build examples from structured specs and let a real validator check them.
- **Memory is the real limit on a Mac.** A 16 GB machine with Docker running swapped heavily and crashed the GPU job ("Impacting Interactivity"). Free the RAM, save checkpoints often, and use a trainer that resumes.
- **Shorter answers are a free win.** Compact JSON cut answer length from about 75 tokens to about 25.
- **Read the licence.** Of three same-family models, one was research-only.

## How it stays honest

`node build.mjs` reads `list.json`, checks every entry against GitHub or Hugging Face, and rewrites this file. `node build.mjs --check` runs in CI and fails on a dead, renamed or archived entry. To add something, edit `list.json` and open a pull request: it must pass the check.

[MIT](LICENSE)
