import React from 'react';
import styled, { keyframes } from 'styled-components';

// Định nghĩa keyframe cho animation
const spin = keyframes`
  0%, 100% {
    box-shadow: 0.2em 0px 0 0px currentcolor;
  }
  12% {
    box-shadow: 0.2em 0.2em 0 0 currentcolor;
  }
  25% {
    box-shadow: 0 0.2em 0 0px currentcolor;
  }
  37% {
    box-shadow: -0.2em 0.2em 0 0 currentcolor;
  }
  50% {
    box-shadow: -0.2em 0 0 0 currentcolor;
  }
  62% {
    box-shadow: -0.2em -0.2em 0 0 currentcolor;
  }
  75% {
    box-shadow: 0px -0.2em 0 0 currentcolor;
  }
  87% {
    box-shadow: 0.2em -0.2em 0 0 currentcolor;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const enlarge = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled component cho Loader
const LoaderWrapper = styled.div`
  transform: rotateZ(45deg);
  perspective: 1000px;
  border-radius: 50%;
  width: 100px;  // Tăng kích thước của spinner
  height: 100px; // Tăng kích thước của spinner
  color: #fff;
  position: relative;
  margin: 0 auto;
  animation: ${fadeIn} 1s ease-out, ${enlarge} 1s ease-out;  // Hiệu ứng fade-in và phóng to
`;

const LoaderBeforeAfter = styled.div`
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: inherit;
  height: inherit;
  border-radius: 50%;
  transform: rotateX(70deg);
  animation: ${spin} 1s linear infinite;
`;

const LoaderAfter = styled(LoaderBeforeAfter)`
  color:rgb(24, 137, 243);
  transform: rotateY(70deg);
  animation-delay: 0.4s;
`;

// Wrapper container cho toàn bộ màn hình với Flexbox
const CenteredWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;  // Chiếm toàn bộ chiều cao màn hình
  background-color:rgb(255, 255, 255); // Màu nền (có thể thay đổi)
`;

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/15 backdrop-blur-md z-50">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
