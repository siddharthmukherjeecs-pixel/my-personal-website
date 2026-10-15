<script lang="ts">
/**
 * 月度文章历交互视图（Calendar.astro 的水合岛）。
 * 单月视图 + 切月 + 点击有文日展开当日文章；月/周名称由 Intl
 * 按站点 locale 生成（本地化数据不占 i18n key）。
 * 动效：切月网格 reveal 淡入、文章列表 collapse 展开（motion.ts
 * 原语，reduced-motion 自动瞬切）。
 */
import IconButton from "@components/atoms/action/IconButton.svelte";
import type { CalendarPost } from "@utils/calendar-data";
import { collapse, reveal } from "@utils/motion";

interface Props {
	/** BCP47 locale（由 siteConfig.lang 换算，Intl 用） */
	locale: string;
	startOfWeek: "mon" | "sun";
	/** dateKey（YYYY-MM-DD）→ 当日文章 */
	postsByDate: Record<string, CalendarPost[]>;
	/** 有文章月份列表（升序 YYYY-MM），跳月导航用 */
	activeMonths: string[];
	backTodayLabel: string;
	prevMonthLabel: string;
	nextMonthLabel: string;
}

let {
	locale,
	startOfWeek = "mon",
	postsByDate,
	activeMonths = [],
	backTodayLabel,
	prevMonthLabel,
	nextMonthLabel,
}: Props = $props();

const today = new Date();
let year = $state(today.getFullYear());
let month = $state(today.getMonth());
let selectedDate = $state<string | null>(null);

const monthTitle = $derived(
	new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }).format(
		new Date(year, month, 1),
	),
);

// 周名：2021-01-03 是周日，由此锚定一周 7 天（Intl weekday short）
const weekStartOffset = $derived(startOfWeek === "mon" ? 1 : 0);
const weekdays = $derived(
	Array.from({ length: 7 }, (_, i) => {
		const day = (i + weekStartOffset) % 7;
		return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
			new Date(2021, 0, 3 + day),
		);
	}),
);

const pad = (n: number) => String(n).padStart(2, "0");
const dateKey = (y: number, m: number, d: number) =>
	`${y}-${pad(m + 1)}-${pad(d)}`;

interface DayCell {
	day: number;
	key: string;
	posts: CalendarPost[];
}

const cells = $derived.by(() => {
	const first = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const leading = (first - weekStartOffset + 7) % 7;
	const result: (DayCell | null)[] = Array.from(
		{ length: leading },
		() => null,
	);
	for (let d = 1; d <= daysInMonth; d++) {
		const key = dateKey(year, month, d);
		result.push({ day: d, key, posts: postsByDate[key] ?? [] });
	}
	return result;
});

const selectedPosts = $derived(
	selectedDate ? (postsByDate[selectedDate] ?? []) : [],
);
const listOpen = $derived(selectedPosts.length > 0);

const isCurrentMonth = $derived(
	year === today.getFullYear() && month === today.getMonth(),
);

function isTodayCell(cell: DayCell): boolean {
	return (
		cell.key === dateKey(today.getFullYear(), today.getMonth(), today.getDate())
	);
}

const currentMonthKey = $derived(`${year}-${pad(month + 1)}`);

const canPrev = true;
const canNext = true;

function shiftMonth(delta: number) {
	const next = new Date(year, month + delta, 1);
	year = next.getFullYear();
	month = next.getMonth();
	selectedDate = null;
}

function backToToday() {
	year = today.getFullYear();
	month = today.getMonth();
	selectedDate = null;
}

function toggleDay(cell: DayCell) {
	selectedDate = selectedDate === cell.key ? null : cell.key;
}

const selectedDateFormatted = $derived.by(() => {
	if (!selectedDate) return "";
	const [y, m, d] = selectedDate.split("-").map(Number);
	return new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(new Date(y, m - 1, d));
});
</script>

