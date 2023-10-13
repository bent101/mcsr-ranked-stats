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

/** current date in seconds after epoch */
export const curDate = readable(Math.floor(Date.now() / 1000), function start(set) {
	const interval = setInterval(() => {
		set(Math.floor(Date.now() / 1000));
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

export type Outcome = "won" | "lost" | "draw" | undefined;
export type Direction = "top" | "bottom" | "left" | "right";
export const seedTypes = [
	"buried treasure",
	"shipwreck",
	"desert temple",
	"village",
	"ruined portal",
] as const;

export const seedTypesWithAll = ["all", ...seedTypes] as const;
