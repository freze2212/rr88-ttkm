import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineCheckCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoMdCloseCircle } from 'react-icons/io';
import CryptoJS from "crypto-js";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";

// Tạo component CSKHNote để tái sử dụng
const CSKHNote = () => (
  <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 italic px-1">
    * Vui lòng {' '}
    <a 
      href="https://cskhrr88.pages.dev" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="text-blue-600 hover:text-blue-800 underline"
    >
      liên hệ CSKH
    </a>
    {' '}nếu cần thêm thông tin
  </div>
);

const ListPromotionModal = ({ isOpen, onClose, promotions, username }) => {
  const [receivedPromotions, setReceivedPromotions] = useState(new Set());
  const [submittedPromotions, setSubmittedPromotions] = useState(new Set());
  const [loadingPromotions, setLoadingPromotions] = useState(new Set());
  const [failedPromotions, setFailedPromotions] = useState(new Set());
  const [depositClaimed, setDepositClaimed] = useState(false); // Theo dõi trạng thái nhận khuyến mãi deposit
  const manualPromoCodes = ["BH03", "ND188", "ND01", "APP108"];
  const [smsInfo, setSmsInfo] = useState({ phoneNumber: '', smsCode: '', promoCode: '' });
  const [showSMSGuide, setShowSMSGuide] = useState(false); // Thêm state mới

  useEffect(() => {
    if (!isOpen) {
      setReceivedPromotions(new Set());
      setSubmittedPromotions(new Set());
      setDepositClaimed(false);
      setSmsInfo({ phoneNumber: '', smsCode: '', promoCode: '' });
      setShowSMSGuide(false);
      setFailedPromotions(new Set());
    }
  }, [isOpen]);

  const handleApplyPromotion = async (promoCode) => {
    setLoadingPromotions(prev => new Set(prev).add(promoCode));
    setFailedPromotions(prev => {
      const newSet = new Set(prev);
      newSet.delete(promoCode);
      return newSet;
    });

    try {
      let fingerprint;
      // Lấy fingerprint cho ND188, ND01 và KM58
      if (promoCode === 'ND188' || promoCode === 'ND01' || promoCode === 'KM58' || promoCode === 'USDT-ND' || promoCode === 'KM100' || promoCode === 'N01'|| promoCode === 'N02' || promoCode === 'N03') {
        try {
          const fp = await FingerprintJS.load({
            apiKey: process.env.REACT_APP_FINGERPRINT_API_KEY
          });
          const result = await fp.get();
          fingerprint = result.visitorId;
          
          if (!fingerprint) {
            toast.error("Không thể xác thực thiết bị. Vui lòng thử lại sau.");
            return false;
          }
        } catch (fpError) {
          console.error("Lỗi khi lấy FingerprintJS:", fpError);
          toast.error("Không thể xác thực thiết bị. Vui lòng thử lại sau.");
          return false;
        }
      }

      const payload = {
        promotions: [promoCode],
        username: username.toLowerCase(),
      };

      const secretKey = 'RR882024RR88';
      const encryptedPayload = CryptoJS.AES.encrypt(JSON.stringify(payload), secretKey).toString();

      // Kiểm tra nếu là khuyến mãi yêu cầu xác thực và không có fingerprint
      if ((promoCode === 'ND188' || promoCode === 'ND01' || promoCode === 'KM58' || promoCode === 'USDT-ND' || promoCode === 'KM100' || promoCode === 'N01'|| promoCode === 'N02' || promoCode === 'N03') && !fingerprint) {
        toast.error("Không thể xác thực thiết bị. Vui lòng thử lại sau.");
        return false;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/promotion/apply`,
        { data: encryptedPayload },
        {
          headers: {
            ...(fingerprint && { 'X-Fingerprint': fingerprint }),
          },
        }
      );

      if (response.data.statusCode === 200) {
        // Chỉ lấy thông tin SMS cho các khuyến mãi cần xác thực SMS
        if (promoCode === 'KM58' || promoCode === 'ND188' || promoCode === 'KM100' || promoCode === 'N01') {
          try {
            const smsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/promotion/code/${username}/${promoCode}`);
            if (smsResponse.data.statusCode === 200) {
              setSmsInfo({
                smsCode: smsResponse.data.data.smsCode,
                phoneNumber: smsResponse.data.data.phoneNumber,
                promoCode: promoCode
              });
              setShowSMSGuide(true);
            }
          } catch (smsError) {
            console.error("Lỗi khi lấy thông tin SMS:", smsError);
          }
        }

        toast.success(response.data.message || `Thành công!`);
        return true;
      } else {
        setFailedPromotions(prev => new Set(prev).add(promoCode));
        toast.error(response.data.message || `Lỗi khi nhận khuyến mãi ${promoCode}.`);
        return false;
      }
    } catch (error) {
      setFailedPromotions(prev => new Set(prev).add(promoCode));
      toast.error("Lỗi kết nối, vui lòng thử lại.");
      return false;
    } finally {
      setLoadingPromotions(prev => {
        const newSet = new Set(prev);
        newSet.delete(promoCode);
        return newSet;
      });
    }
  };
  
  const handleClaim = async (promoCode, category) => {
    try {
      const success = await handleApplyPromotion(promoCode);
      if (success) {
        setReceivedPromotions((prevState) => new Set(prevState.add(promoCode)));
        // Nếu khuyến mãi thuộc category "deposit", vô hiệu hóa các khuyến mãi cùng category
        if (category === "deposit") {
          setDepositClaimed(true);
        }
      }
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  };

  const handleApprovalSubmit = async (promoCode, category) => {
    try {
      const success = await handleApplyPromotion(promoCode);
      if (success) {
        setSubmittedPromotions((prev) => new Set(prev).add(promoCode));
        if (category === "deposit") {
          setDepositClaimed(true);
        }
      }
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  };

  // Thêm hàm kiểm tra xem có promotion nào đang loading không
  const isAnyPromotionLoading = loadingPromotions.size > 0;

  // Thêm hàm xử lý copy
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Đã sao chép vào clipboard');
      })
      .catch(() => {
        toast.error('Không thể sao chép. Vui lòng thử lại');
      });
  };

  // Thêm hàm để gọi API lấy thông tin SMS
  const getSMSInfo = async (username, promoCode) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/promotion/code/${username}/${promoCode}`);
      if (response.data.statusCode === 200) {  // Kiểm tra statusCode
        setSmsInfo({
          smsCode: response.data.data.smsCode,      // Lấy từ response.data.data
          phoneNumber: response.data.data.phoneNumber, // Lấy từ response.data.data
          promoCode: promoCode
        });
        setShowSMSGuide(true);
        toast.success(response.data.message || "Đã lấy thông tin SMS thành công!");
      }
    } catch (error) {
      toast.error("Không thể lấy thông tin SMS. Vui lòng thử lại sau.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-2xl"
          onClick={onClose}
        >
          X
        </button>

        {/* Điều kiện hiển thị mới */}
        {showSMSGuide && smsInfo.phoneNumber && smsInfo.smsCode ? (
          <div className="p-2 sm:p-4">
            <h2 className="text-lg sm:text-xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
              Thông Tin Xác Thực
            </h2>
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-3 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {/* Bước 1 */}
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-blue-100 shadow-sm">
                  <p className="text-gray-700 mb-2 text-sm sm:text-base">
                    <span className="font-medium">Bước 1:</span> Soạn tin nhắn với nội dung
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-blue-50 p-2 sm:p-3 rounded text-center break-all">
                      <p className="text-blue-600 font-bold text-base sm:text-lg select-all">
                        {smsInfo.smsCode}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(smsInfo.smsCode)}
                      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 
                      transition-colors flex items-center justify-center min-w-[40px] sm:min-w-[60px]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Bước 2 */}
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-blue-100 shadow-sm">
                  <p className="text-gray-700 mb-2 text-sm sm:text-base">
                    <span className="font-medium">Bước 2:</span> Gửi đến số điện thoại
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-blue-50 p-2 sm:p-3 rounded text-center">
                      <p className="text-blue-600 font-bold text-base sm:text-lg select-all">
                        {smsInfo.phoneNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(smsInfo.phoneNumber)}
                      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 
                      transition-colors flex items-center justify-center min-w-[40px] sm:min-w-[60px]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Nút gửi tin nhắn - Chỉ hiển thị trên mobile */}
                <div className="block sm:hidden">
                  <a
                    href={`sms:${smsInfo.phoneNumber}?&body=${smsInfo.smsCode}`}
                    className="w-full bg-white border-2 border-blue-500 
                    text-blue-600 py-3.5 px-4 rounded-lg 
                    transition-all duration-200 ease-in-out
                    flex items-center justify-center space-x-3
                    font-semibold text-base shadow-sm
                    active:scale-[0.98] active:shadow-inner
                    relative overflow-hidden group"
                  >
                    <div className="flex items-center justify-center space-x-2 relative z-10">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="tracking-wide">Gửi tin nhắn ngay</span>
                    </div>
                    <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-active:scale-x-100 transition-transform origin-left"></div>
                    <div className="absolute inset-0 bg-blue-100 opacity-0 group-active:opacity-20 transition-opacity"></div>
                  </a>
                </div>

                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 italic px-1">
                  * Vui lòng {' '}
                  <a 
                    href="https://cskhrr88.pages.dev" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    liên hệ CSKH
                  </a>
                  {' '}nếu cần thêm thông tin
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Kiểm tra nếu không có promotion nào */}
            {!promotions || promotions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-center text-gray-600 font-medium text-lg">
                  Hiện tại không có khuyến mãi nào đủ điều kiện nhận, vui lòng thử lại sau.
                </p>
                <CSKHNote />
              </div>
            ) : (
              <>
                {/* Kiểm tra có khuyến mãi hợp lệ không */}
                {promotions.filter(promo => !promo.isRejected).length === 0 ? (
                  <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-red-600 mb-4">
                      Khuyến mãi không khả dụng
                    </h3>
                    <div className="space-y-3">
                      {promotions.filter(promo => promo.isRejected).map((promo) => (
                        <div 
                          key={promo.code} 
                          className="bg-white p-4 rounded-lg border border-red-100 shadow-sm"
                        >
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-start">
                              <span className="text-gray-700 font-medium w-24">Mã KM:</span>
                              <span className="text-gray-900 font-semibold">{promo.code}</span>
                            </div>
                            <div className="flex items-start">
                              <span className="text-gray-700 font-medium w-24">Tên KM:</span>
                              <span className="text-gray-900">{promo.name}</span>
                            </div>
                            <div className="flex items-start">
                              <span className="text-gray-700 font-medium w-24">Lý do:</span>
                              <span className="text-red-600 flex-1">{promo.rejectReason}</span>
                            </div>
                            {/* Cập nhật phần nút */}
                             {promo.rejectReason?.includes("chưa gửi sms xác thực") && (() => {
                              const promoCode =
                                promo.rejectReason?.match(/khuyến mãi\s+([A-Z0-9]+)/i)?.[1] || promo.code;

                              return (
                                <div className="mt-3">
                                  {!smsInfo.smsCode && promoCode && (
                                    <button
                                      onClick={() => getSMSInfo(username, promoCode)}
                                      className="text-red-600 hover:text-red-800 font-medium underline 
                                      transition-colors duration-200 text-sm"
                                    >
                                      Lấy thông tin SMS
                                    </button>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <table className="w-full border border-gray-200 rounded-lg shadow-lg table-fixed">
                      <thead>
                        <tr className="bg-gray-100 text-left">
                          <th className="p-3 border-b text-sm sm:text-base min-w-[120px]">Mã</th>
                          <th className="p-3 border-b text-sm sm:text-base min-w-[200px]">Tên Khuyến mãi</th>
                          <th className="p-3 border-b text-sm sm:text-base text-center min-w-[120px]">Điểm thưởng</th>
                          <th className="p-3 border-b text-sm sm:text-base text-center min-w-[120px]">Nhận thưởng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promotions.filter(promo => !promo.isRejected).map((promo) => (
                          <tr key={promo.code} className="border-b hover:bg-gray-100 transition text-gray-900">
                            <td className="p-3 text-sm sm:text-base break-words">{promo.code}</td>
                            <td className="p-3 text-sm sm:text-base">{promo.name}</td>
                            <td className="p-3 text-sm sm:text-base text-center text-green-500 font-semibold">
                              {promo.reward}
                            </td>
                            <td className="p-3 text-sm sm:text-base text-center">
                              {receivedPromotions.has(promo.code) ? (
                                <div className="flex items-center justify-center text-green-500">
                                  <AiOutlineCheckCircle className="mr-2 text-lg" /> Đã nhận
                                </div>
                              ) : submittedPromotions.has(promo.code) ? (
                                <div className="flex items-center justify-center text-yellow-500">
                                  <AiOutlineCheckCircle className="mr-2 text-lg" /> Đã gửi
                                </div>
                              ) : failedPromotions.has(promo.code) ? (
                                <div className="flex items-center justify-center text-red-500">
                                  <IoMdCloseCircle className="mr-2 text-lg" /> Không thành công
                                </div>
                              ) : (
                                <button
                                  onClick={async () => {
                                    if (promo.approval === "manual") {
                                      await handleApprovalSubmit(promo.code, promo.category);
                                    } else {
                                      await handleClaim(promo.code, promo.category);
                                    }
                                  }}
                                  className={`bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-xs sm:text-sm ${
                                    (promo.category === "deposit" && depositClaimed) || 
                                    (isAnyPromotionLoading && !loadingPromotions.has(promo.code)) ? 
                                    "opacity-50 cursor-not-allowed bg-gray-400" : ""
                                  } flex items-center justify-center min-w-[80px]`}
                                  disabled={
                                    (promo.category === "deposit" && depositClaimed) || 
                                    loadingPromotions.has(promo.code) ||
                                    (isAnyPromotionLoading && !loadingPromotions.has(promo.code))
                                  }
                                >
                                  {loadingPromotions.has(promo.code) ? (
                                    <div className="flex items-center justify-center">
                                      <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                                      <span>Đang xử lý...</span>
                                    </div>
                                  ) : (
                                    promo.approval === "manual" ? "Đăng ký" : "Nhận"
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Vẫn hiển thị khuyến mãi bị từ chối nếu có */}
                    {promotions.some(promo => promo.isRejected) && (
                      <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4">
                        <h3 className="text-xl font-semibold text-red-600 mb-4">
                          Khuyến mãi không khả dụng
                        </h3>
                        <div className="space-y-3">
                          {promotions.filter(promo => promo.isRejected).map((promo) => (
                            <div 
                              key={promo.code} 
                              className="bg-white p-4 rounded-lg border border-red-100 shadow-sm"
                            >
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-start">
                                  <span className="text-gray-700 font-medium w-24">Mã KM:</span>
                                  <span className="text-gray-900 font-semibold">{promo.code}</span>
                                </div>
                                <div className="flex items-start">
                                  <span className="text-gray-700 font-medium w-24">Tên KM:</span>
                                  <span className="text-gray-900">{promo.name}</span>
                                </div>
                                <div className="flex items-start">
                                  <span className="text-gray-700 font-medium w-24">Lý do:</span>
                                  <span className="text-red-600 flex-1">{promo.rejectReason}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hiển thị lưu ý về ND188 và ND01 */}
                    {promotions.some((promo) => promo.code === "ND188" && !promo.isRejected) &&
                      promotions.some((promo) => promo.code === "ND01" && !promo.isRejected) && (
                        <div className="mt-4">
                          <p className="text-red-500 text-sm font-semibold">
                            * Khuyến mãi nạp đầu chỉ được nhận một trong hai khuyến mãi.
                          </p>
                        </div>
                    )}

                    {/* Thêm CSKHNote một lần duy nhất ở cuối */}
                    <div className="mt-4">
                      <CSKHNote />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListPromotionModal;
