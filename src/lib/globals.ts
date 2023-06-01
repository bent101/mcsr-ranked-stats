import { readable } from "svelte/store";

/** how many matches to load on page load, then on scroll */
export const matchesPerPage = 30;

/** uses min-width: 1280px, the same as tailwind's `xl:` */
export const isXlScreen = readable(true, (set) => {
	if (typeof window === "undefined") return () => undefined;

	const mediaQuery = window.matchMedia("(min-width: 1280px)");
	const setMatches = () => set(mediaQuery.matches);
	setMatches();
	mediaQuery.addEventListener("change", setMatches);
	return () => mediaQuery.removeEventListener("change", setMatches);
});

/** uses min-width: 1024px, the same as tailwind's `xl:` */
export const isLgScreen = readable(true, (set) => {
	if (typeof window === "undefined") return () => undefined;

	const mediaQuery = window.matchMedia("(min-width: 1024px)");
	const setMatches = () => set(mediaQuery.matches);
	setMatches();
	mediaQuery.addEventListener("change", setMatches);
	return () => mediaQuery.removeEventListener("change", setMatches);
});
