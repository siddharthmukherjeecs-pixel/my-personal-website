<script lang="ts">
import { onMount } from "svelte";

export interface Props {
	authorName?: string;
	authorAvatar?: string;
}

let {
	authorName = "Siddharth Mukherjee",
	authorAvatar = "/_astro/demo-avatar.B0TLgbTh_1Kppty.webp",
}: Props = $props();

const paperColors = [
	{ value: "butter", label: "奶油黄", mood: "留一点阳光" },
	{ value: "rose", label: "樱花粉", mood: "送一份温柔" },
	{ value: "mint", label: "薄荷绿", mood: "收集小确幸" },
	{ value: "sky", label: "晴空蓝", mood: "写一个愿望" },
	{ value: "lilac", label: "浅芋紫", mood: "藏一点浪漫" },
] as const;

type PaperColor = (typeof paperColors)[number]["value"];

interface Message {
	id: string;
	name: string;
	content: string;
	date: string;
	color: PaperColor;
}

const storageKey = "kanade:guestbook:v1";

let name = $state("");
let content = $state("");
let selectedColor = $state<PaperColor>("butter");
let messages = $state<Message[]>([]);
let feedback = $state("");
let error = $state("");
let ready = $state(false);
let newestFirst = $state(true);
let freshId = $state("");
let textareaEl: HTMLTextAreaElement | undefined = $state();

const orderedMessages = $derived(
	newestFirst ? messages : [...messages].reverse()
);

const selectedPaper = $derived(
	paperColors.find((color) => color.value === selectedColor) || paperColors[0]
);

function hash(value: string): number {
	return Array.from(value).reduce(
		(total, character) => (total * 31 + character.charCodeAt(0)) >>> 0,
		0,
	);
}

function normalizeMessage(value: unknown): Message | null {
	if (typeof value !== "object" || value === null) return null;
	const item = value as Partial<Message>;
	if (
		typeof item.id !== "string" ||
		!item.id ||
		typeof item.name !== "string" ||
		!item.name.trim() ||
		item.name.length > 24 ||
		typeof item.content !== "string" ||
		!item.content.trim() ||
		item.content.length > 500 ||
		typeof item.date !== "string" ||
		!Number.isFinite(Date.parse(item.date))
	) {
		return null;
	}
	const color =
		paperColors.find((paper) => paper.value === item.color)?.value ||
		paperColors[hash(item.id) % paperColors.length].value;
	return {
		id: item.id,
		name: item.name,
		content: item.content,
		date: item.date,
		color,
	};
}

onMount(() => {
	try {
		const raw = JSON.parse(localStorage.getItem(storageKey) || "[]");
		const seen = new Set<string>();
		messages = Array.isArray(raw)
			? raw
					.map(normalizeMessage)
					.filter((message): message is Message => {
						if (!message || seen.has(message.id)) return false;
						seen.add(message.id);
						return true;
					})
					.slice(0, 100)
					.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
			: [];
	} catch {
		error = "浏览器存储暂不可用。你仍可以编辑文字，请复制留存。";
	}
	ready = true;
});

function save(next: Message[]): boolean {
	try {
		localStorage.setItem(storageKey, JSON.stringify(next));
		messages = next;
		return true;
	} catch {
		error = "留言未保存：浏览器存储已满或已被关闭，请复制文字留存后重试。";
		return false;
	}
}

async function submit(e: Event) {
	e.preventDefault();
	error = "";
	feedback = "";
	const author = name.trim();
	const text = content.trim();
	if (!author || !text) {
		error = "请填写昵称和想说的话。";
		return;
	}
	if (author.length > 24 || text.length > 500) {
		error = "昵称最多 24 字，留言最多 500 字。";
		return;
	}
	if (messages.length >= 100) {
		error = "本地已保存 100 条留言，删除一些旧留言后再试试。";
		return;
	}
	const id =
		globalThis.crypto?.randomUUID?.() ||
		`${Date.now()}-${Math.random().toString(36).slice(2)}`;
	if (
		save([
			{
				id,
				name: author,
				content: text,
				date: new Date().toISOString(),
				color: selectedColor,
			},
			...messages,
		])
	) {
		freshId = id;
		newestFirst = true;
		content = "";
		feedback = "便签已贴上墙！已保存在当前浏览器，刷新后仍可查看。";
		setTimeout(() => {
			document.getElementById(`note-${id}`)?.scrollIntoView({
				block: "nearest",
				behavior: "smooth",
			});
		}, 50);
	}
}

