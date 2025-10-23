/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nanum Gothic', '나눔고딕', 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', 'Noto Sans KR', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.blue[700],
        secondary: colors.blue[700],
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        neutral: colors.neutral,
        surface: {
          200: "#f3f5f8",
          150: "#e6e8ee",
          300: "#d1d5db",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.05), 0 1px 3px rgba(16,24,40,.08)",
        soft: "0 8px 24px rgba(16,24,40,.08)",
      },
      borderRadius: {
        xl: "0.5rem",     // 8px
        "2xl": "0.75rem"  // 12px
      },
      maxWidth: { container: "1200px" },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        lmsnavy: {
          primary: "#1e293b",
          "primary-content": "#ffffff",
          secondary: "#475569",
          accent: "#2563eb",
          neutral: "#334155",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#e2e8f0",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
  },
}


