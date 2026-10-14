<script lang="ts">
/**
 * 漫画/条漫/Webtoon 卡片（分子）：2:3 封面 + 格式角标 + 状态 tonal pill + 评分 + 进度 pill。
 * 视觉结构与 AnimeCard 完全对齐，支持 Grid 与 List 双布局。
 */
import Icon from "@iconify/svelte";
import {
	MANGA_STATUS_META,
	MANGA_TYPE_META,
	resolveMangaType,
} from "@utils/manga-data";
import { reveal } from "@utils/motion";
import { url } from "@utils/url-utils";
import type { MangaItem } from "../../data/manga";

let {
	item,
	delay = 0,
}: { item: MangaItem; delay?: number } = $props();

const effectiveType = $derived(resolveMangaType(item));
const statusMeta = $derived(
	MANGA_STATUS_META[item.status] || MANGA_STATUS_META.reading,
);
const typeMeta = $derived(
	MANGA_TYPE_META[effectiveType] || MANGA_TYPE_META.manhwa,
);
const metaLine = $derived(
	[item.year, item.author].filter(Boolean).join(" · "),
);

let currentCover = $state(item.cover);
let imgFailed = $state(false);

function handleImageError() {
	if (item.backupCover && currentCover !== item.backupCover) {
		currentCover = item.backupCover;
	} else {
		imgFailed = true;
	}
}
</script>

<article
	class="manga-card"
	data-status={item.status}
	data-type={effectiveType}
	style={`--manga-status-color: ${statusMeta.color};`}
	use:reveal={{ delay }}
