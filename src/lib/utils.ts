import { writable } from "svelte/store";
import { browser } from "$app/environment";

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

// export function groupBy<T>(array: T[], key: string) {
// 	return array.reduce((result: Record<string, T[]>, cur: T) => {
// 		const group = cur[key];
// 		if (!result[group]) {
// 			result[group] = [];
// 		}
// 		result[group].push(cur);
// 		return result;
// 	}, {});
// }

export function isDarkColor(hexCode: string) {
	// Convert the 3-digit hex code to 6-digit format
	const fullHexCode = hexCode.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, "#$1$1$2$2$3$3");

	// Extract the red, green, and blue values
	const red = parseInt(fullHexCode.slice(1, 3), 16);
	const green = parseInt(fullHexCode.slice(3, 5), 16);
	const blue = parseInt(fullHexCode.slice(5, 7), 16);

	// Calculate the luminance using the relative luminance formula
	const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

	return luminance <= 0.15;
}
