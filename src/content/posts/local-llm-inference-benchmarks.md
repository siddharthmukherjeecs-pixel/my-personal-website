---
title: "Running Local LLMs Offline: Benchmarks & Lessons as a 1st-Year Student"
published: 2026-10-17
description: "How running quantized models locally on my laptop taught me more about memory bandwidth, token speed, and real hardware bottlenecks than just calling cloud APIs."
category: "Engineering"
tags: ["AI/ML", "Ollama", "Python", "Local AI", "Quantization"]
image: "/assets/pro-project-ollama.webp"
pinned: true
draft: false
---

When most beginners start with AI, they usually call cloud APIs like OpenAI or Gemini. You write one line of Python—`client.chat.completions.create()`—and the text appears like magic.

While APIs are great for quick prototypes, they hide almost everything that happens under the hood. You don't see how memory bandwidth limits speed, why longer conversations slow down the model, or how data moves through the chip.

As a first-year engineering student in Bengaluru, I wanted to understand how large language models actually run on real hardware. So I took inference completely offline, downloaded open-weight models using Ollama, and benchmarked them right on my own laptop.

---

## 1. Why Run Models Offline?

Running an LLM locally taught me three big things right away:

1. **Zero Network Lag:** Every token is generated directly on your laptop's silicon. You never wait for remote server queues or slow Wi-Fi.
2. **Complete Privacy:** Your code snippets, lecture notes, and personal data never leave your machine.
3. **Real Hardware Intuition:** You quickly realize that raw compute power (TFLOPS) isn't the real bottleneck for generating text—it's how fast your chip can move data out of memory (**memory bandwidth**).

---

## 2. Benchmark Setup & Quantization

To run models smoothly on a personal laptop, you can't load the massive original weights (FP16). Instead, I used **GGUF-format models** with **`Q4_K_M` quantization**.

In simple terms, quantization compresses each model weight from 16 bits down to roughly 4 bits. This cuts RAM usage by over **60%**, while keeping almost the exact same reasoning and grammar quality.

I tested two primary models on my setup:
- **Llama 3.2 (3B)** – `Q4_K_M` (~2.0 GB RAM footprint)
- **Mistral (7B v0.3)** – `Q4_K_M` (~4.1 GB RAM footprint)

### Measured Performance Summary

| Metric | Llama 3.2 (3B Q4_K_M) | Mistral (7B Q4_K_M) |
| :--- | :--- | :--- |
| **Time to First Token (TTFT)** | ~180 ms | ~420 ms |
| **Generation Throughput** | ~42.4 tokens/sec | ~21.8 tokens/sec |
| **Active Memory Footprint** | ~2.1 GB | ~4.3 GB |
| **Cold Start Load Time** | < 1.2 s | ~2.8 s |

*Metrics observed during sustained 500-token generation runs with temperature set to 0.7.*

---

## 3. Key Takeaways from the Numbers

### A. Memory Bandwidth is the Real Bottleneck

Here was my biggest "aha!" moment: LLMs generate text **one token at a time** (autoregressively).

To predict just *one* next token, the GPU has to read through nearly the entire model's weights in memory. That means for a 3-billion-parameter model at 4-bit, the system has to stream roughly **2.0 GB of data from RAM for every single word** it outputs!

Because of this, your maximum theoretical speed is simple physics:

$$\text{Theoretical Throughput} \approx \frac{\text{Memory Bandwidth (GB/s)}}{\text{Model Size in RAM (GB)}}$$

For example, on a system with roughly ~100 GB/s of unified memory bandwidth:

$$\text{Theoretical Ceiling} \approx \frac{100 \text{ GB/s}}{2.0 \text{ GB}} \approx 50 \text{ tokens/sec}$$

Seeing my real-world test land at **~42.4 tokens/sec** proved that the hardware math actually works in practice.

### B. Why `Q4_K_M` is the Sweet Spot

Before running these tests, I worried that 4-bit quantization would make the models give silly or broken answers. 

In reality, modern medium k-quantization (`Q4_K_M`) is remarkably smart. It keeps critical layers at slightly higher precision and quantizes the rest. The result? You get about **95%+ of full-model quality** while saving gigabytes of precious memory.

---

## 4. What I'm Building Next: Offline RAG

Now that I have fast local inference running smoothly, my next project is building an offline **Retrieval-Augmented Generation (RAG)** pipeline:

1. Use a fast local embedding model (like `nomic-embed-text`) to turn my college syllabus, PDFs, and handwritten notes into vectors.
2. Store the chunks in a lightweight local vector store.
3. Feed relevant context into Llama 3.2 so I can ask questions and study offline on campus without needing an internet connection.

Starting hands-on projects like this in my first year has been the best way to learn computer science. You gain so much more confidence when you build and benchmark systems yourself.
