/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        shield: {
          bg: '#090306',
          surface: '#130a10',
          card: '#1c0f17',
          border: '#331a28',
          'border-glow': '#4d263d',
          primary: '#ec4899',
          'primary-dark': '#db2777',
          accent: '#f472b6',
          purple: '#c084fc',
          danger: '#f43f5e',
          warning: '#fbbf24',
          safe: '#34d399',
          'text-primary': '#F1F5F9',
          'text-secondary': '#94A3B8',
          'text-muted': '#64748B',
          neon: '#f9a8d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #090306 0%, #1c0f17 40%, #130a10 70%, #090306 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(192,132,252,0.04) 100%)',
        'glow-gradient': 'linear-gradient(135deg, #ec4899, #f472b6, #c084fc)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(236,72,153,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(192,132,252,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(244,114,182,0.08) 0px, transparent 50%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(236,72,153,0.3), 0 0 60px rgba(236,72,153,0.1)',
        'neon-lg': '0 0 30px rgba(236,72,153,0.4), 0 0 80px rgba(236,72,153,0.15)',
        'neon-purple': '0 0 20px rgba(192,132,252,0.3), 0 0 60px rgba(192,132,252,0.1)',
        'danger': '0 0 20px rgba(244,63,94,0.3)',
        'safe': '0 0 20px rgba(52,211,153,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.5)',
        'glass-lg': '0 16px 64px rgba(0,0,0,0.6), 0 0 80px rgba(236,72,153,0.05)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 20px rgba(236,72,153,0.03)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'float-slow': 'float 8s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'gradient': 'gradient 6s ease infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s linear infinite',
        'morph-glow': 'morphGlow 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
        'marquee-up': 'marqueeUp 15s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(236,72,153,0.2), 0 0 20px rgba(236,72,153,0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(236,72,153,0.4), 0 0 60px rgba(236,72,153,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        morphGlow: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(236,72,153,0.2)' },
          '50%': { boxShadow: '0 0 35px rgba(236,72,153,0.4), 0 0 60px rgba(236,72,153,0.15)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
};
