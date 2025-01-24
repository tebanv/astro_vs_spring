/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
	],

	theme: {
		extend: {
			colors: {
				customLightGreen: '#A8D5BA',
				customGreen: '#ecffee',
				customTextGreen: '#066810',
			  },
			backgroundColor: {
				'custom-green': {
					50: '#f0fdf4',
					100: '#dcfce7',		
				},
			},
		},
	},
	plugins: [
		function ({ addUtilities }) {
			const newUtilities = {
			  '.custom-green-div': {
				'@apply bg-custom-green-50 hover:bg-custom-green-100 transition-colors duration-200': {},
			  },
			}
			addUtilities(newUtilities, ['responsive', 'hover'])
		  },
	],
}
