<script lang="ts">
import Icon from "@iconify/svelte";
import MangaCard from "@components/molecules/MangaCard.svelte";
import type { MangaItem, MangaType, MangaStatus } from "../../data/manga";
import { MANGA_STATUS_META, MANGA_TYPE_META } from "@utils/manga-data";

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

let query = $state("");
let selectedType = $state<string>("");
let selectedStatus = $state<string>("");
let shownCount = $state(PAGE_SIZE);

const typeOptions = [
	{ value: "", label: "All Formats" },
	{ value: "manhwa", label: "Manhwa", icon: "material-symbols:menu-book-rounded" },
	{ value: "webtoon", label: "Webtoon", icon: "material-symbols:phone-android-outline-rounded" },
	{ value: "manga", label: "Manga", icon: "material-symbols:book-2-outline-rounded" },
	{ value: "manhua", label: "Manhua", icon: "material-symbols:import-contacts-rounded" },
];

const statusOptions = [
	{ value: "", label: "All Statuses" },
	{ value: "reading", label: "Reading", icon: "material-symbols:auto-stories-outline-rounded" },
	{ value: "completed", label: "Completed", icon: "material-symbols:check-circle-outline-rounded" },
	{ value: "planned", label: "Plan to Read", icon: "material-symbols:bookmark-outline-rounded" },
	{ value: "onHold", label: "On Hold", icon: "material-symbols:pause-circle-outline-rounded" },
	{ value: "dropped", label: "Dropped", icon: "material-symbols:cancel-outline-rounded" },
];

const filtered = $derived.by(() => {
	const q = query.trim().toLowerCase();
	return items.filter((item) => {
		if (selectedType && item.type !== selectedType) return false;
		if (selectedStatus && item.status !== selectedStatus) return false;
		if (!q) return true;
		return (
			item.title.toLowerCase().includes(q) ||
			(item.author && item.author.toLowerCase().includes(q)) ||
			(item.description && item.description.toLowerCase().includes(q)) ||
			(item.genres && item.genres.some((g) => g.toLowerCase().includes(q)))
		);
	});
});

const visibleItems = $derived(filtered.slice(0, shownCount));
const hasMore = $derived(filtered.length > shownCount);

function loadMore() {
	shownCount += PAGE_SIZE;
}
</script>