>
	<!-- 封面内容 -->
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

		<!-- Type / Country badge on top-left of cover -->
		<span class="manga-card__type-badge" style={`background-color: ${typeMeta.color};`}>
			{typeMeta.badge}
		</span>

		<!-- Rating badge on top-right of cover -->
		<span class="manga-card__rating">
			<Icon icon="material-symbols:star-rounded" aria-hidden="true" />
			<span>{item.rating}</span>
		</span>

		{#if item.link}
			<!-- External link hover indicator -->
			<span class="manga-card__link-icon" aria-hidden="true">
				<Icon icon="material-symbols:open-in-new-rounded" />
			</span>
		{/if}
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
				<span class="manga-card__progress-pill">{item.progress}</span>
			{/if}
		</div>

		<span class="manga-card__title" title={item.title}>{item.title}</span>

		{#if item.description}
			<p class="manga-card__desc">{item.description}</p>
		{/if}

		{#if metaLine}
			<p class="manga-card__meta">{metaLine}</p>
		{/if}

		{#if item.genres && item.genres.length > 0}
			<div class="manga-card__genres">
				{#each item.genres as genre (genre)}
					<span class="manga-card__genre">#{genre}</span>
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
	box-sizing: border-box
	overflow: hidden
	border-radius: var(--shape-corner-l)
	background: var(--card-bg)
	border: 1px solid var(--outline-variant)
	transition:
		border-color var(--m3e-duration-medium) var(--m3e-easing-emphasized-decelerate),
		box-shadow var(--m3e-duration-medium) var(--m3e-easing-emphasized-decelerate),
		transform var(--m3e-duration-medium) var(--m3e-easing-emphasized-decelerate)
	&:hover
		border-color: var(--outline)
		box-shadow: var(--m3e-elevation-2)
		transform: translateY(-2px)

	/* 2:3 海报封面 */
	&__cover
		position: relative
		display: block
		aspect-ratio: 2 / 3
		overflow: hidden
		background: linear-gradient(160deg,
			unquote("color-mix(in oklab, var(--primary) 16%, var(--surface-container-low))"),
			var(--surface-container-high))
		text-decoration: none

	&__cover-img
		display: block
		width: 100%
		height: 100%
		object-fit: cover
		transition: transform var(--m3e-duration-long) var(--m3e-easing-emphasized-decelerate)
		.manga-card:hover &
			transform: scale(1.05)

	&__scrim
		position: absolute
		inset: 0
		pointer-events: none
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, transparent 40%, rgba(0, 0, 0, 0.25) 100%)
		opacity: 0.6
		transition: opacity var(--m3e-duration-medium) var(--m3e-easing-standard)
		.manga-card:hover &
			opacity: 0.8

	&__type-badge
		position: absolute
		top: 0.5rem
		left: 0.5rem
		z-index: 2
		display: inline-flex
		align-items: center
		padding: 0.125rem 0.4375rem
		border-radius: var(--shape-corner-full)
		color: #ffffff
		font: var(--m3e-type-label-small)
		font-weight: 700
		letter-spacing: 0.04em
		box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.3)

	&__rating
		position: absolute
		top: 0.5rem
		right: 0.5rem
		z-index: 2
		display: inline-flex
		align-items: center
		gap: 0.1875rem
		padding: 0.1875rem 0.5rem
		border-radius: var(--shape-corner-full)
		background: unquote("color-mix(in srgb, #000 60%, transparent)")
		backdrop-filter: blur(0.375rem)
		-webkit-backdrop-filter: blur(0.375rem)
		color: #fff
		font: var(--m3e-type-label-small)
		font-weight: 700
		font-variant-numeric: tabular-nums
		border: 1px solid rgba(255, 255, 255, 0.15)
		> :global(svg)
			width: 0.875rem
			height: 0.875rem
			color: #facc15

	&__link-icon
		position: absolute
		inset: 0
		display: flex
		align-items: center
		justify-content: center
		background: unquote("color-mix(in srgb, #000 40%, transparent)")
		opacity: 0
		transition:
			opacity var(--m3e-duration-medium) var(--m3e-easing-emphasized-decelerate),
			transform var(--m3e-duration-medium) var(--m3e-easing-emphasized-decelerate)
		transform: scale(0.9)
		> :global(svg)
			width: 2.75rem
			height: 2.75rem
			color: #fff
			filter: drop-shadow(0 0.125rem 0.375rem rgba(0, 0, 0, 0.5))
		.manga-card:hover &
			opacity: 1
			transform: scale(1)

	&__placeholder
		position: absolute
		inset: 0
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		gap: 0.5rem
		padding: 1rem
		text-align: center
		color: unquote("color-mix(in oklab, var(--on-surface-variant) 60%, transparent)")
		> :global(svg)
			width: 2.5rem
			height: 2.5rem
			opacity: 0.7

	&__placeholder-text
		font: var(--m3e-type-label-small)
		font-weight: 600
		color: var(--on-surface-variant)
		opacity: 0.8
		display: -webkit-box
		-webkit-line-clamp: 2
		-webkit-box-orient: vertical
		overflow: hidden

	&__body
		display: flex
		flex-direction: column
		flex: 1
		min-width: 0
		gap: var(--m3e-space-1)
		padding: var(--m3e-space-3) var(--m3e-space-4) var(--m3e-space-4)

	&__header-row
		display: flex
		align-items: center
		justify-content: space-between
		gap: 0.5rem

	&__status
		display: inline-flex
		align-items: center
		align-self: flex-start
		gap: 0.3125rem
		padding: 0.125rem 0.5rem
		border-radius: var(--shape-corner-full)
		background: unquote("color-mix(in oklab, var(--manga-status-color) 12%, transparent)")
		color: var(--manga-status-color)
		font: var(--m3e-type-label-small)
		font-weight: 600

	&__status-dot
		width: 0.375rem
		height: 0.375rem
		border-radius: var(--shape-corner-full)
		background: currentColor

	&__progress-pill
		display: inline-flex
		align-items: center
		padding: 0.125rem 0.5rem
		border-radius: var(--shape-corner-full)
		background: var(--surface-container-high)
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-small)
		font-weight: 600
		font-variant-numeric: tabular-nums

	&__title
		margin: 0
		color: var(--on-surface)
		font: var(--m3e-type-title-small)
		font-weight: 600
		line-height: 1.3
		display: -webkit-box
		-webkit-line-clamp: 2
		-webkit-box-orient: vertical
		overflow: hidden
		transition: color var(--m3e-duration-short) var(--m3e-easing-standard)
		.manga-card:hover &
			color: var(--primary)

	&__desc
		margin: 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)
		line-height: 1.4
		display: -webkit-box
		-webkit-line-clamp: 2
		-webkit-box-orient: vertical
		overflow: hidden

	&__meta
		margin: auto 0 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)
		white-space: nowrap
		overflow: hidden
		text-overflow: ellipsis

	&__genres
		display: flex
		flex-wrap: wrap
		gap: 0.25rem 0.375rem

	&__genre
		color: var(--on-surface-variant)
		font: var(--m3e-type-label-small)
		transition: color var(--m3e-duration-short) var(--m3e-easing-standard)
		&:hover
			color: var(--primary)

:global(html.motion-reduced) .manga-card,
:global(html.motion-reduced) .manga-card__cover-img,
:global(html.motion-reduced) .manga-card__link-icon
	transition: none
	transform: none

@media (prefers-reduced-motion: reduce)
	.manga-card,
	.manga-card__cover-img,
	.manga-card__link-icon
		transition: none
		transform: none
</style>
