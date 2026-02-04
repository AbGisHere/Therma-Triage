/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                heat: {
                    safe: '#22c55e',
                    caution: '#eab308',
                    danger: '#ef4444',
                },
                brand: {
                    primary: '#0ea5e9',
                    dark: '#0c4a6e',
                }
            },
            animation: {
                'pulse-danger': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 3s linear infinite',
            },
        },
    },
    plugins: [],
}
