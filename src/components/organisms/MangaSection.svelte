<script lang="ts">
/**
 * 漫画/条漫/Webtoon 列表主体（有机体）：页头 + 格式与状态筛选 chips + 实时搜索 + 双布局（grid/list）+ 加载更多。
 * 完全复刻 AnimeSection 的 M3E 设计语言与交互规范，保证整站视觉体验高度一致。
 */
import Button from "@components/atoms/action/Button.svelte";
import Chips from "@components/atoms/action/Chips.svelte";
import Card from "@components/atoms/display/Card.svelte";
import LoadingIndicator from "@components/atoms/feedback/LoadingIndicator.svelte";
import TextField from "@components/atoms/input/TextField.svelte";
import MangaCard from "@components/molecules/MangaCard.svelte";
import PageHeader from "@components/molecules/PageHeader.svelte";
import Icon from "@iconify/svelte";
import {
	MANGA_STATUS_META,
	MANGA_TYPE_META,
	resolveMangaType,
} from "@utils/manga-data";
import { flipFromRect } from "@utils/motion";
import { onMount } from "svelte";
import type { MangaItem } from "../../data/manga";

export type MangaLayoutMode = "grid" | "list";

let {
	items = [] as MangaItem[],
	title = "Manga & Webtoons",
	subtitle = "Stories, manhwa, and webtoons that keep me turning pages.",
}: {
	items?: MangaItem[];
	title?: string;
	subtitle?: string;
} = $props();

const PAGE_SIZE = 12;
const MANGA_LAYOUT_KEY = "shirone:manga-layout-mode";

let query = $state("");
let selectedType = $state("");
let selectedStatus = $state("");
let shownCount = $state(PAGE_SIZE);
let initialized = false;

type FilterPhase = "idle" | "loading" | "out";
let phase = $state<FilterPhase>("idle");
let phaseTimers: ReturnType<typeof setTimeout>[] = [];

let listMode = $state<MangaLayoutMode>("grid");
let listEl = $state<HTMLElement | null>(null);

const LIST_MODE_CLASS: Record<MangaLayoutMode, string> = {
	grid: "manga-list--grid",
	list: "manga-list--list",
};

/** 格式 / 产地筛选 Chips */
const formatOptions = [
	{ value: "manhwa", label: "Manhwa (만话)", leadingIcon: "material-symbols:menu-book-rounded" },
	{ value: "webtoon", label: "Webtoon (웹툰)", leadingIcon: "material-symbols:phone-android-outline-rounded" },
	{ value: "manga", label: "Manga (漫画)", leadingIcon: "material-symbols:book-2-outline-rounded" },
	{ value: "manhua", label: "Manhua (漫画)", leadingIcon: "material-symbols:import-contacts-rounded" },
];

/** 状态筛选 Chips：只列当前数据中出现的状态 */
const statusItems = $derived(
	Array.from(new Set(items.map((item) => item.status))).map((status) => ({
		value: status,
		label: MANGA_STATUS_META[status]?.label || status,
		leadingIcon: MANGA_STATUS_META[status]?.icon,
	})),
);

const filtered = $derived.by(() => {
	const normalizedQuery = query.trim().toLowerCase();
	return items.filter((item) => {
		const effectiveType = resolveMangaType(item);

		// Format/Country segregation:
		if (selectedType) {
			if (selectedType === "manhwa") {
				// Segregate Korean manhwa by country OR type
				const isKorean = item.country?.toUpperCase() === "KR" || item.type === "manhwa";
				if (!isKorean) return false;
			} else if (selectedType === "manga") {
				// Segregate Japanese manga by country OR type
				const isJapanese = item.country?.toUpperCase() === "JP" || (item.type === "manga" && item.country !== "KR");
				if (!isJapanese) return false;
			} else if (selectedType === "manhua") {
				const isChinese = item.country?.toUpperCase() === "CN" || item.country?.toUpperCase() === "TW" || item.type === "manhua";
				if (!isChinese) return false;
			} else if (effectiveType !== selectedType) {
				return false;
			}
		}

		if (selectedStatus && item.status !== selectedStatus) return false;

		if (!normalizedQuery) return true;
		return [
			item.title,
			item.description ?? "",
			item.author ?? "",
			item.year ?? "",
			...(item.genres || []),
		].some((val) => val.toLowerCase().includes(normalizedQuery));
	});
});

