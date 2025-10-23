import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EnrollBannerProps {
  bgImage?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onSubmit?: (code: string) => void;
}

export default function EnrollBanner({
  bgImage = '/photo/aaa.jpg',
  title = 'LMS 테스트 페이지',
  subtitle = '수강코드를 입력하여 강의에 참여',
  buttonText = '수강코드 입력',
  onSubmit
}: EnrollBannerProps) {
  const [code, setCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit?.(code.trim());
      console.log('입력된 코드:', code.trim());
      setIsModalOpen(false);
      setCode('');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCode('');
  };

  return (
    <>
      <div className="relative w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        
        {/* Dark Overlay with Gradient */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16 xl:px-20 py-16 sm:py-20 md:py-24">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Side - Text Content (moved right) */}
              <div className="space-y-6 animate-fade-in lg:ml-16">
                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white leading-tight">
                  {title}
                </h1>
                
                {/* Subtitle */}
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                  {subtitle}
                </p>
                
                {/* CTA Button */}
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <button
                    onClick={openModal}
                    className="px-8 py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <span>{buttonText}</span>
                  </button>
                </div>
              </div>
              
              {/* Right Side - Empty Space (for visual balance) */}
              <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {/* This space is intentionally left empty for visual balance */}
                <div className="h-64 lg:h-80 flex items-center justify-center">
                  <div className="text-white/20 text-4xl font-light">
                    {/* Optional: Add a subtle visual element here if needed */}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Modal Content */}
            <div className="space-y-4">
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">수강 코드 입력</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">강좌 수강 코드 입력</label>
                  <input
                    id="modal-course-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="코드를 입력해주세요."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    수강 코드를 받지 못한 경우 담당 교수/강의자에게 문의해주시기 바랍니다.
                  </p>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={!code.trim()}
                    className="px-3 py-1.5 text-xs bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    완료
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}