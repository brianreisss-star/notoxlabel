/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    green: '#10B981', // Emerald 500
                    blue: '#3B82F6',  // Blue 500
                    yellow: '#F59E0B',// Amber 500
                    red: '#EF4444',   // Red 500
                }
            }
        },
    },
    plugins: [],
}
