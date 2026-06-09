/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0B0F',
          surface: '#13161F',
          elevated: '#1B2030',
        },
        border: {
          DEFAULT: '#272D3F',
          soft: '#1E2434',
        },
        gold: {
          DEFAULT: '#FCCE47',
          dim: '#C4961A',
        },
        celo: {
          green: '#35D07F',
          blue: '#5EA3F7',
        },
        danger: '#FF4D6D',
        warning: '#FF9F1C',
        text: {
          primary: '#F0F2F8',
          secondary: '#8892A4',
          muted: '#5A6273',
          accent: '#FCCE47',
        },
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 12px 32px -12px rgba(0,0,0,0.7)',
        'glow-gold': '0 0 0 1px rgba(252,206,71,0.35), 0 0 24px -4px rgba(252,206,71,0.45)',
        'glow-green': '0 0 0 1px rgba(53,208,127,0.35), 0 0 24px -4px rgba(53,208,127,0.4)',
      },
      animation: {
        'dice-roll': 'diceRoll 0.6s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
        'fade-in': 'fadeIn 0.25s ease-out',
        'pulse-gold': 'pulseGold 1.6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 2.4s linear infinite',
      },
      keyframes: {
        diceRoll: {
          '0%': { transform: 'rotateX(0deg) rotateY(0deg) scale(0.5)', opacity: '0' },
          '50%': { transform: 'rotateX(720deg) rotateY(360deg) scale(1.2)', opacity: '0.8' },
          '100%': { transform: 'rotateX(720deg) rotateY(360deg) scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(22px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 6px rgba(252,206,71,0.25)' },
          '50%': { boxShadow: '0 0 22px rgba(252,206,71,0.6)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(53,208,127,0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(53,208,127,0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
