/** @type {import('tailwindcss').Config} */
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
		logs: false
	}
};
