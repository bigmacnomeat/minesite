/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F7931A', // Bitcoin orange for mining theme
        secondary: '#FFD700', // Gold color
        'crayon-red': '#FF6B6B',
        'crayon-blue': '#4ECDC4',
        'crayon-yellow': '#FFE66D',
        'crayon-green': '#95E1D3',
        'crayon-purple': '#A8E6CF',
        'crayon-pink': '#FF8B94',
        'mine': {
          'green': '#4ADE80',
          'dark': '#1F2937',
          'light': '#6EE7A4',
          'crystal': '#A7F3D0',
          'gold': '#FFD700',
          'copper': '#B87333',
          'silver': '#C0C0C0',
          'cave': '#2D3748',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      animation: {
        'pickaxe-swing': 'pickaxeSwing 1s ease-in-out infinite',
        'crystal-shine': 'crystalShine 2s ease-in-out infinite',
        'dig': 'dig 1s ease-in-out infinite',
        'cart-move': 'cartMove 10s linear infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'gem-rotate': 'gemRotate 3s ease-in-out infinite',
        'mine-dust': 'mineDust 2s ease-in-out infinite',
        'lantern-flicker': 'lanternFlicker 3s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-crazy': 'spin-crazy 3s linear infinite',
        'wobble': 'wobble 2s ease-in-out infinite',
        'rainbow': 'rainbow 10s ease infinite',
        'gradient': 'gradient 15s ease infinite',
        'drill-spin': 'drillSpin 0.5s linear infinite',
        'ore-pulse': 'orePulse 3s ease-in-out infinite',
        'torch-flicker': 'torchFlicker 2s ease-in-out infinite',
        'elevator-move': 'elevatorMove 8s ease-in-out infinite',
        'bat-fly': 'batFly 10s linear infinite',
        'water-drip': 'waterDrip 2s linear infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.2s ease-out',
      },
      keyframes: {
        pickaxeSwing: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(-30deg)' },
        },
        crystalShine: {
          '0%, 100%': { 
            opacity: '0.5',
            filter: 'brightness(1)',
            textShadow: '0 0 5px rgba(167, 243, 208, 0.5)'
          },
          '50%': { 
            opacity: '1',
            filter: 'brightness(1.5)',
            textShadow: '0 0 20px rgba(167, 243, 208, 0.8)'
          },
        },
        dig: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(5px)' },
        },
        cartMove: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        sparkle: {
          '0%, 100%': { 
            opacity: '0',
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.2)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { 
            textShadow: '0 0 10px rgba(74, 222, 128, 0.5)',
            boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)'
          },
          '50%': { 
            textShadow: '0 0 20px rgba(74, 222, 128, 0.8)',
            boxShadow: '0 0 20px rgba(74, 222, 128, 0.8)'
          },
        },
        gemRotate: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        mineDust: {
          '0%, 100%': { 
            opacity: '0.3',
            transform: 'translateY(0) scale(1)'
          },
          '50%': { 
            opacity: '0.6',
            transform: 'translateY(-10px) scale(1.1)'
          },
        },
        lanternFlicker: {
          '0%, 100%': { 
            opacity: '0.8',
            filter: 'brightness(1)',
            textShadow: '0 0 8px rgba(255, 215, 0, 0.6)'
          },
          '50%': { 
            opacity: '1',
            filter: 'brightness(1.2)',
            textShadow: '0 0 15px rgba(255, 215, 0, 0.8)'
          },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 20px rgba(74, 222, 128, 0.5)'
          },
          '50%': { 
            opacity: '.8',
            boxShadow: '0 0 30px rgba(74, 222, 128, 0.8)'
          },
        },
        drillSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        orePulse: {
          '0%, 100%': { 
            transform: 'scale(1)',
            filter: 'brightness(1)',
          },
          '50%': { 
            transform: 'scale(1.05)',
            filter: 'brightness(1.2)',
          },
        },
        torchFlicker: {
          '0%, 100%': { 
            filter: 'brightness(1) drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
          },
          '50%': { 
            filter: 'brightness(1.3) drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
          },
        },
        elevatorMove: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-100px)' },
        },
        batFly: {
          '0%': { 
            transform: 'translateX(-100vw) translateY(0)',
          },
          '25%': {
            transform: 'translateX(-50vw) translateY(-30px)',
          },
          '50%': {
            transform: 'translateX(0) translateY(0)',
          },
          '75%': {
            transform: 'translateX(50vw) translateY(-30px)',
          },
          '100%': {
            transform: 'translateX(100vw) translateY(0)',
          },
        },
        waterDrip: {
          '0%': { 
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          '50%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
      },
      backgroundImage: {
        'mine-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%234ade80' fill-opacity='0.05'/%3E%3C/svg%3E\")",
        'crystal-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 20-20 20L0 20z' fill='%23a7f3d0' fill-opacity='0.05'/%3E%3C/svg%3E\")",
        'cave-texture': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='%232D3748' fill-opacity='0.1'/%3E%3C/svg%3E\")",
      },
      fontFamily: {
        'comic': ['"Comic Neue"', 'cursive'],
      },
    },
  },
  plugins: [],
}
