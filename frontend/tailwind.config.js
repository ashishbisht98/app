/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
                sans: ['"IBM Plex Sans"', "ui-sans-serif", "system-ui"],
                mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
            },
            colors: {
                /* Re-mapped tokens — kept names for backwards compatibility */
                void: {
                    DEFAULT: "#FBF7F1",   // page bg (cream)
                    surface: "#F3EBDC",   // soft beige (elevated cards)
                    elevated: "#EAE0CE",  // deeper warm
                },
                signal: {
                    DEFAULT: "#D86A35",   // warm terracotta
                    hover: "#B8521E",
                },
                grid: "#EADFCB",          // warm hairline border
                gridhi: "#C9B89C",        // stronger warm border
                electric: "#3F7A6B",      // warm sage/teal accent
                whatsapp: "#25D366",
                ink: "#2A1F18",           // primary warm dark text
                warm: {
                    50: "#FBF7F1",
                    100: "#F3EBDC",
                    200: "#E7DBC2",
                    300: "#C9BCA4",
                    400: "#A99B8C",
                    500: "#8A7A6B",
                    600: "#6B5A4D",
                    700: "#4A3B30",
                    800: "#332620",
                    900: "#2A1F18",
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' }
                },
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                marquee: 'marquee 50s linear infinite',
                'fade-up': 'fade-up 0.6s ease-out both'
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