<div class="manga-section">
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

	<!-- Header -->
	<header class="section-header">
		<div class="header-content">
			<h1 class="section-title">{title}</h1>
			<p class="section-subtitle">{subtitle}</p>
		</div>
		<div class="counter-badge">
			<span class="count-number">{filtered.length}</span>
			<span class="count-label">{filtered.length === 1 ? "Title" : "Titles"}</span>
		</div>
	</header>

	<!-- Filter & Search Toolbar -->
	<div class="toolbar">
		<!-- Search Input -->
		<div class="search-box">
			<Icon icon="material-symbols:search-rounded" class="search-icon" width="20" height="20" />
			<input
				type="text"
				bind:value={query}
				placeholder="Search titles, authors, genres..."
				aria-label="Search manga and webtoons"
			/>
			{#if query}
				<button type="button" class="clear-btn" onclick={() => (query = "")} aria-label="Clear search">
					<Icon icon="material-symbols:close-rounded" width="16" height="16" />
				</button>
			{/if}
		</div>

		<!-- Format Filter Chips -->
		<div class="chips-row" role="group" aria-label="Format filter">
			{#each typeOptions as opt}
				<button
					type="button"
					class="filter-chip"
					class:active={selectedType === opt.value}
					onclick={() => (selectedType = opt.value)}
				>
					{#if opt.icon}
						<Icon icon={opt.icon} width="16" height="16" />
					{/if}
					<span>{opt.label}</span>
				</button>
			{/each}
		</div>

		<!-- Status Filter Chips -->
		<div class="chips-row" role="group" aria-label="Status filter">
			{#each statusOptions as opt}
				<button
					type="button"
					class="filter-chip"
					class:active={selectedStatus === opt.value}
					onclick={() => (selectedStatus = opt.value)}
				>
					{#if opt.icon}
						<Icon icon={opt.icon} width="16" height="16" />
					{/if}
					<span>{opt.label}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Cards Grid -->
	{#if visibleItems.length > 0}
		<div class="manga-grid">
			{#each visibleItems as item, idx (item.title)}
				<MangaCard {item} delay={idx * 40} />
			{/each}
		</div>

		{#if hasMore}
			<div class="load-more-container">
				<button type="button" class="load-more-btn" onclick={loadMore}>
					<span>Load more</span>
					<Icon icon="material-symbols:expand-more-rounded" width="20" height="20" />
				</button>
			</div>
		{/if}
	{:else}
		<div class="empty-state">
			<Icon icon="material-symbols:menu-book-outline-rounded" class="empty-icon" width="48" height="48" />
			<h3>No titles match your filters</h3>
			<p>Try clearing your search or switching categories.</p>
			{#if query || selectedType || selectedStatus}
				<button
					type="button"
					class="reset-btn"
					onclick={() => {
						query = "";
						selectedType = "";
						selectedStatus = "";
					}}
				>
					Reset filters
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
.manga-section {
	width: 100%;
	padding: var(--m3e-space-2, 8px) 0 var(--m3e-space-8, 32px);
}

.media-tabs {
	display: inline-flex;
	gap: 6px;
	padding: 4px;
	background: var(--surface-container-high);
	border-radius: 9999px;
	margin-bottom: var(--m3e-space-4, 16px);
}

.media-tab {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 6px 16px;
	font-size: 13px;
	font-weight: 600;
	color: var(--on-surface-variant);
	border-radius: 9999px;
	text-decoration: none;
	transition: all 200ms ease;
}

.media-tab:hover {
	color: var(--on-surface);
}

.media-tab.active {
	background: var(--card-bg, #ffffff);
	color: var(--primary);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16px;
	margin-bottom: var(--m3e-space-6, 24px);
}

.section-title {
	font-size: clamp(1.75rem, 3vw, 2.25rem);
	font-weight: 800;
	color: var(--on-surface);
	margin: 0 0 6px;
	line-height: 1.2;
}

.section-subtitle {
	font-size: 0.95rem;
	color: var(--on-surface-variant);
	margin: 0;
	line-height: 1.5;
}

.counter-badge {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 8px 16px;
	background: var(--surface-container-low, #ffffff);
	border: 1px solid var(--outline-variant);
	border-radius: 14px;
	min-width: 64px;
}

.count-number {
	font-size: 1.25rem;
	font-weight: 800;
	color: var(--primary);
	line-height: 1;
}

.count-label {
	font-size: 10px;
	font-weight: 600;
	color: var(--on-surface-variant);
	text-transform: uppercase;
	margin-top: 2px;
}

.toolbar {
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-bottom: var(--m3e-space-6, 24px);
}

.search-box {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
}

.search-box input {
	width: 100%;
	height: 44px;
	padding: 0 40px 0 42px;
	background: var(--surface-container-low, #ffffff);
	border: 1px solid var(--outline-variant);
	border-radius: 12px;
	font-size: 14px;
	color: var(--on-surface);
	outline: none;
	transition: border-color 200ms ease, box-shadow 200ms ease;
}

.search-box input:focus {
	border-color: var(--primary);
	box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent);
}

.search-icon {
	position: absolute;
	left: 14px;
	color: var(--on-surface-variant);
	pointer-events: none;
}

.clear-btn {
	position: absolute;
	right: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background: var(--surface-container-highest);
	color: var(--on-surface-variant);
	border: none;
	cursor: pointer;
}

.chips-row {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
}

.filter-chip {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 6px 14px;
	font-size: 12px;
	font-weight: 600;
	color: var(--on-surface-variant);
	background: var(--surface-container-low, #ffffff);
	border: 1px solid var(--outline-variant);
	border-radius: 9999px;
	cursor: pointer;
	transition: all 150ms ease;
}

.filter-chip:hover {
	border-color: var(--primary);
	color: var(--on-surface);
}

.filter-chip.active {
	background: var(--primary);
	color: #ffffff;
	border-color: var(--primary);
	box-shadow: 0 2px 8px color-mix(in srgb, var(--primary) 30%, transparent);
}

.manga-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	gap: 20px;
}

@media (min-width: 640px) {
	.manga-grid {
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 24px;
	}
}

.load-more-container {
	display: flex;
	justify-content: center;
	margin-top: 36px;
}

.load-more-btn {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 10px 24px;
	background: var(--surface-container-low, #ffffff);
	color: var(--primary);
	border: 1px solid var(--outline-variant);
	border-radius: 9999px;
	font-size: 13px;
	font-weight: 700;
	cursor: pointer;
	transition: all 200ms ease;
}

.load-more-btn:hover {
	background: var(--primary);
	color: #ffffff;
	border-color: var(--primary);
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60px 20px;
	text-align: center;
	background: var(--surface-container-low, #ffffff);
	border: 1px dashed var(--outline-variant);
	border-radius: 16px;
}

.empty-icon {
	color: var(--on-surface-variant);
	opacity: 0.4;
	margin-bottom: 12px;
}

.reset-btn {
	margin-top: 14px;
	padding: 8px 18px;
	background: var(--primary);
	color: #ffffff;
	border: none;
	border-radius: 9999px;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
}
</style>
