---
title: "Running Local LLMs Offline: Benchmarks & Lessons as a 1st-Year Student"
published: 2026-10-17
description: "Why running quantized models locally on consumer hardware taught me more about inference latency, KV caching, and memory bandwidth than any API wrapper."
category: "Engineering"
tags: ["AI/ML", "Ollama", "Python", "Local AI", "Quantization"]
image: "/assets/pro-project-ollama.webp"
pinned: true
draft: false
---

Most beginners in AI/ML start by calling remote API endpoints—`client.chat.completions.create()`. While APIs are great for rapid prototyping, they obscure almost all the engineering reality: memory bandwidth bottlenecks, KV caching, quantization loss, and inference latency.

As a first-year student in Bengaluru, I wanted to understand what actually happens when an LLM generates tokens. I decided to take inference completely offline and benchmark quantized open-weight models on my own hardware using Ollama.

---

## 1. Why Offline Inference Matters

When you run models locally:
1. **Zero Latency from Network Roundtrips:** Every token is generated directly on your local silicon.
2. **Absolute Privacy:** Sensitive code and local files never leave your machine.
3. **Hardware Intuition:** You immediately understand why memory bandwidth (not just compute TFLOPS) is the true bottleneck for autoregressive token generation.

---

## 2. Benchmark Setup & Quantization

I tested two primary models quantized with GGUF format:
- **Llama 3.2 (3B)** – `Q4_K_M` (~2.0 GB RAM footprint)
- **Mistral (7B v0.3)** – `Q4_K_M` (~4.1 GB RAM footprint)

### Measured Performance Summary

| Metric | Llama 3.2 (3B Q4_K_M) | Mistral (7B Q4_K_M) |
| :--- | :--- | :--- |
| **Time to First Token (TTFT)** | ~180 ms | ~420 ms |
| **Generation Throughput** | ~42.4 tokens/sec | ~21.8 tokens/sec |
| **Active Memory Footprint** | ~2.1 GB | ~4.3 GB |
| **Cold Start Load Time** | < 1.2 s | ~2.8 s |

*Throughput observed during sustained 500-token generation sessions with temperature set to 0.7.*

---

## 3. Key Engineering Takeaways

### A. Memory Bandwidth is King
In autoregressive text generation, the weights must be read from memory for every single token generated. A 3B model quantized to 4-bit requires reading approximately ~1.8–2.0 GB per token step. If your unified memory bandwidth is ~100 GB/s, your theoretical throughput ceiling is roughly:

$$\text{Throughput} \approx \frac{100 \text{ GB/s}}{2.0 \text{ GB}} \approx 50 \text{ tokens/sec}$$

Seeing the benchmark land at ~42.4 tps confirmed the theoretical model in practice.

### B. `Q4_K_M` Strikes the Optimal Balance
For 3B and 7B parameter scales, 4-bit medium k-quantization (`Q4_K_M`) preserves nearly all grammatical coherence and factual retrieval while cutting memory consumption by ~65% compared to FP16.

---

## 4. What's Next: Bringing RAG to Local Inference

The next step in my journey is pairing this local model with a local embedding model (`nomic-embed-text`) and a custom Python retrieval pipeline to perform offline search across my personal lecture notes. 

Building systems from the ground up from Year 1 is the best way to develop deep engineering intuition.
