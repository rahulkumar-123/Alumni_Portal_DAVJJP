const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'primary': {
                    light: '#ffc14a',
                    DEFAULT: '#f5a623', // amber
                    dark: '#c47d0e',
                },
                'secondary': '#ff6b1a', // saffron
                'background': '#080808', // deep black
                'surface': '#111419', // dark card
                'on-surface': '#f2ede8', // off-white text
                'muted': 'rgba(242,237,232,0.55)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
}