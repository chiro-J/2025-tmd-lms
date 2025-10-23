// 공통 스타일 클래스
export const COMMON_STYLES = {
  // 버튼 스타일
  button: {
    base: 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm hover:shadow-md',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg',
  },
  
  // 카드 스타일
  card: {
    base: 'bg-white rounded-2xl shadow-sm border border-gray-200 transition-all duration-200',
    hover: 'hover:shadow-lg hover:border-gray-300',
    interactive: 'cursor-pointer hover:shadow-lg hover:border-gray-300 transform hover:scale-[1.02]',
  },
  
  // 입력 필드 스타일
  input: {
    base: 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    error: 'border-red-300 focus:ring-red-500',
    success: 'border-green-300 focus:ring-green-500',
  },
  
  // 탭 스타일
  tab: {
    base: 'px-4 py-2 text-sm font-medium transition-colors',
    active: 'bg-white text-blue-600 shadow-sm',
    inactive: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
  },
  
  // 모달 스타일
  modal: {
    backdrop: 'fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300',
    content: 'bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-4',
    header: 'px-6 py-4 border-b border-gray-200',
    body: 'px-6 py-4',
    footer: 'px-6 py-4 border-t border-gray-200 flex justify-end space-x-3',
  },
} as const

// 애니메이션 클래스
export const ANIMATIONS = {
  fadeIn: 'animate-in fade-in duration-200',
  slideIn: 'animate-in slide-in-from-bottom-4 duration-200',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
} as const
