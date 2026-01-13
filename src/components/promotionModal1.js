import React from "react";

const adjustPaddingInBody = (html) => {
  // Thay thế "padding: 20px" thành "padding: 0px" chỉ cho phần tử đầu tiên
  const updatedHtml = html.replace(/padding:\s*20px;/, 'padding: 0px;');
  return updatedHtml;
};
const adjustRemInContent = (html) => {
  // Xóa padding: 0.34rem; chỉ cho phần tử đầu tiên
  const updatedHtml = html.replace(/padding:\s*20px;/, 'padding: 0px;');

  // Tìm các giá trị rem trong nội dung và nhân với 3
  const updatedHtmlMB = updatedHtml.replace(/(\d*\.?\d+)rem/g, (match, value) => {
    const newValue = parseFloat(value) * 3; // Nhân giá trị rem với 3
    return `${newValue}rem`;  // Trả về giá trị đã thay đổi
  });

  return updatedHtmlMB;
};

const PromotionModal1 = ({ isOpen, onClose, promotion }) => {
  if (!isOpen) return null;
  const adjustedContent = adjustPaddingInBody(promotion.content);
  const adjustedContenMB = adjustRemInContent(promotion.content);
  console.log(adjustedContenMB)
  return (
    <>
    <div 
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-3/4 relative md:block hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-0 right-1 text-gray-600 hover:text-gray-900 font-bold text-2xl"
          onClick={onClose}
        >
          X
        </button>
        
        <div 
          style={{
            maxHeight: '70vh',  // Giới hạn chiều cao của nội dung
            overflowY: 'auto',  // Thêm cuộn dọc nếu nội dung dài
          }} 
          dangerouslySetInnerHTML={{ __html: adjustedContent }} 
        />
      </div>
      {/* Mobile */}
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 relative flex flex-col items-center md:hidden block"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-0 right-1 text-gray-600 hover:text-gray-900 font-bold text-2xl"
          onClick={onClose}
        >
          X
        </button>

        <div 
          style={{
            maxHeight: '70vh',  // Giới hạn chiều cao của nội dung
            overflowY: 'auto',  // Thêm cuộn dọc nếu nội dung dài
          }} 
          dangerouslySetInnerHTML={{ __html: adjustedContenMB }} 
        />
      </div>
    </div>
  </>  
    
  );
};

export default PromotionModal1;
