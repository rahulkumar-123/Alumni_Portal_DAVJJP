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
                    light: '#A066CB',
                    DEFAULT: '#8344AD',
                    dark: '#5F307E',
                },
                'secondary': '#4ADAD2',
                'background': '#F4F7FE',
                'surface': '#FFFFFF',
                'on-surface': '#1a202c',
                'muted': '#718096',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
}