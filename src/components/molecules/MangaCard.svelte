<script lang="ts">
import Icon from "@iconify/svelte";
import { MANGA_STATUS_META, MANGA_TYPE_META } from "@utils/manga-data";
import { reveal } from "@utils/motion";
import { url } from "@utils/url-utils";
import type { MangaItem } from "../../data/manga";

let {
	item,
	delay = 0,
}: { item: MangaItem; delay?: number } = $props();

let currentCover = $state(item.cover);
let imgFailed = $state(false);

function handleImageError() {
	if (item.backupCover && currentCover !== item.backupCover) {
		currentCover = item.backupCover;
	} else {
		imgFailed = true;
	}
}

const statusMeta = $derived(
	MANGA_STATUS_META[item.status] || MANGA_STATUS_META.reading,
);
const typeMeta = $derived(
	MANGA_TYPE_META[item.type] || MANGA_TYPE_META.manhwa,
);
const metaLine = $derived(
	[item.year, item.author].filter(Boolean).join(" · "),
);
</script>

<article
	class="manga-card"
	data-status={item.status}
	data-type={item.type}
	style={`--manga-status-color: ${statusMeta.color};`}
	use:reveal={{ delay }}
>
	{#snippet coverContent()}
		{#if currentCover && !imgFailed}
			<img
				class="manga-card__cover-img"
				src={url(currentCover)}
				alt={item.title}
				loading="lazy"
				referrerpolicy="no-referrer"
				onerror={handleImageError}
			/>
		{:else}
			<div class="manga-card__placeholder" aria-hidden="true">
				<Icon icon={typeMeta.icon} />
				<span class="manga-card__placeholder-text">{item.title}</span>
			</div>
		{/if}
		<span class="manga-card__scrim" aria-hidden="true"></span>
		
		<!-- Type badge on top-left of cover -->
		<span class="manga-card__type-badge" style={`background-color: ${typeMeta.color};`}>
			{typeMeta.badge}
		</span>

		{#if item.link}
			<span class="manga-card__read" aria-hidden="true">
				<Icon icon="material-symbols:open-in-new-rounded" />
			</span>
		{/if}
		<span class="manga-card__rating">
			<Icon icon="material-symbols:star-rounded" aria-hidden="true" />
			<span>{item.rating}</span>
		</span>
	{/snippet}

	{#if item.link}
		<a
			class="manga-card__cover"
			href={item.link}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={item.title}
		>
			{@render coverContent()}
		</a>
	{:else}
		<div class="manga-card__cover">
			{@render coverContent()}
		</div>
	{/if}

	<div class="manga-card__body">
		<div class="manga-card__header-row">
			<span class="manga-card__status">
				<span class="manga-card__status-dot" aria-hidden="true"></span>
				{statusMeta.label}
			</span>
			{#if item.progress}
				<span class="manga-card__progress-pill">
					{item.progress}
				</span>
			{/if}
		</div>

		<span class="manga-card__title" title={item.title}>{item.title}</span>

		{#if metaLine}
			<span class="manga-card__meta" title={metaLine}>{metaLine}</span>
		{/if}

		{#if item.description}
			<p class="manga-card__desc" title={item.description}>
				{item.description}
			</p>
		{/if}

		{#if item.genres && item.genres.length > 0}
			<div class="manga-card__genres" aria-label="Genres">
				{#each item.genres.slice(0, 3) as genre}
					<span class="manga-card__genre-pill">{genre}</span>
				{/each}
			</div>
		{/if}
	</div>
</article>

<style lang="stylus">
.manga-card
	position: relative
	display: flex
	flex-direction: column
	background: var(--card-bg, var(--surface-container-low, #ffffff))
	border: 1px solid var(--outline-variant)
	border-radius: var(--m3e-shape-corner-medium, 16px)
	overflow: hidden
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04)
	transition: transform var(--m3e-duration-long, 400ms) var(--m3e-easing-emphasized-decelerate),
	            box-shadow var(--m3e-duration-long, 400ms) var(--m3e-easing-emphasized-decelerate)

	&:hover
		transform: translateY(-4px)
		box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08)

	&__cover
		position: relative
		display: block
		width: 100%
		aspect-ratio: 2 / 3
		background: var(--surface-container-high)
		overflow: hidden

	&__cover-img
		width: 100%
		height: 100%
		object-fit: cover
		transition: transform var(--m3e-duration-long, 400ms) var(--m3e-easing-emphasized-decelerate)

	&:hover &__cover-img
		transform: scale(1.05)

	&__placeholder
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		gap: 0.5rem
		padding: 1rem
		text-align: center
		width: 100%
		height: 100%
		font-size: 2.5rem
		color: var(--on-surface-variant)
		opacity: 0.6

	&__placeholder-text
		font-size: 0.75rem
		font-weight: 600
		line-height: 1.3
		color: var(--on-surface-variant)
		display: -webkit-box
		-webkit-line-clamp: 2
		-webkit-box-orient: vertical
		overflow: hidden

	&__scrim
		position: absolute
		inset: 0
		background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)
		pointer-events: none

	&__type-badge
		position: absolute
		top: 10px
		left: 10px
		z-index: 2
		padding: 2px 8px
		font-size: 10px
		font-weight: 700
		letter-spacing: 0.05em
		color: #ffffff
		border-radius: 9999px
		box-shadow: 0 2px 6px rgba(0,0,0,0.2)
		text-transform: uppercase

	&__rating
		position: absolute
		bottom: 10px
		right: 10px
		z-index: 2
		display: flex
		align-items: center
		gap: 3px
		padding: 3px 8px
		font-size: 11px
		font-weight: 700
		color: #ffffff
		background: rgba(0, 0, 0, 0.6)
		backdrop-filter: blur(6px)
		border-radius: 9999px

		> :global(svg)
			color: #fbbf24

	&__read
		position: absolute
		inset: 0
		display: flex
		align-items: center
		justify-content: center
		font-size: 2rem
		color: #ffffff
		background: rgba(0, 0, 0, 0.4)
		backdrop-filter: blur(2px)
		opacity: 0
		transition: opacity 200ms ease

	&:hover &__read
		opacity: 1

	&__body
		display: flex
		flex-direction: column
		flex-grow: 1
		padding: var(--m3e-space-3, 12px) var(--m3e-space-4, 16px) var(--m3e-space-4, 16px)

	&__header-row
		display: flex
		align-items: center
		justify-content: space-between
		gap: 6px
		margin-bottom: 6px

	&__status
		display: inline-flex
		align-items: center
		gap: 5px
		font-size: 11px
		font-weight: 600
		color: var(--manga-status-color, var(--primary))

	&__status-dot
		width: 6px
		height: 6px
		border-radius: 50%
		background: currentColor

	&__progress-pill
		font-size: 10px
		font-weight: 600
		color: var(--on-surface-variant)
		background: var(--surface-container-highest)
		padding: 2px 6px
		border-radius: 4px

	&__title
		font-size: 1rem
		font-weight: 700
		color: var(--on-surface)
		line-height: 1.3
		margin-bottom: 4px
		display: -webkit-box
		-webkit-line-clamp: 2
		-webkit-box-orient: vertical
		overflow: hidden

	&__meta
		font-size: 11px
		color: var(--on-surface-variant)
		margin-bottom: 6px
		white-space: nowrap
		overflow: hidden
		text-overflow: ellipsis

	&__desc
		font-size: 12px
		color: var(--on-surface-variant)
		line-height: 1.45
		margin: 0 0 10px
		display: -webkit-box
		-webkit-line-clamp: 2
		-webkit-box-orient: vertical
		overflow: hidden
		opacity: 0.85

	&__genres
		display: flex
		flex-wrap: wrap
		gap: 4px
		margin-top: auto

	&__genre-pill
		font-size: 10px
		padding: 2px 7px
		color: var(--on-surface-variant)
		background: var(--surface-container-highest)
		border-radius: 4px
</style>
