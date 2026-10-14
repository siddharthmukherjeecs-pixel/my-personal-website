import { collection, config, fields, singleton } from "@keystatic/core";

const isProd = import.meta.env?.PROD ?? false;
const storageKind = import.meta.env?.PUBLIC_KEYSTATIC_STORAGE_KIND;
const useGithubStorage =
	storageKind === "github" || (isProd && storageKind !== "local");

const repoOwner =
	import.meta.env?.PUBLIC_KEYSTATIC_REPO_OWNER || "siddharthmukherjeecs-pixel";
const repoName =
	import.meta.env?.PUBLIC_KEYSTATIC_REPO_NAME || "my-personal-website";
const githubRepo = `${repoOwner}/${repoName}` as `${string}/${string}`;


export default config({
	storage: useGithubStorage
		? {
				kind: "github",
				repo: githubRepo,
			}
		: {
				kind: "local",
			},
	ui: {
		brand: {
			name: "Siddharth's Studio",
		},
		navigation: {
			"Writing & Publishing": ["posts", "moments"],
			"Profile & Identity": ["about", "projects", "skills"],
			"Curations & Network": ["anime", "manga", "timeline", "friends"],
		},
	},
	collections: {
		posts: collection({
			label: "Writing & Posts",
			slugField: "title",
			path: "src/content/posts/*",
			format: { contentField: "content" },
			entryLayout: "content",
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				published: fields.date({
					label: "Published Date",
					defaultValue: { kind: "today" },
				}),
				description: fields.text({
					label: "Description",
					multiline: true,
				}),
				category: fields.text({ label: "Category" }),
				tags: fields.array(fields.text({ label: "Tag" }), {
					label: "Tags",
					itemLabel: (props) => props.value || "New Tag",
				}),
				pinned: fields.checkbox({
					label: "Pinned Post",
					defaultValue: false,
				}),
				draft: fields.checkbox({
					label: "Draft",
					defaultValue: false,
				}),
				content: fields.mdx({
					label: "Content",
					extension: "md",
				}),
			},
		}),
		moments: collection({
			label: "Moments & Notes",
			slugField: "title",
			path: "src/content/moments/*",
			format: { contentField: "content" },
			entryLayout: "content",
			schema: {
				title: fields.slug({ name: { label: "Slug / Identifier" } }),
				published: fields.date({
					label: "Date",
					defaultValue: { kind: "today" },
				}),
				location: fields.text({ label: "Location" }),
				mood: fields.text({
					label: "Mood Icon",
					description: "Iconify name, e.g. material-symbols:terminal-rounded",
				}),
				tags: fields.array(fields.text({ label: "Tag" }), {
					label: "Tags",
					itemLabel: (props) => props.value || "New Tag",
				}),
				draft: fields.checkbox({
					label: "Draft",
					defaultValue: false,
				}),
				content: fields.mdx({
					label: "Note Body",
					extension: "md",
				}),
			},
		}),
	},
	singletons: {
		about: singleton({
			label: "About & Profile",
			path: "src/content/spec/about",
			format: { contentField: "content" },
			entryLayout: "content",
			schema: {
				content: fields.mdx({
					label: "About Markdown Content",
					extension: "md",
				}),
			},
		}),
		projects: singleton({
			label: "Projects List",
			path: "src/data/projects",
			format: "json",
			schema: {
				items: fields.array(
					fields.object({
						key: fields.text({ label: "Key / Identifier (e.g. c-ray-tracer)" }),
						title: fields.text({ label: "Title" }),
						summary: fields.text({ label: "Summary", multiline: true }),
						category: fields.text({ label: "Category (e.g. graphics, ai-ml)" }),
						phase: fields.select({
							label: "Phase",
							options: [
								{ label: "Shipped", value: "shipped" },
								{ label: "Building", value: "building" },
								{ label: "Archived", value: "archived" },
							],
							defaultValue: "shipped",
						}),
						technologies: fields.array(fields.text({ label: "Technology" }), {
							label: "Technologies",
							itemLabel: (props) => props.value || "Tech",
						}),
						icon: fields.text({
							label: "Iconify Icon (e.g. material-symbols:wb-iridescent-outline-rounded)",
						}),
						featured: fields.checkbox({
							label: "Featured Project",
							defaultValue: false,
						}),
						repository: fields.text({ label: "Repository URL" }),
						year: fields.text({ label: "Year (e.g. 2025–2026)" }),
					}),
					{
						label: "Projects",
						itemLabel: (props) => props.fields.title.value || "Project",
					},
				),
			},
		}),
		timeline: singleton({
			label: "Timeline Milestones",
			path: "src/data/timeline",
			format: "json",
			schema: {
				items: fields.array(
					fields.object({
						title: fields.text({ label: "Milestone Title" }),
						date: fields.text({ label: "Date (e.g. 2026.01)" }),
						category: fields.text({
							label: "Category (e.g. milestone, project)",
						}),
						subtitle: fields.text({ label: "Subtitle" }),
						description: fields.text({ label: "Description", multiline: true }),
						highlights: fields.array(fields.text({ label: "Highlight" }), {
							label: "Highlights",
							itemLabel: (props) => props.value || "Highlight",
						}),
						tags: fields.array(fields.text({ label: "Tag" }), {
							label: "Tags",
							itemLabel: (props) => props.value || "Tag",
						}),
						icon: fields.text({ label: "Iconify Icon" }),
						featured: fields.checkbox({
							label: "Featured Milestone",
							defaultValue: false,
						}),
					}),
					{
						label: "Timeline Items",
						itemLabel: (props) =>
							props.fields.title.value || "Timeline Event",
					},
				),
			},
		}),
		skills: singleton({
			label: "Skills & Stack",
			path: "src/data/skills",
			format: "json",
			schema: {
				items: fields.array(
					fields.object({
						name: fields.text({ label: "Skill Name" }),
						description: fields.text({ label: "Description", multiline: true }),
						icon: fields.text({ label: "Iconify Icon (e.g. simple-icons:c)" }),
						category: fields.text({
							label: "Category (e.g. backend, frontend)",
						}),
						level: fields.select({
							label: "Proficiency Level",
							options: [
								{ label: "Expert", value: "expert" },
								{ label: "Advanced", value: "advanced" },
								{ label: "Intermediate", value: "intermediate" },
								{ label: "Beginner", value: "beginner" },
							],
							defaultValue: "expert",
						}),
					}),
					{
						label: "Skills",
						itemLabel: (props) => props.fields.name.value || "Skill",
					},
				),
			},
		}),
		anime: singleton({
			label: "Anime Watchlist & Reviews",
			path: "src/data/anime",
			format: "json",
			schema: {
				items: fields.array(
					fields.object({
						title: fields.text({ label: "Anime Title" }),
						status: fields.select({
							label: "Watch Status",
							options: [
								{ label: "Watching", value: "watching" },
								{ label: "Completed", value: "completed" },
								{ label: "Planned", value: "planned" },
								{ label: "On Hold", value: "onHold" },
								{ label: "Dropped", value: "dropped" },
							],
							defaultValue: "watching",
						}),
						rating: fields.number({
							label: "Rating (0 - 10)",
							defaultValue: 9,
						}),
						cover: fields.text({
							label: "Cover Image URL (Optional)",
							description: "Leave empty to automatically fetch cover from AniList / Jikan!",
						}),
						year: fields.text({
							label: "Year (Optional)",
							description: "Leave empty to auto-fetch",
						}),
						studio: fields.text({
							label: "Studio (Optional)",
							description: "Leave empty to auto-fetch",
						}),
						genres: fields.array(fields.text({ label: "Genre" }), {
							label: "Genres",
							itemLabel: (props) => props.value || "Genre",
						}),
						description: fields.text({
							label: "Review / Synopsis (Optional)",
							description: "Leave empty to auto-fetch synopsis",
							multiline: true,
						}),
						link: fields.text({
							label: "Streaming / Detail Link (Optional)",
						}),
					}),
					{
						label: "Anime Entries",
						itemLabel: (props) => props.fields.title.value || "Anime",
					},
				),
			},
		}),
		manga: singleton({
			label: "Manga, Manhwa & Webtoons",
			path: "src/data/manga",
			format: "json",
			schema: {
				items: fields.array(
					fields.object({
						title: fields.text({ label: "Title" }),
						type: fields.select({
							label: "Format / Type",
							options: [
								{ label: "Manhwa (Korean)", value: "manhwa" },
								{ label: "Manga (Japanese)", value: "manga" },
								{ label: "Webtoon (Vertical Scroll)", value: "webtoon" },
								{ label: "Manhua (Chinese)", value: "manhua" },
							],
							defaultValue: "manhwa",
						}),
						country: fields.select({
							label: "Country of Origin",
							options: [
								{ label: "Auto (from AniList / Type)", value: "" },
								{ label: "🇰🇷 South Korea (Manhwa / Webtoon)", value: "KR" },
								{ label: "🇯🇵 Japan (Manga)", value: "JP" },
								{ label: "🇨🇳 China / Taiwan (Manhua)", value: "CN" },
							],
							defaultValue: "",
						}),
						status: fields.select({
							label: "Reading Status",
							options: [
								{ label: "Reading", value: "reading" },
								{ label: "Completed", value: "completed" },
								{ label: "Planned", value: "planned" },
								{ label: "On Hold", value: "onHold" },
								{ label: "Dropped", value: "dropped" },
							],
							defaultValue: "reading",
						}),
						rating: fields.number({
							label: "Rating (0 - 10)",
							defaultValue: 9,
						}),
						progress: fields.text({
							label: "Progress (e.g. Ch. 45 or 45/120)",
						}),
						cover: fields.text({
							label: "Cover Image URL (Optional)",
							description: "Leave empty to automatically fetch cover from AniList / Jikan!",
						}),
						author: fields.text({
							label: "Author / Artist (Optional)",
							description: "Leave empty to auto-fetch",
						}),
						year: fields.text({
							label: "Year (Optional)",
							description: "Leave empty to auto-fetch",
						}),
						genres: fields.array(fields.text({ label: "Genre" }), {
							label: "Genres",
							itemLabel: (props) => props.value || "Genre",
						}),
						description: fields.text({
							label: "Review / Synopsis (Optional)",
							description: "Leave empty to auto-fetch synopsis",
							multiline: true,
						}),
						link: fields.text({
							label: "Reading / Detail Link (Optional)",
						}),
					}),
					{
						label: "Manga Entries",
						itemLabel: (props) =>
							`${props.fields.title.value || "Entry"} (${props.fields.type.value})`,
					},
				),
			},
		}),
		friends: singleton({
			label: "Friends Links",
			path: "src/data/friends",
			format: "json",
			schema: {
				items: fields.array(
					fields.object({
						id: fields.number({ label: "ID", defaultValue: 1 }),
						title: fields.text({ label: "Friend Name / Blog Title" }),
						imgurl: fields.text({ label: "Avatar / Image URL" }),
						desc: fields.text({ label: "Description" }),
						siteurl: fields.text({ label: "Website URL" }),
						tags: fields.array(fields.text({ label: "Tag" }), {
							label: "Tags",
							itemLabel: (props) => props.value || "Tag",
						}),
					}),
					{
						label: "Friends List",
						itemLabel: (props) => props.fields.title.value || "Friend",
					},
				),
			},
		}),
	},
});