<div class="m3-calendar">
	<header class="m3-calendar__bar">
		<IconButton
			variant="standard"
			size="xsmall"
			icon="material-symbols:chevron-left-rounded"
			label={prevMonthLabel}
			disabled={!canPrev}
			onclick={() => shiftMonth(-1)}
		/>
		<button
			type="button"
			class="m3-calendar__title"
			class:m3-calendar__title--clickable={!isCurrentMonth}
			title={isCurrentMonth ? undefined : backTodayLabel}
			aria-label={isCurrentMonth ? monthTitle : `${monthTitle}（${backTodayLabel}）`}
			onclick={() => {
				if (!isCurrentMonth) backToToday();
			}}
		>
			{monthTitle}
		</button>
		<IconButton
			variant="standard"
			size="xsmall"
			icon="material-symbols:chevron-right-rounded"
			label={nextMonthLabel}
			disabled={!canNext}
			onclick={() => shiftMonth(1)}
		/>
	</header>

	<div class="m3-calendar__weekdays" aria-hidden="true">
		{#each weekdays as weekday}
			<span class="m3-calendar__weekday">{weekday}</span>
		{/each}
	</div>

	{#key `${year}-${month}`}
		<div class="m3-calendar__grid" use:reveal={{ duration: 200 }}>
			{#each cells as cell}
				{#if cell === null}
					<span class="m3-calendar__blank" aria-hidden="true"></span>
				{:else}
					<button
						type="button"
						class={`m3-calendar__day${cell.posts.length > 0 ? " m3-calendar__day--has-posts" : ""}${isTodayCell(cell) ? " m3-calendar__day--today" : ""}${cell.key === selectedDate ? " m3-calendar__day--selected" : ""}`}
						aria-current={isTodayCell(cell) ? "date" : undefined}
						aria-label={`${cell.key}${cell.posts.length > 0 ? `，${cell.posts.length} entries` : ""}`}
						onclick={() => toggleDay(cell)}
					>
						<span class="m3-calendar__day-num">{cell.day}</span>
						{#if cell.posts.length > 0}
							<span class="m3-calendar__day-dot" aria-hidden="true"></span>
						{/if}
					</button>
				{/if}
			{/each}
		</div>
	{/key}

	<div class="m3-calendar__panel" use:collapse={{ open: listOpen }}>
		{#if selectedPosts.length > 0}
			<ul class="m3-calendar__posts">
				{#each selectedPosts as post}
					<li class="m3-calendar__post">
						<a href={post.url}>{post.title}</a>
						<span class="m3-calendar__post-date">{post.date.slice(5)}</span>
					</li>
				{/each}
			</ul>
		{:else if selectedDate}
			<div class="m3-calendar__empty-day">
				<span class="m3-calendar__empty-date">{selectedDateFormatted}</span>
				<span class="m3-calendar__empty-msg">No entries on this date</span>
			</div>
		{/if}
	</div>
</div>

<style lang="stylus">
	.m3-calendar
		display: flex
		flex-direction: column
		gap: 0.5rem

		&__bar
			display: flex
			align-items: center
			gap: 0.25rem

		&__title
			flex: 1
			min-width: 0
			margin: 0
			padding: 0.25rem 0.5rem
			border: none
			border-radius: var(--shape-corner-s)
			background: transparent
			text-align: center
			font: var(--m3e-type-title-small)
			font-weight: 600
			color: var(--on-surface)
			white-space: nowrap
			transition:
				color var(--m3e-duration-short) var(--m3e-easing-standard),
				background-color var(--m3e-duration-short) var(--m3e-easing-standard)

			&--clickable
				color: var(--primary)
				cursor: pointer

				&:hover
					background: var(--btn-plain-bg-hover)

		&__weekdays
			display: grid
			grid-template-columns: repeat(7, 1fr)
			gap: 0.25rem

		&__weekday
			text-align: center
			font: var(--m3e-type-label-medium)
			color: var(--on-surface-variant)

		&__grid
			display: grid
			grid-template-columns: repeat(7, 1fr)
			gap: 0.25rem

		&__blank
			aspect-ratio: 1

		&__day
			position: relative
			aspect-ratio: 1
			display: flex
			flex-direction: column
			align-items: center
			justify-content: center
			border: none
			border-radius: var(--shape-corner-s)
			background: transparent
			font: var(--m3e-type-label-large)
			font-variant-numeric: tabular-nums
			color: var(--on-surface-variant)
			cursor: pointer
			transition:
				background-color var(--m3e-duration-short) var(--m3e-easing-standard),
				color var(--m3e-duration-short) var(--m3e-easing-standard),
				transform var(--m3e-duration-short) var(--m3e-easing-standard),
				box-shadow var(--m3e-duration-short) var(--m3e-easing-standard)

			&:hover
				background: var(--btn-plain-bg-hover)
				color: var(--on-surface)
				transform: scale(1.08)

			&--has-posts
				background: unquote("color-mix(in oklab, var(--primary) 14%, transparent)")
				color: var(--on-surface)
				font-weight: 600

				&:hover
					background: unquote("color-mix(in oklab, var(--primary) 22%, transparent)")

			&--today
				background: var(--primary)
				color: var(--on-primary)
				font-weight: 700

				&:hover
					background: var(--primary)
					color: var(--on-primary)
					filter: brightness(1.08)

			&--selected
				box-shadow: inset 0 0 0 2px var(--primary)
				background: unquote("color-mix(in oklab, var(--primary) 18%, transparent)")
				color: var(--on-surface)

			&--today&--selected
				box-shadow: 0 0 0 2px var(--surface-container-lowest), 0 0 0 4px var(--primary)

		&__day-num
			z-index: 1

		&__day-dot
			position: absolute
			bottom: 3px
			width: 4px
			height: 4px
			border-radius: var(--shape-corner-full)
			background: var(--primary)
			pointer-events: none

		&__day--today .m3-calendar__day-dot
			background: var(--on-primary)

		&__empty-day
			display: flex
			flex-direction: column
			align-items: center
			gap: 0.25rem
			padding: 0.625rem 0.75rem
			border-radius: var(--shape-corner-s)
			background: unquote("color-mix(in oklab, var(--surface-container-high) 50%, transparent)")
			border: 1px dashed unquote("color-mix(in oklab, var(--outline-variant) 70%, transparent)")
			text-align: center

		&__empty-date
			font: var(--m3e-type-label-medium)
			font-weight: 600
			color: var(--on-surface)

		&__empty-msg
			font: var(--m3e-type-body-small)
			color: var(--on-surface-variant)
			opacity: 0.85

		&__panel
			overflow: hidden

		&__posts
			list-style: none
			margin: 0
			padding: 0.25rem 0 0
			display: flex
			flex-direction: column
			gap: 0.125rem
			max-height: 9.5rem
			overflow-y: auto
			overscroll-behavior: contain
			scrollbar-width: thin
			scrollbar-color: var(--scrollbar-bg) transparent

			&::-webkit-scrollbar
				width: var(--m3e-space-2)

			&::-webkit-scrollbar-track
				background: transparent

			&::-webkit-scrollbar-thumb
				background: var(--scrollbar-bg)
				border-radius: var(--shape-corner-full)

				&:hover
					background: var(--scrollbar-bg-hover)

				&:active
					background: var(--scrollbar-bg-active)

		&__post
			display: flex
			align-items: baseline
			gap: 0.5rem
			padding: 0.25rem 0.5rem
			border-radius: var(--shape-corner-s)
			transition: background-color var(--m3e-duration-short) var(--m3e-easing-standard)

			&:hover
				background: var(--btn-plain-bg-hover)

			a
				min-width: 0
				flex: 1
				overflow: hidden
				text-overflow: ellipsis
				white-space: nowrap
				font: var(--m3e-type-body-medium)
				color: var(--on-surface)
				text-decoration: none
				transition: color var(--m3e-duration-short) var(--m3e-easing-standard)

			&:hover a
				color: var(--primary)

		&__post-date
			flex-shrink: 0
			font: var(--m3e-type-label-medium)
			color: var(--on-surface-variant)
			font-variant-numeric: tabular-nums
</style>