const visibleItems = $derived(filtered.slice(0, shownCount));
const hasMore = $derived(filtered.length > shownCount);

function countLabel(count: number) {
	return `${count} ${count === 1 ? "title" : "titles"}`;
}

function onFilterChange() {
	phaseTimers.forEach(clearTimeout);
	phase = "loading";
	phaseTimers = [
		setTimeout(() => (phase = "out"), 200),
		setTimeout(() => (phase = "idle"), 200 + 100),
	];
}

function readStoredLayoutMode(): MangaLayoutMode {
	try {
		const stored = localStorage.getItem(MANGA_LAYOUT_KEY);
		if (stored === "list" || stored === "grid") return stored;
	} catch {
		/* Ignore local storage access failure */
	}
	return "grid";
}

function switchLayoutMode(mode: MangaLayoutMode) {
	if (mode === listMode) return;
	const cards = Array.from(
		listEl?.querySelectorAll<HTMLElement>(".manga-card") ?? [],
	);
	const before = cards.map((card) => card.getBoundingClientRect());
	listMode = mode;
	try {
		localStorage.setItem(MANGA_LAYOUT_KEY, mode);
	} catch {
		/* Ignore local storage access failure */
	}
	requestAnimationFrame(() => {
		cards.forEach((card, index) => flipFromRect(card, before[index], 400));
	});
}

// 筛选/搜索变化时重置分页
$effect(() => {
	const t = selectedType;
	const s = selectedStatus;
	const q = query;
	if (!initialized) return;
	shownCount = PAGE_SIZE;
});

// URL 参数同步（?type= / ?status= / ?q=）
$effect(() => {
	const t = selectedType;
	const s = selectedStatus;
	const q = query;
	if (!initialized) return;
	const params = new URLSearchParams(window.location.search);
	params.delete("type");
	params.delete("status");
	params.delete("q");
	if (t) params.set("type", t);
	if (s) params.set("status", s);
	if (q.trim()) params.set("q", q.trim());
	const qs = params.toString();
	history.replaceState(
		history.state,
		"",
		qs ? `?${qs}` : window.location.pathname,
	);
});

onMount(() => {
	const params = new URLSearchParams(window.location.search);
	selectedType = params.get("type") || "";
	selectedStatus = params.get("status") || "";
	query = params.get("q") || "";
	listMode = readStoredLayoutMode();
	initialized = true;
	return () => {
		phaseTimers.forEach(clearTimeout);
	};
});
</script>

