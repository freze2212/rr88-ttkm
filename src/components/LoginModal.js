import React, { useState } from "react";
import { loginMember } from "../services/videoService";
import axiosInstance from "../services/axios_client";
import popupLoginBg from "../assets/popup-Login.png";

const LoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [cardNumber, setCardNumber] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCardNumberChange = (index, value) => {
    // Chỉ cho phép số và tối đa 1 ký tự
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newCardNumber = [...cardNumber];
    newCardNumber[index] = value;
    setCardNumber(newCardNumber);

    // Tự động focus vào ô tiếp theo
    if (value && index < 3) {
      const nextInput = document.getElementById(`card-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleCardNumberKeyDown = (index, e) => {
    // Xử lý Backspace để quay lại ô trước
    if (e.key === "Backspace" && !cardNumber[index] && index > 0) {
      const prevInput = document.getElementById(`card-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleCardNumberPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    const newCardNumber = ["", "", "", ""];
    pastedData.split("").forEach((char, index) => {
      if (index < 4) newCardNumber[index] = char;
    });
    setCardNumber(newCardNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Chuẩn bị data cho API - chỉ cần username và cardNumber
      const cardNumberStr = cardNumber.join("");
      
      // Gọi API login
      const response = await loginMember({
        username,
        cardNumber: cardNumberStr,
      });
      
      if (response.statusCode === 200) {
        // Lưu accessToken vào localStorage
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Cập nhật axios instance để thêm token vào header cho các request sau
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        
        // Đóng modal
        onClose();
        
        // Có thể thêm toast notification thành công
        // toast.success("Đăng nhập thành công!");
        
        // Refresh trang để cập nhật UI
        window.location.reload();
      }
    } catch (error) {
      console.error("Login error:", error);
      // Hiển thị lỗi cho người dùng
      alert(error?.response?.data?.message || error?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md md:max-w-lg lg:max-w-xl scale-100 md:scale-100 mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={popupLoginBg}
          alt="Login Popup"
          className="w-full h-auto"
        />
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors text-2xl font-bold z-10"
        >
          ×
        </button>

        {/* Form - đặt ở vị trí phù hợp với ảnh nền */}
        <form onSubmit={handleSubmit} className="absolute inset-0 flex flex-col justify-center items-center p-6 sm:p-8 pt-32 sm:pt-[12rem] pb-2 sm:pb-10">
          {/* Username input */}
          <div className="relative w-[400px] h-[48px] scale-75 md:scale-100">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập Tên Đăng Nhập"
              className="w-full h-full pl-10 pr-4 bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 4 số cuối tài khoản ngân hàng */}
          <div className="mb-2 md:mb-4 scale-[0.85] md:scale-100">
            <div className="mt-1 md:mt-3 text-center text-white text-[14px] md:text-[15px] font-semibold drop-shadow">
              4 số cuối tài khoản ngân hàng
            </div>
            <div className="flex gap-2 justify-center mt-1 md:mt-2">
              {cardNumber.map((digit, index) => (
                <input
                  key={index}
                  id={`card-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCardNumberChange(index, e.target.value)}
                  onKeyDown={(e) => handleCardNumberKeyDown(index, e)}
                  onPaste={handleCardNumberPaste}
                  className="w-[38px] h-[38px] md:w-[46px] md:h-[46px] text-center text-[18px] font-extrabold rounded-[10px] bg-white text-[#1B1B1B] border border-[#F4DB8D] focus:outline-none"
                  required
                />
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 md:mt-4 h-[40px] w-[160px] md:w-[180px] rounded-full text-white font-extrabold bg-gradient-to-b from-[#2EA1FF] to-[#0D6BFF] shadow-[0_8px_16px_rgba(0,0,0,0.3)] disabled:opacity-70 active:scale-95 transition-transform"
          >
            {isLoading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

