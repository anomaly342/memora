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

				// Supporting
				"cyan-vivid-050": "#E1FCF8",
				"cyan-vivid-100": "#C1FEF6",
				"cyan-vivid-200": "#92FDF2",
				"cyan-vivid-300": "#62F4EB",
				"cyan-vivid-400": "#3AE7E1",
				"cyan-vivid-500": "#1CD4D4",
				"cyan-vivid-600": "#0FB5BA",
				"cyan-vivid-700": "#099AA4",
				"cyan-vivid-800": "#07818F",
				"cyan-vivid-900": "#05606E",

				"orange-vivid-050": "#FFE8D9",
				"orange-vivid-100": "#FFD0B5",
				"orange-vivid-200": "#FFB088",
				"orange-vivid-300": "#FF9466",
				"orange-vivid-400": "#F9703E",
				"orange-vivid-500": "#F35627",
				"orange-vivid-600": "#DE3A11",
				"orange-vivid-700": "#C52707",
				"orange-vivid-800": "#AD1D07",
				"orange-vivid-900": "#841003",

				"red-vivid-050": "#FFE3E3",
				"red-vivid-100": "#FFBDBD",
				"red-vivid-200": "#FF9B9B",
				"red-vivid-300": "#F86A6A",
				"red-vivid-400": "#EF4E4E",
				"red-vivid-500": "#E12D39",
				"red-vivid-600": "#CF1124",
				"red-vivid-700": "#AB091E",
				"red-vivid-800": "#8A041A",
				"red-vivid-900": "#610316",

				"yellow-vivid-050": "#FFFBEA",
				"yellow-vivid-100": "#FFF3C4",
				"yellow-vivid-200": "#FCE588",
				"yellow-vivid-300": "#FADB5F",
				"yellow-vivid-400": "#F7C948",
				"yellow-vivid-500": "#F0B429",
				"yellow-vivid-600": "#DE911D",
				"yellow-vivid-700": "#CB6E17",
				"yellow-vivid-800": "#B44D12",
				"yellow-vivid-900": "#8D2B0B",
			},
		},
	},
	plugins: [],
} satisfies Config;
