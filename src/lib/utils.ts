import { browser } from "$app/environment";
import { clsx, type ClassValue } from "clsx";
import { writable } from "svelte/store";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createLocalStorageStore<T>(name: string, init: T) {
  const ret = writable(init);

  if (!browser) return ret;

  if (localStorage.getItem(name)) {
    try {
      ret.set(JSON.parse(localStorage.getItem(name) ?? "{}") as T);
    } catch (error) {
      localStorage.setItem(name, JSON.stringify(init));
    }
  }

  ret.subscribe((value) => {
    localStorage.setItem(name, JSON.stringify(value));
  });

  return ret;
}

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(num: number, lowerBound: number, upperBound: number) {
  if (lowerBound > upperBound) {
    return (lowerBound + upperBound) / 2;
  }
  return Math.min(Math.max(num, lowerBound), upperBound);
}

export function flatten<T>(array: T[][]) {
  return array.reduce((acc, cur) => acc.concat(cur), []);
}

export function isDarkColor(hexCode: string) {
  // Convert the 3-digit hex code to 6-digit format
  const fullHexCode = hexCode.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    "#$1$1$2$2$3$3",
  );

  // Extract the red, green, and blue values
  const red = parseInt(fullHexCode.slice(1, 3), 16);
  const green = parseInt(fullHexCode.slice(3, 5), 16);
  const blue = parseInt(fullHexCode.slice(5, 7), 16);

  // Calculate the luminance using the relative luminance formula
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

  return luminance <= 0.15;
}

export function reversed<T>(array: T[]) {
  return [...array].reverse();
}

export function rem2px(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function sum(array: number[]) {
  return array.reduce((a, b) => a + b, 0);
}

export function avg(array: number[]) {
  if (array.length === 0) return null;
  return sum(array) / array.length;
}

export function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function blurActiveElement() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

export function isTyping(e: KeyboardEvent) {
  return (
    e.target instanceof HTMLInputElement ||
    e.target instanceof HTMLTextAreaElement ||
    (e.target instanceof HTMLElement && e.target.isContentEditable)
  );
}

export type TimeoutId = NodeJS.Timeout | number;

/**
 * Split ordered array into groups by describing when to place "dividers"
 */
export function groupByDivideCondition<T>(
  array: T[],
  condition: (item1: T, item2: T) => boolean,
): T[][] {
  if (array.length === 0) return [];
  const ret = [[array[0]]];
  for (let i = 1; i < array.length; i++) {
    if (condition(array[i - 1], array[i])) {
      ret.push([array[i]]);
    } else {
      ret[ret.length - 1].push(array[i]);
    }
  }
  return ret;
}

// export function formatDateRange(
//   from: Date,
//   to: Date,
//   { withWeekday = false } = {},
// ) {
//   const isCurYear = isSameYear(from, new Date());
//   const sameMonth = isSameMonth(from, to);
//   const sameYear = isSameYear(from, to);

//   if (withWeekday) {
//     if (isSameDay(from, to)) {
//       return formatDate(from, "EEE, MMM d");
//     }

//     if (sameYear) {
//       return `${formatDate(from, "EEE, MMM d")} – ${formatDate(
//         to,
//         isCurYear ? "EEE, MMM d" : "EEE, MMM d, yyyy",
//       )}`;
//     }
//   }

//   if (isSameDay(from, to)) {
//     const format = isCurYear ? "MMM d" : "MMM d, yyyy";
//     return formatDate(from, format);
//   }

//   if (sameMonth && sameYear) {
//     return `${formatDate(from, "MMM d")} – ${formatDate(
//       to,
//       isCurYear ? "d" : "d, yyyy",
//     )}`;
//   }
//   if (sameYear) {
//     return `${formatDate(from, "MMM d")} – ${formatDate(
//       to,
//       isCurYear ? "MMM d" : "MMM d, yyyy",
//     )}`;
//   }
//   return `${formatDate(from, "MMM d, yyyy")} – ${formatDate(to, "MMM d, yyyy")}`;
// }
