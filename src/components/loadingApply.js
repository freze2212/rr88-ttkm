import React from 'react';

const LoadingApply = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-white bg-opacity-80">
      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg sm:text-xl md:text-2xl text-blue-400 font-extrabold tracking-wide shadow-lg text-center px-4 sm:px-6 wave-animation">
        Đang lấy danh sách khuyến mãi hợp lệ...
      </p>

      {/* Thêm CSS trực tiếp vào đây */}
      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .wave-animation {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingApply;