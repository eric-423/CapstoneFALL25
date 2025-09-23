/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        './src/**/*.{ts,tsx,js,jsx}',
        './public/**/*.svg',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', 'Arial', 'Helvetica', 'sans-serif'],
            },
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                accent: 'var(--color-accent)',
                background: 'var(--color-background)',
                foreground: 'var(--color-foreground)',
                muted: 'var(--color-muted)',
                border: 'var(--color-border)',
                error: 'var(--color-error)',
                success: 'var(--color-success)',
                warning: 'var(--color-warning)',
            },
            screens: {
                xs: '480px',
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
            },
        },
    },
    plugins: [],
};

export default config;
