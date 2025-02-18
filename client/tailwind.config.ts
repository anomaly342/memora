import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",

				// Blue colors
				"blue-vivid-050": "#E6F6FF",
				"blue-vivid-100": "#BAE3FF",
				"blue-vivid-200": "#7CC4FA",
				"blue-vivid-300": "#47A3F3",
				"blue-vivid-400": "#2186EB",
				"blue-vivid-500": "#0967D2",
				"blue-vivid-600": "#0552B5",
				"blue-vivid-700": "#03449E",
				"blue-vivid-800": "#01337D",
				"blue-vivid-900": "#002159",

				// Grey colors
				"cool-grey-050": "#F5F7FA",
				"cool-grey-100": "#E4E7EB",
				"cool-grey-200": "#CBD2D9",
				"cool-grey-300": "#9AA5B1",
				"cool-grey-400": "#7B8794",
				"cool-grey-500": "#616E7C",
				"cool-grey-600": "#52606D",
				"cool-grey-700": "#3E4C59",
				"cool-grey-800": "#323F4B",
				"cool-grey-900": "#1F2933",
			},
		},
	},
	plugins: [],
} satisfies Config;
