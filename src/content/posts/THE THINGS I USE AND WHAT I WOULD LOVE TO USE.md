---
title: The Things I Use & What I Would Love to Use
description: A curated breakdown of the daily driver developer tools, hardware, and engineering gear I rely on, plus the wishlist of systems I'm eager to build with.
published: 2026-10-17
category: Setup & Gear
tags:
  - Hardware
  - Setup
  - Apple Silicon
  - Laptops
  - Smartphones
draft: false
---

A curated breakdown of the daily driver developer tools, hardware, and engineering gear I rely on for college, coding, and gaming—plus the wishlist of systems I'm eager to build with next.

---

## 1. Laptops & Core Compute

### MacBook Air 15" — The Daily Driver

- **Configuration:** 15-inch Display · Apple Silicon · 24 GB Unified Memory · 1 TB SSD

I am currently using my 15-inch MacBook Air for all my college coursework, software engineering, and machine learning experiments. And honestly, this machine is blazing fast for every single workload I throw at it.

I opted for the 24 GB unified memory configuration paired with 1 TB of storage, and for local LLMs, it has been an absolute game changer. Because of Apple’s unified memory architecture, the CPU and GPU share the entire memory pool without data transfer overhead. In day-to-day practice, once macOS and essential background utilities claim their share (~3–4 GB), I still have around 20–21 GB of fast, high-bandwidth memory dedicated solely to local model weights and KV caches (with swap memory stepping in seamlessly when needed).

What impresses me most is the battery efficiency: it maintains the exact same snappy performance on battery as it does plugged into a wall outlet, without any thermal throttling or fan noise. Combined with the thin, lightweight 15-inch form factor, carrying it across campus all day is effortless. It is easily one of the best tech investments I've ever made.

---

### Dell G15 5511 — The Gaming & CUDA Rig

- **Configuration:** Intel Core i5/i7 · NVIDIA GeForce RTX 3050 Ti (4 GB VRAM) · 16 GB RAM · 512 GB SSD

Before moving to the Mac, my primary machine was my Dell G15 5511 gaming laptop—and it sits on the complete opposite end of the spectrum. While its performance has seen better days and the display hinge has weathered some wear and tear, the overall build quality still feels like a sturdy tank.

Under the hood, it packs an NVIDIA RTX 3050 Ti with 4 GB of VRAM, 16 GB of system RAM, and 512 GB of storage. It certainly isn't winning any local LLM competitions with that 4 GB VRAM limitation, but it remains a solid powerhouse for PC gaming.

My main gripe with gaming on macOS is that mouse acceleration and polling rates feel notoriously clunky for competitive titles. That’s where the G15 still holds its ground: it allows me to plug in and easily play games like *Valorant*, *Roblox Rivals*, *Hollow Knight: Silksong*, and other PC favorites with native input and zero hassle.

Furthermore, having a dedicated NVIDIA GPU with native CUDA tensor cores makes it surprisingly valuable for running lightweight PyTorch training scripts and exploring CUDA kernels that Apple Silicon's MPS backend doesn't support natively. So for now, it's definitely keeping its place on my desk.

---

## 2. Mobile Devices & Everyday Carry

### Samsung Galaxy A55 — Primary Phone

- **Configuration:** Exynos 1480 · 12 GB RAM · 256 GB Storage · Samsung One UI

My current daily driver smartphone is the Samsung Galaxy A55, which I picked up earlier this year around March or April.

It features the Exynos 1480 chipset paired with 12 GB of RAM and 256 GB of onboard storage. While the Exynos processor isn't a chart-topping benchmark crusher compared to some competing flagship chips, I can wholeheartedly vouch for the phone's physical durability. I have accidentally dropped it more than 50 times (yes, I actually kept count!), and it has held up remarkably well with only a few minor scuffs and scrapes along the frame—which is well within reason given the drops it has survived.

Samsung's One UI is exceptionally customizable, though its default animation curves tend to favor slow, deliberate transitions that can make navigation feel sluggish. The quick fix—which both I and several of my friends swear by—is enabling **Developer Options** and changing the animation scale to **0.5x** (Window animation scale, Transition animation scale, and Animator duration scale). While you can also tune this through Samsung Good Lock, the 0.5x developer setting feels noticeably snappier and more consistent throughout the UI.

On the camera front, it takes clean, vibrant photos that are more than sufficient for everyday memories, campus life, and document scanning. While it won't rival a flagship with dedicated periscope telephoto optics or extreme low-light sensors, it reliably delivers when I need it.

---

### Vivo Y20G — The Backup Relic

- **Configuration:** MediaTek Helio G80 · 60 Hz Stacked LCD · The Nostalgia Machine

Before the Samsung, my daily driver was the Vivo Y20G. Looking back, that phone was quite the journey: it had its share of charging quirks and battery degradation over time, but it served as a faithful daily companion.

Eventually, I felt it was time to upgrade: the 60 Hz stacked LCD panel was showing its age, I wanted the deep contrast of a modern OLED display, and the MediaTek Helio G80 processor had certainly earned a well-deserved retirement from heavy daily duty. The camera was my biggest frustration on the Vivo, which the Galaxy A55 addressed by a significant margin.

Even now, I still keep the Y20G in my drawer as a backup relic—partly for nostalgia, and partly because you never truly discard your first real workhorse.

---

## 3. The Wishlist (What I Would Love to Use)

Looking ahead, here are a few systems and hardware additions I’d love to integrate into my workspace:

1. **Dedicated Linux ML Server / SFF Build**: A dedicated compact home server equipped with a high-VRAM NVIDIA GPU (like an RTX 3090/4090 or dual-GPU setup) to run continuous Ollama model inference, embeddings generation, and PyTorch training jobs 24/7 without occupying laptop resources.
2. **Single-Cable USB-C / Thunderbolt Display**: A color-accurate 4K or ultra-wide external monitor featuring 90W+ Power Delivery to dock the MacBook Air with a single cable while keeping the desk setup pristine.
3. **Custom Low-Profile Mechanical Keyboard**: A wireless, hot-swappable mechanical board (like a Keychron or NuPhy) paired with tactile switches to elevate the typing experience during long coding marathons.