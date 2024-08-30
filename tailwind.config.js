const hocus = require("tailwindcss-hocus");
const scrollbar = require("tailwind-scrollbar");

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				zinc: {
					925: "#121214",
				},
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
			},
			screens: {
				"3xl": "1792px",
			},
		},
	},
	plugins: [
		hocus,
		scrollbar,
		require("tailwindcss/plugin")(({ addVariant }) => {
			addVariant("search-cancel", "&::-webkit-search-cancel-button");
		}),
		require("@xpd/tailwind-3dtransforms"),
		require("tailwindcss-touch")(),
	],
};
