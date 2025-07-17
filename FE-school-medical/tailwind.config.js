// filepath: c:\Users\quang\OneDrive\Máy tính\SWP\School-Medical-Management-System-\FE-school-medical\tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure this line exists
  ],
  theme: {
    extend: {
      spacing: {
        '19.5': '4.875rem',
        '62.5': '15.625rem',
        '68.5': '17.125rem',
        '20': '5rem',
      },
      boxShadow: {
        "soft-xxs": "0 1px 5px 1px #ddd",
        "soft-xs": "0 3px 5px -1px rgba(0,0,0,.09),0 2px 3px -1px rgba(0,0,0,.07)",
        "soft-sm": "0 .25rem .375rem -.0625rem hsla(0,0%,8%,.12),0 .125rem .25rem -.0625rem hsla(0,0%,8%,.07)",
        "soft-md": "0 4px 7px -1px rgba(0,0,0,.11),0 2px 4px -1px rgba(0,0,0,.07)",
        "soft-lg": "0 2px 12px 0 rgba(0,0,0,.16)",
        "soft-xl": "0 20px 27px 0 rgba(0,0,0,0.05)",
        "soft-2xl": "0 .3125rem .625rem 0 rgba(0,0,0,.12)",
        "soft-3xl": "0 8px 26px -4px hsla(0,0%,8%,.15),0 8px 9px -5px hsla(0,0%,8%,.06)",
      },
      colors: {
        slate: {
          50: "#f8fafc",
          100: "#dee2e6",
          200: "#cbd3da",
          300: "#a8b8d8",
          400: "#8392ab",
          500: "#67748e",
          600: "#627594",
          700: "#344767",
          800: "#3a416f",
          900: "#0f172a",
        },
      },
      transitionTimingFunction: {
        'soft-in': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'soft-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'soft-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'nav-brand': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundSize: {
        '150': '150%',
      },
      backgroundPosition: {
        'x-25': '25%',
      },
      scale: {
        '102': '1.02',
      },
      letterSpacing: {
        'tight-soft': '-0.025em',
      },
      lineHeight: {
        'pro': '1.6',
      },
    },
  },
  plugins: [],
}