function remove(id: string) {
	error = "";
	if (save(messages.filter((message) => message.id !== id))) {
		feedback = "这张便签已从留言墙取下。";
	}
}

function insertEmoji(value: string) {
	if (content.length + value.length <= 500) {
		content += value;
	}
	textareaEl?.focus();
}

function startWriting() {
	textareaEl?.focus();
}

function dateLabel(date: string) {
	try {
		return new Intl.DateTimeFormat("zh-CN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}).format(new Date(date));
	} catch {
		return date.slice(0, 10);
	}
}

function tilt(id: string): string {
	return `${[-1.8, 1.2, -0.8, 1.7, -1.1][hash(id) % 5]}deg`;
}
</script>

<div class="guestbook" data-ready={ready}>
	<!-- Header -->
	<header class="wall-heading">
		<div>
			<span class="eyebrow">LITTLE NOTES, WARM CONNECTIONS</span>
			<h2>把心情，贴在这里<span aria-hidden="true">✿</span></h2>
			<p>选一张喜欢的颜色，留下一点此刻的心情。每一句话，都值得被好好收藏。</p>
		</div>
		<div class="wall-stamp" aria-hidden="true">
			<svg class="stamp-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/>
				<path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>
			</svg>
			<span>见字如面</span>
			<small>WITH LOVE</small>
		</div>
	</header>

	<div class="wall-layout">
		<!-- Left Composer -->
		<section class="card composer" aria-labelledby="compose-title">
			<div class="composer-heading">
				<h3 id="compose-title">
					<svg class="h-4 w-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 20h9"/>
						<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
					</svg>
					写一张便签
				</h3>
				<span class="compose-step">MAKE A LITTLE MARK</span>
			</div>

			<form onsubmit={submit}>
				<fieldset class="color-picker">
					<legend>今天的心情是什么颜色？</legend>
					<div class="color-options">
						{#each paperColors as paper}
							<label class="color-option">
								<input
									type="radio"
									name="paper-color"
									value={paper.value}
									checked={selectedColor === paper.value}
									onchange={() => (selectedColor = paper.value)}
									aria-label={paper.label}
								/>
								<span
									class="color-swatch paper"
									data-color={paper.value}
									title={`${paper.label} · ${paper.mood}`}
								>
									{#if selectedColor === paper.value}
										<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
											<polyline points="20 6 9 17 4 12"/>
										</svg>
									{/if}
								</span>
							</label>
						{/each}
						<span class="color-name">{selectedPaper.label}</span>
					</div>
				</fieldset>

				<div class="writing-paper paper" data-color={selectedColor}>
					<span class="paper-tape" aria-hidden="true"></span>
					<label class="field-label" for="guest-name">怎么称呼你<span>*</span></label>
					<input
						id="guest-name"
						bind:value={name}
						class="paper-input"
						type="text"
						autocomplete="nickname"
						placeholder="留下你的昵称"
						maxlength="24"
						required
					/>
					<label class="field-label" for="guest-content">想说的话<span>*</span></label>
					<textarea
						id="guest-content"
						bind:this={textareaEl}
						bind:value={content}
						class="paper-input"
						rows="5"
						placeholder="路过这里，想对你说…"
						maxlength="500"
						required
					></textarea>
					<div class="writing-bottom">
						<span>{selectedPaper.mood} <span aria-hidden="true">♡</span></span>
						<span>{content.length} / 500</span>
					</div>
				</div>

				<div class="message-toolbar">
					<div class="emoji-buttons">
						{#each ["🌸", "✨", "☕", "🍀", "💖"] as item}
							<button
								type="button"
								onclick={() => insertEmoji(item)}
								aria-label={`插入表情 ${item}`}
							>
								{item}
							</button>
						{/each}
					</div>
					<span>加一点心情</span>
				</div>

				<button type="submit" class="btn stick-button" disabled={!ready}>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 17v5"/>
						<path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>
					</svg>
					贴到留言墙
					<svg class="h-4 w-4 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="7" y1="17" x2="17" y2="7"/>
						<polyline points="7 7 17 7 17 17"/>
					</svg>
				</button>

				{#if feedback}
					<p class="form-feedback" role="status">{feedback}</p>
				{/if}
				{#if error}
					<p class="form-error" role="alert">{error}</p>
				{/if}
			</form>

			<div class="local-notice">
				<svg class="h-3.5 w-3.5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
					<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
				</svg>
				<p>这是你的本地留言墙。便签仅保存在当前浏览器，仅你可见，不会发送给站长或跨设备同步。</p>
			</div>
		</section>

		<!-- Right Note Board -->
		<section class="note-board" aria-labelledby="board-title">
			<div class="board-toolbar">
				<div>
					<svg class="h-5 w-5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/>
						<path d="M15 3v5h6"/>
					</svg>
					<h3 id="board-title">心意收集处</h3>
					<span class="note-count">{messages.length} 张便签</span>
				</div>
				<button
					type="button"
					class="sort-button"
					onclick={() => (newestFirst = !newestFirst)}
					aria-label={newestFirst ? "切换为最早优先" : "切换为最新优先"}
				>
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="m3 16 4 4 4-4"/>
						<path d="M7 20V4"/>
						<path d="m21 8-4-4-4 4"/>
						<path d="M17 4v16"/>
					</svg>
					{newestFirst ? "最新贴上" : "最早贴上"}
				</button>
			</div>

			<div class="wall-canvas" aria-busy={!ready}>
				<div class="note-grid">
					<!-- Dynamic User Messages -->
					{#each orderedMessages as message (message.id)}
						<article
							id={`note-${message.id}`}
							class="message sticky-note paper"
							class:just-posted={freshId === message.id}
							data-color={message.color}
							style={`--tilt: ${tilt(message.id)};`}
							aria-label={`${message.name} 的便签`}
						>
							<span class="paper-tape" aria-hidden="true"></span>
							<button
								type="button"
								class="remove-note"
								onclick={() => remove(message.id)}
								aria-label={`删除 ${message.name} 的留言`}
								title="取下这张便签"
							>
								<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<line x1="18" y1="6" x2="6" y2="18"/>
									<line x1="6" y1="6" x2="18" y2="18"/>
								</svg>
							</button>
							<span class="note-hello" aria-hidden="true">
								Dear, today<span>✧</span>
							</span>
							<div class="message-main">
								<p>{message.content}</p>
							</div>
							<footer class="note-footer">
								<div class="note-author">
									<span class="note-avatar" aria-hidden="true">
										{Array.from(message.name)[0]}
									</span>
									<strong>{message.name}</strong>
								</div>
								<time datetime={message.date}>{dateLabel(message.date)}</time>
							</footer>
							<span class="paper-fold" aria-hidden="true"></span>
						</article>
					{/each}

					<!-- Pinned Welcome Note -->
					<article
						class="sticky-note paper welcome-note"
						data-color="rose"
						style="--tilt: -1.2deg"
						aria-label="小站寄语"
					>
						<span class="paper-tape" aria-hidden="true"></span>
						<span class="note-hello">
							小站寄语<span aria-hidden="true">♡</span>
						</span>
						<div class="message-main">
							<h4>很高兴，在这里遇见你。</h4>
							<p>一句问候，一个愿望，<br/>或是今天遇见的小确幸。<br/><br/>把想说的话留在这里，<br/>让平凡的一天多一点颜色。</p>
						</div>
						<footer class="note-footer">
							<div class="note-author">
								<img
									src={authorAvatar}
									alt={authorName}
									class="w-6 h-6 rounded-full object-cover"
									width="24"
									height="24"
								/>
								<strong>{authorName}</strong>
							</div>
							<span>欢迎路过<span aria-hidden="true">✿</span></span>
						</footer>
						<span class="paper-fold" aria-hidden="true"></span>
					</article>

					<!-- Inspiration Note -->
					{#if !messages.length}
						<article
							class="sticky-note paper inspiration-note"
							data-color="mint"
							style="--tilt: 1.6deg"
							aria-label="写作灵感"
						>
							<span class="paper-tape" aria-hidden="true"></span>
							<span class="note-hello">
								一点灵感<span aria-hidden="true">✧</span>
							</span>
							<span class="inspiration-flower" aria-hidden="true">✿</span>
							<h4>不知道写点什么？</h4>
							<p>今天有什么让你笑了一下？<br/>最近在听哪一首歌？<br/>想对未来的自己说什么？</p>
							<span class="inspiration-sign">小事也值得被记录。</span>
							<span class="paper-fold" aria-hidden="true"></span>
						</article>

						<!-- Empty State Action -->
						<button
							type="button"
							class="empty-note"
							onclick={startWriting}
						>
							<span class="empty-plus">+</span>
							<strong>第一张便签，留给你</strong>
							<span>写下此刻，贴上一点温柔</span>
							<span class="empty-arrow" aria-hidden="true">↖</span>
						</button>
					{/if}
				</div>

				<div class="board-bottom">
					<span></span>
					<p>{messages.length ? "每一张便签，都是认真生活的小小证据。" : "墙面还很空，但好故事总是从第一句话开始。"}</p>
					<span></span>
				</div>
			</div>
		</section>
	</div>

	<p class="wall-footnote">
		<svg class="h-3.5 w-3.5 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
		</svg>
		风会吹走烦恼，文字会留下温度。
	</p>
</div>

<style>
:global(:root) {
  --accent: var(--primary, #d9889f);
  --accent-soft: color-mix(in srgb, var(--primary, #d9889f) 14%, transparent);
  --muted: var(--on-surface-variant, #8c828a);
  --line: var(--outline-variant, #e8dbe0);
  --card: var(--card-bg, #ffffff);
  --bg: var(--page-bg, #fbf7f8);
}
:global(.dark) {
  --accent: var(--primary, #e8a0b5);
  --accent-soft: color-mix(in srgb, var(--primary, #e8a0b5) 18%, transparent);
  --muted: var(--on-surface-variant, #a89ba4);
  --line: var(--outline-variant, #3a3238);
  --card: var(--card-bg, #1e1a1d);
  --bg: var(--page-bg, #141113);
}

.guestbook {
  width: 100%;
}

.welcome-note .message-main p,
.inspiration-note > p {
  white-space: pre-line;
}
.wall-heading {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  margin: 5px 0 30px;
}
.wall-heading .eyebrow {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--accent);
  font-weight: 600;
  margin-bottom: 4px;
}
.wall-heading h2 {
  margin: 6px 0 10px;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--on-surface, #201a1c);
}
.wall-heading h2 > span {
  display: inline-block;
  color: var(--accent);
  font-size: 26px;
  margin-left: 10px;
  transform: rotate(-15deg);
}
.wall-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.9;
}
.wall-stamp {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3px;
  width: 95px;
  height: 95px;
  flex-shrink: 0;
  border: 1px dashed #db9baf;
  outline: 1px solid #e8c2cd80;
  outline-offset: 5px;
  border-radius: 50%;
  color: var(--accent);
  transform: rotate(12deg);
  margin-right: 12px;
  opacity: 0.85;
}
.stamp-icon {
  width: 22px;
  height: 22px;
}
.wall-stamp > span:nth-child(2) {
  font-size: 13px;
  letter-spacing: 0.12em;
  font-weight: 500;
}
.wall-stamp small {
  font-size: 8px;
  letter-spacing: 0.18em;
  font-family: inherit;
}
.wall-layout {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  gap: 26px;
  align-items: start;
}
.composer {
  padding: 23px;
  position: sticky;
  top: 90px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 4px 20px #0000000a;
}
.composer-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 22px;
}
.composer-heading h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--on-surface, #201a1c);
}
.compose-step {
  font-size: 8px;
  color: var(--muted);
  letter-spacing: 0.07em;
  font-weight: 600;
}
.color-picker {
  border: 0;
  padding: 0;
  margin: 0 0 24px;
  min-width: 0;
}
.color-picker legend {
  font-size: 11px;
  color: var(--muted);
  margin-bottom: 11px;
}
.color-options {
  display: flex;
  gap: 9px;
  align-items: center;
}
.color-option {
  position: relative;
  display: block;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  cursor: pointer;
}
.color-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.color-swatch {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  background: var(--paper-bg);
  color: var(--paper-ink);
  border: 1px solid #00000008;
  border-radius: 50%;
  transition: transform 0.2s, outline 0.2s;
}
.color-option:hover .color-swatch {
  transform: translateY(-2px);
}
.color-option input:checked + .color-swatch {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
.color-name {
  margin-left: auto;
  color: var(--muted);
  font-size: 10px;
  white-space: nowrap;
}

/* Paper Palette - Light Mode */
.paper {
  --paper-bg: #fbefc9;
  --paper-ink: #665332;
  --paper-muted: #8b7346;
  --paper-tape: #d8bb766e;
  --paper-line: #d5bd803d;
  --paper-fold: #e4cc91;
  color: var(--paper-ink);
}
.paper[data-color="rose"] {
  --paper-bg: #fbe2e9;
  --paper-ink: #805165;
  --paper-muted: #9b6b7c;
  --paper-tape: #dba6b77a;
  --paper-line: #d5a4b23d;
  --paper-fold: #e6bccb;
}
.paper[data-color="mint"] {
  --paper-bg: #e1efdf;
  --paper-ink: #4c6b54;
  --paper-muted: #6e8a6d;
  --paper-tape: #aac7a685;
  --paper-line: #9cbd973d;
  --paper-fold: #bed8b9;
}
.paper[data-color="sky"] {
  --paper-bg: #e0edf9;
  --paper-ink: #496582;
  --paper-muted: #6c87a4;
  --paper-tape: #a1bfda78;
  --paper-line: #9fb8d23d;
  --paper-fold: #bbd2e8;
}
.paper[data-color="lilac"] {
  --paper-bg: #eee3f8;
  --paper-ink: #705689;
  --paper-muted: #8b729e;
  --paper-tape: #c0a5d685;
  --paper-line: #b59bc83d;
  --paper-fold: #d4bfe6;
}

/* Paper Palette - Dark Mode */
:global(.dark) .paper {
  --paper-bg: #4a4230;
  --paper-ink: #f4e7bf;
  --paper-muted: #d4c28f;
  --paper-tape: #b7a16a70;
  --paper-line: #bda56330;
  --paper-fold: #675936;
}
:global(.dark) .paper[data-color="rose"] {
  --paper-bg: #4b3542;
  --paper-ink: #f7d6e4;
  --paper-muted: #d6b1c2;
  --paper-tape: #b8839b65;
  --paper-line: #d399b530;
  --paper-fold: #6a485b;
}
:global(.dark) .paper[data-color="mint"] {
  --paper-bg: #34483e;
  --paper-ink: #d8efd9;
  --paper-muted: #b1ccb5;
  --paper-tape: #82ad8c65;
  --paper-line: #a1cba030;
  --paper-fold: #4a6250;
}
:global(.dark) .paper[data-color="sky"] {
  --paper-bg: #334457;
  --paper-ink: #d5e7fb;
  --paper-muted: #acc5de;
  --paper-tape: #7a9bbb65;
  --paper-line: #92b8d630;
  --paper-fold: #4a6380;
}
:global(.dark) .paper[data-color="lilac"] {
  --paper-bg: #443951;
  --paper-ink: #eee0fb;
  --paper-muted: #cbb4de;
  --paper-tape: #a58bbd65;
  --paper-line: #bd9cd930;
  --paper-fold: #604d74;
}

.writing-paper {
  position: relative;
  background: var(--paper-bg);
  padding: 23px 17px 12px;
  border-radius: 2px 3px 10px 2px;
  box-shadow: 2px 5px 12px #59411e0a;
  transition: background 0.2s, color 0.2s;
}
.paper-tape {
  position: absolute;
  width: 74px;
  height: 22px;
  left: calc(50% - 37px);
  top: -10px;
  background: var(--paper-tape);
  transform: rotate(-5deg);
  opacity: 0.8;
  clip-path: polygon(3% 0, 100% 3%, 97% 100%, 0 95%);
  z-index: 1;
}
.paper-tape::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent 0 3px,
    #ffffff1a 3px 4px
  );
}
.field-label {
  display: block;
  font-size: 10px;
  color: var(--paper-muted);
  margin: 4px 0 6px;
  font-weight: 500;
}
.field-label > span {
  opacity: 0.65;
}
.paper-input {
  width: 100%;
  border: 0;
  border-bottom: 1px dashed var(--paper-line);
  border-radius: 0;
  color: var(--paper-ink);
  background: transparent;
  font-size: 13px;
  padding: 4px 0 9px;
  font-family: inherit;
}
.paper-input::placeholder {
  color: var(--paper-muted);
  opacity: 0.85;
}
input.paper-input {
  margin-bottom: 14px;
}
textarea.paper-input {
  resize: vertical;
  min-height: 132px;
  line-height: 27px;
  background: repeating-linear-gradient(
    transparent 0 26px,
    var(--paper-line) 26px 27px
  );
  padding: 0;
  border: 0;
}
.paper-input:focus-visible {
  outline-color: var(--paper-muted);
  outline-width: 1px;
  outline-offset: 3px;
}
.writing-bottom {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  padding-top: 10px;
  font-size: 10px;
  color: var(--paper-muted);
}
.message-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  margin: 15px 0;
}
.message-toolbar > span {
  font-size: 10px;
  color: var(--muted);
}
.emoji-buttons {
  display: flex;
  gap: 4px;
}
.emoji-buttons button {
  border: 0;
  background: var(--accent-soft);
  width: 28px;
  height: 28px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s;
}
.emoji-buttons button:hover {
  transform: translateY(-3px);
}
.stick-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  padding: 12px;
  border-radius: 12px;
  background: var(--accent);
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}
.stick-button:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.05);
}
.stick-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.form-feedback,
.form-error {
  font-size: 11px;
  margin: 12px 0 0;
  line-height: 1.8;
}
.form-feedback {
  color: var(--accent);
}
.form-error {
  color: #c65d69;
}
.local-notice {
  display: flex;
  align-items: start;
  gap: 7px;
  padding-top: 17px;
  margin-top: 18px;
  border-top: 1px dashed var(--line);
  font-size: 11px;
  color: var(--muted);
  line-height: 1.8;
}
.local-notice svg {
  color: var(--accent);
}
.local-notice p {
  margin: 0;
}

/* Note Board */
.note-board {
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: color-mix(in srgb, var(--card) 60%, transparent);
  overflow: hidden;
  box-shadow: 0 4px 20px #0000000a;
}
.board-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 24px;
  background: var(--card);
  border-bottom: 1px solid var(--line);
}
.board-toolbar > div {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.board-toolbar h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--on-surface, #201a1c);
}
.note-count {
  color: var(--muted);
  font-size: 11px;
  margin-left: 3px;
}
.sort-button {
  display: flex;
  gap: 5px;
  align-items: center;
  border: 0;
  color: var(--muted);
  background: transparent;
  font-size: 11px;
  cursor: pointer;
  padding: 5px 0 5px 8px;
  transition: color 0.15s;
}
.sort-button:hover {
  color: var(--accent);
}
.wall-canvas {
  min-height: 630px;
  padding: 37px 27px 22px;
  background-image: radial-gradient(#c9acb33d 0.9px, transparent 0.9px);
  background-size: 17px 17px;
}
:global(.dark) .wall-canvas {
  background-image: radial-gradient(#ffffff18 0.9px, transparent 0.9px);
}
.note-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px 21px;
  align-items: start;
}
.sticky-note {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 256px;
  padding: 23px 19px 18px;
  border-radius: 2px 3px 0 3px;
  background: var(--paper-bg);
  box-shadow:
    2px 5px 7px #513b4210,
    0 16px 14px -15px #513b4240;
  transform: rotate(var(--tilt, 0deg));
  transform-origin: 50% 15%;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
  scroll-margin-top: 105px;
}
.sticky-note:hover,
.sticky-note:focus-within {
  transform: rotate(0deg) translateY(-4px);
  box-shadow: 2px 10px 24px #513b4224;
  z-index: 2;
}
.sticky-note.just-posted {
  animation: stick-note 0.5s ease-out;
}
.note-hello {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--paper-muted);
  margin: 3px 0 17px;
  letter-spacing: 0.06em;
}
.note-hello > span {
  font-size: 16px;
  line-height: 1;
}
.message-main {
  flex: 1;
  min-width: 0;
}
.message-main > p {
  font-size: 13px;
  line-height: 2;
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.message-main h4 {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.8;
  margin: 0 0 13px;
}
.note-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 13px;
  margin-top: 24px;
  border-top: 1px dashed var(--paper-line);
  color: var(--paper-muted);
  font-size: 10px;
}
.note-author {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.note-author strong {
  font-size: 12px;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.note-avatar {
  width: 23px;
  height: 23px;
  display: grid;
  place-items: center;
  background: #ffffff40;
  border-radius: 50%;
  font-size: 11px;
  font-weight: bold;
  flex-shrink: 0;
}
.note-footer time {
  font-size: 10px;
}
.remove-note {
  position: absolute;
  right: 7px;
  top: 7px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  color: var(--paper-muted);
  background: transparent;
  cursor: pointer;
  opacity: 0.6;
  z-index: 2;
  transition: opacity 0.15s, background 0.15s;
}
.remove-note:hover {
  opacity: 1;
  background: #ffffff45;
}
.paper-fold {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 17px;
  height: 17px;
  background: linear-gradient(
    135deg,
    var(--paper-fold) 50%,
    color-mix(in srgb, var(--card) 70%, var(--bg)) 51%
  );
  border-radius: 3px 0 0 0;
}
.inspiration-note {
  margin-top: 19px;
  min-height: 275px;
}
.inspiration-flower {
  color: var(--paper-muted);
  font-size: 38px;
  opacity: 0.6;
  line-height: 1;
  margin: 0 0 16px;
  display: block;
}
.inspiration-note h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 10px;
}
.inspiration-note p {
  font-size: 12px;
  line-height: 2.2;
  margin: 0 0 17px;
}
.inspiration-sign {
  font-size: 10px;
  color: var(--paper-muted);
  margin-top: auto;
}
.empty-note {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-width: 0;
  min-height: 241px;
  padding: 20px 12px;
  background: transparent;
  border: 1px dashed #d9b5c1;
  border-radius: 6px;
  color: var(--muted);
  transform: rotate(-1deg);
  margin-top: 7px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.empty-note:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  transform: rotate(1deg);
}
.empty-plus {
  color: var(--accent);
  font-size: 28px;
  margin-bottom: 2px;
}
.empty-note strong {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}
.empty-arrow {
  position: absolute;
  bottom: 20px;
  left: 22px;
  font-size: 30px;
  color: #ce9ead;
  transform: rotate(-25deg);
  opacity: 0.7;
}
.board-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  padding: 40px 0 5px;
}
.board-bottom p {
  color: var(--muted);
  font-size: 11px;
  text-align: center;
  margin: 0;
}
.board-bottom > span {
  width: 22px;
  height: 1px;
  background: var(--line);
  flex-shrink: 0;
}
.wall-footnote {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 28px 0 0;
  color: var(--muted);
  font-size: 12px;
}

@keyframes stick-note {
  from {
    opacity: 0;
    transform: translateY(-15px) rotate(0deg) scale(1.04);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(var(--tilt)) scale(1);
  }
}

@media (max-width: 1190px) {
  .wall-layout {
    grid-template-columns: 270px minmax(0, 1fr);
    gap: 21px;
  }
  .composer {
    padding: 19px;
  }
  .note-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .compose-step {
    display: none;
  }
}
@media (max-width: 760px) {
  .wall-heading {
    margin-bottom: 23px;
    gap: 12px;
  }
  .wall-heading h2 {
    font-size: 26px;
  }
  .wall-stamp {
    display: none;
  }
  .wall-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .composer {
    position: static;
    padding: 20px;
  }
  .compose-step {
    display: inline;
  }
  .note-grid {
    gap: 28px 19px;
  }
  .wall-canvas {
    padding: 24px 18px;
    min-height: 400px;
  }
}
@media (max-width: 520px) {
  .note-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .sticky-note {
    min-height: 235px;
    padding: 25px 22px 20px;
  }
}
</style>
