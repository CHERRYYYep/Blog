import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "CHERRY",
	subtitle: "Blog",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: [
			"assets/images/a.png",
			"assets/images/raze.png",
			"assets/images/c.png",
			"assets/images/老沙.jpg",
		], // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "full", // Supports 'top', 'center', 'bottom', 'full'. 'full' shows the whole image without cropping.
		credit: {
			enable: false, // Display the credit text of the banner image 图片标签
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	post: {
		glassmorphism: true, // Add a blurred translucent background to the post content card.
	},
	music: {
		enable: true,
		autoplay: false,
		volume: 0.6,
		// Use a direct audio URL, e.g. "https://example.com/song.mp3",
		// or a local public file path, e.g. "/music/song.mp3".
		// NetEase song page links like "https://music.163.com/song?id=..." are converted automatically.
		src: [],
		tracks: [
			// You can also use a playlist:
			// "/music/example.mp3",
			"https://music.163.com/song?id=3389879577",
			{
				title: "DAY1",
				artist: "艾志恒Asen",
				src: "https://music.163.com/#/song?id=1492864083",
			},
			"https://music.163.com/song?id=3401160431",
		],
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/saicaca/fuwari", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/nami.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "CHERRYYYep",
	bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	links: [
		//{
		//	name: "Twitter",
		//	icon: "fa6-brands:twitter", // Visit https://icones.js.org/ for icon codes
		// You will need to install the corresponding icon set if it's not already included
		// `pnpm add @iconify-json/<icon-set-name>`
		//	url: "https://twitter.com",
		//},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://store.steampowered.com",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/saicaca/fuwari",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: false,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
