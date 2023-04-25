const hocus = require("tailwindcss-hocus");
const scrollbar = require("tailwind-scrollbar");

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {},
	},
	plugins: [hocus, scrollbar],
};
