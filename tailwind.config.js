/** @type {import('tailwindcss').Config} */

import catppuccin from '@catppuccin/daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			spacing: {
				120: '30rem'
			}
		}
	},
	plugins: [require('daisyui')],
	daisyui: {
		logs: false,
		themes: [
			catppuccin('latte', { primary: 'flamingo' }),
			catppuccin('mocha', { primary: 'flamingo' })
		]
		// darkTheme: 'mocha'
	}
};
