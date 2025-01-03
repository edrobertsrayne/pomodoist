import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function getInitialTheme() {
	if (browser) {
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme) {
			return storedTheme;
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'mocha' : 'frappe';
	}
	return 'frappe';
}

export const theme = writable(getInitialTheme());

if (browser) {
	theme.subscribe((value) => {
		localStorage.setItem('theme', value);
		document.documentElement.setAttribute('data-theme', value);
	});
}