<Card color="var(--card-bg)" radius="l" class="manga-section px-8 py-6">
	<!-- Top Switcher Bar (Anime <-> Manga) -->
	<nav class="media-tabs" aria-label="Media category selection">
		<a href="/anime/" class="media-tab">
			<Icon icon="material-symbols:live-tv-outline-rounded" width="18" height="18" />
			<span>Anime</span>
		</a>
		<a href="/manga/" class="media-tab active" aria-current="page">
			<Icon icon="material-symbols:auto-stories-outline-rounded" width="18" height="18" />
			<span>Manga & Webtoons</span>
		</a>
	</nav>

	<PageHeader
		icon="material-symbols:auto-stories-outline-rounded"
		{title}
		{subtitle}
	/>

	{#if items.length > 0}
		<div class="manga-section__tools">
			<!-- Search Row + Grid/List Switcher -->
			<div class="manga-section__search-row">
				<div class="manga-section__search">
					<TextField
						type="search"
						bind:value={query}
						placeholder="Search titles, authors, genres..."
						label="Search"
						hideLabel
						variant="outlined"
						class="!rounded-(--shape-corner-l)"
					>
						<Icon slot="leading" icon="material-symbols:search-rounded" aria-hidden="true" />
					</TextField>
					{#if query}
						<button
							type="button"
							class="manga-section__search-clear"
							aria-label="Clear search"
							onclick={() => (query = "")}
						>
							<Icon icon="material-symbols:close-rounded" aria-hidden="true" />
						</button>
					{/if}
				</div>

				<div class="manga-section__layout-switch" role="group" aria-label="Layout mode">
					<button
						type="button"
						class="manga-section__layout-btn"
						class:manga-section__layout-btn--active={listMode === "grid"}
						aria-label="Grid layout"
						title="Grid layout"
						aria-pressed={listMode === "grid"}
						onclick={() => switchLayoutMode("grid")}
					>
						<Icon icon="material-symbols:grid-view-rounded" aria-hidden="true" />
					</button>
					<button
						type="button"
						class="manga-section__layout-btn"
						class:manga-section__layout-btn--active={listMode === "list"}
						aria-label="List layout"
						title="List layout"
						aria-pressed={listMode === "list"}
						onclick={() => switchLayoutMode("list")}
					>
						<Icon icon="material-symbols:view-list-rounded" aria-hidden="true" />
					</button>
				</div>
			</div>

			<!-- Format & Country Filter Chips Row -->
			<div class="manga-section__filter-row">
				<div class="manga-section__chips">
					<Chips
						items={formatOptions}
						variant="filter"
						bind:value={selectedType}
						onchange={onFilterChange}
					/>
				</div>
			</div>

			<!-- Reading Status Filter Chips Row -->
			<div class="manga-section__filter-row">
				{#if statusItems.length > 0}
					<div class="manga-section__chips">
						<Chips
							items={statusItems}
							variant="filter"
							bind:value={selectedStatus}
							onchange={onFilterChange}
						/>
					</div>
				{/if}

				{#if filtered.length > 0}
					<p class="manga-section__count" aria-live="polite">{countLabel(filtered.length)}</p>
				{/if}
			</div>
		</div>
	{/if}

	{#if phase !== "idle"}
		<div
			class="manga-section__loading"
			class:manga-section__loading--out={phase === "out"}
		>
			<LoadingIndicator size="l" variant="contained" />
		</div>
	{/if}

	<!-- Manga Cards List / Grid -->
	{#if visibleItems.length > 0}
		{#key `${selectedType}-${selectedStatus}-${query}-${listMode}`}
			<div
				bind:this={listEl}
				class={`manga-section__list ${LIST_MODE_CLASS[listMode]}`}
				style:display={phase === "idle" ? undefined : "none"}
			>
				{#each visibleItems as item, index (item.title)}
					<MangaCard
						{item}
						delay={index * 35}
					/>
				{/each}
			</div>
		{/key}

		{#if hasMore}
			<div class="manga-section__more">
				<Button
					variant="outlined"
					icon="material-symbols:expand-more-rounded"
					label="Load more"
					onclick={() => (shownCount += PAGE_SIZE)}
				/>
			</div>
		{/if}
	{:else}
		<div class="manga-section__empty">
			{#if items.length === 0}
				<Icon icon="material-symbols:book-2-outline-rounded" aria-hidden="true" />
				<span>No titles available</span>
			{:else}
				<Icon icon="material-symbols:search-off-outline-rounded" aria-hidden="true" />
				<span>No manga or webtoons match your filter</span>
			{/if}
		</div>
	{/if}
</Card>

<style lang="stylus">
@import "../../styles/breakpoints.styl"

.media-tabs
	display: inline-flex
	gap: 6px
	padding: 4px
	background: var(--surface-container-high)
	border-radius: 9999px
	margin-bottom: 1rem

.media-tab
	display: inline-flex
	align-items: center
	gap: 6px
	padding: 6px 16px
	font-size: 13px
	font-weight: 600
	color: var(--on-surface-variant)
	border-radius: 9999px
	text-decoration: none
	transition: all 200ms ease

	&:hover
		color: var(--on-surface)

	&.active
		background: var(--card-bg, #ffffff)
		color: var(--primary)
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)

.manga-section
	display: block

	@media (max-width: bp-sm - 1px)
		padding: 1rem 0.75rem

		.manga-list--grid, .manga-list--list
			padding-top: 1rem
			gap: 0.625rem

	&__tools
		display: flex
		flex-direction: column
		gap: 0.75rem
		padding-bottom: 1.25rem
		border-bottom: 1px solid var(--outline-variant)

	&__search-row
		display: flex
		align-items: center
		gap: 0.625rem
		width: 100%

	&__search
		position: relative
		flex: 1
		min-width: 0
		max-width: 32rem

		:global(.m3-text-field)
			width: 100%

	&__search-clear
		position: absolute
		right: 0.5rem
		top: 50%
		transform: translateY(-50%)
		display: inline-flex
		flex-shrink: 0
		align-items: center
		justify-content: center
		width: 1.75rem
		height: 1.75rem
		padding: 0.25rem
		border: none
		background: none
		color: var(--on-surface-variant)
		cursor: pointer
		border-radius: var(--shape-corner-full)
		> :global(svg)
			width: 1.25rem
			height: 1.25rem
		&:hover
			background: unquote("color-mix(in oklab, var(--on-surface-variant) 8%, transparent)")

	&__filter-row
		display: flex
		flex-wrap: wrap
		align-items: center
		justify-content: space-between
		gap: 0.75rem
		width: 100%

	&__chips
		flex: 1
		min-width: 0
		overflow-x: auto
		scrollbar-width: none
		&::-webkit-scrollbar
			display: none

	&__count
		margin: 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)
		white-space: nowrap

	&__layout-switch
		display: inline-flex
		flex-shrink: 0
		align-items: center
		padding: 0.125rem
		border-radius: var(--shape-corner-m)
		background: var(--surface-container-high)
		border: 1px solid var(--outline-variant)

	&__layout-btn
		display: inline-flex
		align-items: center
		justify-content: center
		width: 2.125rem
		height: 2.125rem
		border: none
		border-radius: var(--shape-corner-s)
		background: transparent
		color: var(--on-surface-variant)
		cursor: pointer
		transition:
			background-color var(--m3e-duration-short) var(--m3e-easing-standard),
			color var(--m3e-duration-short) var(--m3e-easing-standard)
		> :global(svg)
			width: 1.25rem
			height: 1.25rem

		&:hover
			color: var(--on-surface)
			background: unquote("color-mix(in oklab, var(--on-surface) 8%, transparent)")

		&--active
			background: var(--primary-container)
			color: var(--on-primary-container)
			&:hover
				background: var(--primary-container)
				color: var(--on-primary-container)

	&__loading
		display: flex
		align-items: center
		justify-content: center
		min-height: 11rem
		padding-top: 1.5rem

		&--out
			animation: manga-loading-out var(--m3e-duration-short) var(--m3e-easing-emphasized-accelerate) both

	&__more
		display: flex
		justify-content: center
		margin-top: 1.5rem

	&__empty
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		gap: 0.875rem
		min-height: 12rem
		padding-top: 1.5rem
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-large)
		> :global(svg)
			width: 2.75rem
			height: 2.75rem
			color: var(--outline)

/* 海报网格（grid）：手机 2 列、平板 3 列、电脑端 4 列 */
.manga-list--grid
	display: grid
	grid-template-columns: repeat(2, 1fr)
	gap: 0.875rem
	padding-top: 1.25rem

	@media (min-width: 32rem)
		grid-template-columns: repeat(3, 1fr)
		gap: 0.875rem

	@media (min-width: bp-md)
		grid-template-columns: repeat(4, 1fr)
		gap: 1rem

/* 横向列表（list） */
.manga-list--list
	display: grid
	grid-template-columns: 1fr
	gap: 1rem
	padding-top: 1.25rem

	@media (min-width: 88rem)
		grid-template-columns: repeat(2, 1fr)

	:global(.manga-card)
		flex-direction: row

	:global(.manga-card__cover)
		width: 8.5rem
		flex-shrink: 0

		@media (min-width: 48rem)
			width: 11rem

	:global(.manga-card__body)
		flex: 1
		min-width: 0
		padding: 1.125rem 1.25rem
		justify-content: space-between

	:global(.manga-card__desc)
		-webkit-line-clamp: 3

@keyframes manga-loading-out
	from
		opacity: 1
		transform: none
	to
		opacity: 0
		transform: scale(0.96)
</style>
