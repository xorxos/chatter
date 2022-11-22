/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['.index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                chatter: [
                    'Inter',
                    'Roobert',
                    'Helvetica Neue',
                    'Helvetica',
                    'Arial',
                    'sans-serif',
                ],
            },
        },
    },
    plugins: [],
}
