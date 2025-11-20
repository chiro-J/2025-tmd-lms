import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.mp4', '**/*.webm', '**/*.ogg'],
  optimizeDeps: {
    include: ['html2pdf.js'],
  },
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    rollupOptions: {
      external: ['html2pdf.js'],
      output: {
        manualChunks(id) {
          // 큰 라이브러리들을 별도 청크로 분리
          if (id.includes('node_modules')) {
            // React 관련
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            // PDF 관련
            if (id.includes('react-pdf') || id.includes('pdfjs-dist') || id.includes('html2pdf')) {
              return 'pdf-vendor'
            }
            // 에디터 관련
            if (id.includes('tinymce')) {
              return 'editor-vendor'
            }
            // UI 아이콘
            if (id.includes('lucide-react')) {
              return 'ui-vendor'
            }
            // HTTP 클라이언트
            if (id.includes('axios')) {
              return 'http-vendor'
            }
            // 기타 큰 라이브러리들
            if (id.includes('marked') || id.includes('dompurify') || id.includes('html2canvas')) {
              return 'utils-vendor'
            }
            // TypeORM, TypeScript 관련
            if (id.includes('typeorm') || id.includes('reflect-metadata') || id.includes('class-')) {
              return 'orm-vendor'
            }
            // 기타 큰 라이브러리 추가 분리
            if (id.includes('daisyui') || id.includes('tailwindcss')) {
              return 'css-vendor'
            }
            // 기타 node_modules는 vendor로 (더 작은 청크로 분리)
            return 'vendor'
          }
          // curriculum API는 별도 청크로 (동적 import로 이미 분리됨)
          if (id.includes('core/api/curriculum')) {
            return 'api-curriculum'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 1MB로 증가 (큰 청크 경고 임계값)
    commonjsOptions: {
      include: [/html2pdf\.js/, /node_modules/],
    },
  },
})
