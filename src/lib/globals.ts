import { browser } from "$app/environment";
import { readable, writable } from "svelte/store";

/** how many matches to load on page load, then on scroll */
export const matchesPerPage = 30;

export const minWSm = mql("(min-width: 640px)");
export const minWSmMd = mql("(min-width: 710px)");
export const minWMd = mql("(min-width: 768px)");
export const minWLg = mql("(min-width: 1024px)");
export const minWXl = mql("(min-width: 1280px)");
export const isTouchScreen = mql("(any-pointer: coarse)");

export const onlinePlayers = writable(new Set<string>());

function mql(query: string, { fallback = true } = {}) {
  if (!browser) return readable(fallback);
  const matcher = window.matchMedia(query);

  return readable(matcher.matches, (set) => {
    function onChange() {
      set(matcher.matches);
    }
    matcher.addEventListener("change", onChange);
    return () => matcher.removeEventListener("change", onChange);
  });
}

/** current date in seconds after epoch (updates every second) */
export const curDate = readable(
  Math.floor(Date.now() / 1000),
  function start(set) {
    const interval = setInterval(() => {
      set(Math.floor(Date.now() / 1000));
    }, 1000);

    return function stop() {
      clearInterval(interval);
    };
  },
);

export const showingLeaderboard = writable(false);

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
