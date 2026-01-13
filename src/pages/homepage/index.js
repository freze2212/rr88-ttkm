import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'aos/dist/aos.css';
import { toast } from "react-toastify";
import axios from 'axios';
import Footer from "../../components/footer";
import PromotionModal1 from '../../components/promotionModal1';
import ListPromotionModal from '../../components/listPromotionModal';
import styles from './style.module.css'; 
import Loader from '../../components/loading';
import LoadingApply from '../../components/loadingApply';
import CryptoJS from "crypto-js";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";


const HomePage = () => {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState('promotions');
    const [username, setUsername] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [captchaId, setCaptchaId] = useState("");
    const [captchaSvg, setCaptchaSvg] = useState("");
    const [promotions, setPromotions] = useState(null);
    const [listPromotions, setListPromotions] = useState(null);
    const [promotionsMB, setPromotionsMB] = useState(null);
    const [promotion, setPromotion] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openListPromotionModal, setOpenListPromotionModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingApply, setLoadingApply] = useState(false);
    const [visibleCount, setVisibleCount] = useState(4);
    const [loadedImages, setLoadedImages] = useState({})
    const [showForbiddenModal, setShowForbiddenModal] = useState(false);

    const secretKey = 'RR882024RR88';
    useEffect(() => {
        fetchCaptcha();
        fetchPromotionMB();
        fetchPromotion();
        setLoading(true)
      }, []);
      const fetchCaptcha = async () => {
        try {
            // const fp = await FingerprintJS.load();
            // const result = await fp.get();

            // const fingerprint = result.visitorId;
        
            const response = await fetch(`${process.env.REACT_APP_API_URL}/captcha`, {
              method: 'GET', 
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const data = await response.json();
        
            if (data.statusCode === 200) {
              setCaptchaId(data.data.captchaId);
              setCaptchaSvg(data.data.captcha);
            } else {
              toast.error("Không thể tải Captcha");
            }
          } catch (error) {
            toast.error("Lỗi tải Captcha");
          }
    };
    
    const encryptData = (data) => {
        return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
      };

    const fetchPromotion = async () => {
        setLoading(true);
        const loadingTimeout = setTimeout(() => setLoading(false), 3000);

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/promotion`);
            setPromotions(response.data.data.promotion);
            setLoading(false);
            clearTimeout(loadingTimeout);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const fetchPromotionMB = async () => {
        const loadingTimeout = setTimeout(() => setLoading(false), 3000);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/promotion?platform=M`);
            setPromotionsMB(response.data.data.promotion);
            setLoading(false);
            clearTimeout(loadingTimeout);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const checkUsername = async () => {
        if (!username.trim() || !captcha.trim()) {
            toast.warn("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        try {
            setLoadingApply(true);
            const fingerprint = sessionStorage.getItem("fp");
    
            // Mã hóa payload
            const encryptedPayload = encryptData({
                username: username.toLowerCase(),
                captcha,
                captchaId,
            });
    
            const response = await fetch(`${process.env.REACT_APP_API_URL}/promotion/check`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    "X-Fingerprint": fingerprint, 
                },
                body: JSON.stringify({ data: encryptedPayload }), // Gửi payload đã mã hóa
            });
    
            const data = await response.json();
            if (data.statusCode === 200) {
                setOpenListPromotionModal(true);
                setListPromotions(data.data.promotions);
            } else if (data.statusCode === 403) {
                setShowForbiddenModal(true); // Mở modal cảnh báo
            } else {
                toast.error(data?.message || "Có lỗi xảy ra!");
            }
            fetchCaptcha();
            setLoadingApply(false);
        } catch (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    const clickPromotion = (promotion) => {
        setPromotion(promotion);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    const closeListPromotionModal = () => {
        setOpenListPromotionModal(false);
    };

    const loadMore = () => {
        setVisibleCount((prev) => prev + 99); 
      };

      const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }));
      };

    return (
        <>
            {loading && <Loader />}
            {loadingApply && <LoadingApply/>}
            <div className="min-h-screen flex flex-col md:block hidden">
                {/* Desktop wrapper: header + body chung một background */}
                <div 
                    className="flex-1 flex flex-col relative"
                    style={{
                        backgroundColor: '#000103'
                    }}
                >
                    {/* Video background - chỉ hiển thị đúng kích thước */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute top-0 left-0 w-full z-0"
                        style={{ 
                            pointerEvents: 'none',
                            objectFit: 'cover',
                            height: '100vh',
                            maxHeight: '100vh'
                        }}
                    >
                        <source src="/bg-pc.mp4" type="video/mp4" />
                    </video>
                    {/* Overlay gradient */}
                    <div 
                        className="absolute top-0 left-0 w-full z-0"
                        style={{
                            height: '100vh',
                            pointerEvents: 'none'
                        }}
                    />
                    {/* Header */}
                    <div className="p-4 flex flex-col items-center justify-between relative z-10">
                        <div className="relative w-full flex flex-col items-center p-0">
                            <button
                                onClick={() => {
                                    if (window.history.length > 1) {
                                        const previousUrl = document.referrer;
                                        if (previousUrl.includes('rr')) {
                                            window.history.back();
                                        } else {
                                            window.location.href = "https://rr311.com";
                                        }
                                    } else {
                                        window.location.href = "https://rr311.com";
                                    }
                                }}
                                className="absolute top-4 left-4 transition-all duration-300 hover:scale-105"
                                style={{
                                    padding: 0,
                                    border: "none",
                                    background: "none",
                                }}
                            >
                                <img
                                    src="/btn-home.webp"
                                    alt="Về trang chủ"
                                    style={{
                                        display: "block",
                                        width: "160px",
                                        height: "auto",
                                    }}
                                />
                            </button>
                        </div>
                        <img 
                            src="/logo.webp" 
                            alt="Logo" 
                            className={`${styles.logo} ${styles.fadeIn}`} 
                        />
                        <div className="w-16" />
                        {/* Hình ảnh tiêu đề */}
                        <div className="w-full flex justify-center items-center">
                            <div 
                                className="flex-grow flex flex-col items-center text-gray-700 bg-opacity-75 pt-10 rounded-xl"
                                style={{ 
                                    backgroundImage: "url('/bg-modal.webp')", 
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    width: "100%",
                                    maxWidth: "1520px",
                                    height: "408px",
                                }}
                            >
                                <img src="/title-modal.webp" alt="Tittle" className="w-auto max-h-[102px] max-w-full mt-4" />
                                {/* Form username + captcha */}
                                <div className="py-4 px-0 flex items-center justify-center rounded-lg mt-10 w-full max-w-[1375px] mx-auto gap-8">
                                    {/* Cột 1: Username */}
                                    <div className="flex flex-col flex-1 max-w-full">
                                        <span 
                                            className="font-bold text-[#f4db8d] mb-2 w-full text-center" 
                                            style={{ fontSize: 33 }}
                                        >
                                            Vui lòng nhập tên tài khoản
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Nhập Tên tài khoản"
                                            className="w-full"
                                            style={{
                                                width: 520,
                                                height: 71,
                                                paddingLeft: 32,
                                                paddingRight: 16,
                                                borderRadius: 9999,
                                                border: "none",
                                                outline: "none",
                                                background: "#f5f9ff",
                                                fontSize: 22,
                                                textAlign: "left",
                                            }}
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    {/* Cột 2: Captcha */}
                                    <div className="flex flex-col flex-1 max-w-md">
                                        <span 
                                            className="font-bold text-[#f4db8d] mb-2 w-full text-center" 
                                            style={{ fontSize: 33 }}
                                        >
                                            Nhập mã CAPTCHA
                                        </span>
                                        <div className="relative w-full flex items-center">
                                            <input
                                                type="text"
                                                placeholder="Nhập Captcha"
                                                className="w-full"
                                                style={{
                                                    width: 520,
                                                    height: 71,
                                                    paddingLeft: 32,
                                                    paddingRight: 120,
                                                    borderRadius: 9999,
                                                    border: "none",
                                                    outline: "none",
                                                    background: "#f5f9ff",
                                                    fontSize: 22,
                                                    textAlign: "left",
                                                }}
                                                value={captcha}
                                                onChange={(e) => setCaptcha(e.target.value)}
                                            />
                                            {captchaSvg && (
                                                <div
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer select-none"
                                                    style={{ minWidth: 70, height: 30, display: "flex", alignItems: "center" }}
                                                    dangerouslySetInnerHTML={{ __html: captchaSvg }}
                                                    onClick={fetchCaptcha}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {/* Cột 3: Button xác nhận */}
                                    <div className="flex items-end h-full pt-8">
                                        <button
                                            onClick={checkUsername}
                                            style={{ background: "none", border: "none", padding: 0, outline: "none" }}
                                            className="group focus:outline-none"
                                        >
                                            <img
                                                src="/btn-accept.webp"
                                                alt="Xác nhận"
                                                style={{ width: 325, height: 71, objectFit: "contain", display: "block" }}
                                                className="transition-all group-hover:scale-105"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="w-full flex flex-col items-center p-4 relative z-10">
                    {/* Khối input và button */}
                    <div className="w-8/12 mt-8 grid grid-cols-3 grid-rows-2 gap-4 sm:grid-cols-3 sm:grid-rows-2">
                        {/* Button 1 */}
                        <button
                            className={`flex items-center justify-center rounded-full border border-gray-400 transition-all
                                font-bold uppercase
                                ${activeButton === 'promotions'
                                    ? 'text-white bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]'
                                    : 'text-black bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]'
                                }
                            `}
                            style={{
                                fontFamily: 'SVN-Aptima, sans-serif',
                                fontWeight: 700,
                                fontSize: '21px',
                                lineHeight: '1.25',
                                letterSpacing: '-2%',
                                height: 72,
                                width: 398,
                                maxWidth: '100%',
                                color: '#fff',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                            onClick={() => setActiveButton('promotions')}
                        >
                            Khuyến mãi hot
                        </button>
                        {/* Button 2 */}
                        <button
                            className={`flex items-center justify-center rounded-full border border-gray-400 transition-all
                                font-bold uppercase
                                ${activeButton === 'conditions'
                                    ? 'text-white bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]'
                                    : 'text-black bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]'
                                }
                            `}
                            style={{
                                fontFamily: 'SVN-Aptima, sans-serif',
                                fontWeight: 700,
                                fontSize: '21px',
                                lineHeight: '1.25',
                                letterSpacing: '-2%',
                                height: 72,
                                width: 398,
                                maxWidth: '100%',
                                color: '#fff',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                            onClick={() => navigate('/video-su-kien')}
                        >
                            VIDEO SỰ KIỆN
                        </button>
                        {/* Button 3 */}
                        <button
                            className={`flex items-center justify-center rounded-full border border-gray-400 transition-all
                                font-bold uppercase
                                ${activeButton === 'inputcode'
                                    ? 'text-white bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]'
                                    : 'text-black bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]'
                                }
                            `}
                            style={{
                                fontFamily: 'SVN-Aptima, sans-serif',
                                fontWeight: 700,
                                fontSize: '21px',
                                lineHeight: '1.25',
                                letterSpacing: '-2%',
                                height: 72,
                                width: 398,
                                maxWidth: '100%',
                                color: '#fff',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                            onClick={() => setActiveButton('inputcode')}
                        >
                            NHẬP CODE
                        </button>
                        {/* Button 4 */}
                        <button
                            className={`flex items-center justify-center rounded-full border border-gray-400 transition-all
                                font-bold uppercase
                                ${activeButton === 'receiveCode'
                                    ? 'text-white bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]'
                                    : 'text-black bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]'
                                }
                            `}
                            style={{
                                fontFamily: 'SVN-Aptima, sans-serif',
                                fontWeight: 700,
                                fontSize: '21px',
                                lineHeight: '1.25',
                                letterSpacing: '-2%',
                                height: 72,
                                width: 398,
                                maxWidth: '100%',
                                color: '#fff',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                            onClick={() => setActiveButton('receiveCode')}
                        >
                            NHẬN MÃ DỰ THƯỞNG
                        </button>
                        {/* Button 5 */}
                        <button
                            className={`flex items-center justify-center rounded-full border border-gray-400 transition-all
                                font-bold uppercase
                                ${activeButton === 'charity'
                                    ? 'text-white bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]'
                                    : 'text-black bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]'
                                }
                            `}
                            style={{
                                fontFamily: 'SVN-Aptima, sans-serif',
                                fontWeight: 700,
                                fontSize: '21px',
                                lineHeight: '1.25',
                                letterSpacing: '-2%',
                                height: 72,
                                width: 398,
                                maxWidth: '100%',
                                color: '#fff',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                            onClick={() => setActiveButton('charity')}
                        >
                            THIỆN NGUYỆN
                        </button>
                        {/* Button 6 */}
                        <button
                            className={`flex items-center justify-center rounded-full border border-gray-400 transition-all
                                font-bold uppercase
                                ${activeButton === 'live'
                                    ? 'text-white bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]'
                                    : 'text-black bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]'
                                }
                            `}
                            style={{
                                fontFamily: 'SVN-Aptima, sans-serif',
                                fontWeight: 700,
                                fontSize: '21px',
                                lineHeight: '1.25',
                                letterSpacing: '-2%',
                                height: 72,
                                width: 398,
                                maxWidth: '100%',
                                color: '#fff',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                            onClick={() => setActiveButton('live')}
                        >
                            XEM LIVE
                        </button>
                        <style>
                            {`
                              @media (max-width: 640px) {
                                .homepage-btn {
                                    width: 131px !important;
                                    font-size: 13px !important;
                                }
                              }
                            `}
                        </style>
                    </div>
                    {activeButton === "promotions" ? (
                    <>
                        {/* Danh sách ảnh */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                        {promotions?.slice(0, visibleCount).map((promotion) => (
                            <div key={promotion.id} className="w-full p-2 relative">
                            {/* Chỉ hiển thị skeleton loader cho ảnh chưa load */}
                            {!loadedImages[promotion.id] && (
                                <div className="w-full h-48 bg-gray-300 animate-pulse rounded-lg"></div>
                            )}

                            {/* Ảnh */}
                            <img
                                src={promotion?.announcementImages?.[0]?.url || ""}
                                alt={`img-${promotion.id}`}
                                className={`w-full h-auto object-cover cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-lg ${
                                loadedImages[promotion.id] ? "block" : "hidden"
                                }`}
                                loading="lazy"
                                onLoad={() => handleImageLoad(promotion.id)}
                                onClick={() => clickPromotion(promotion)}
                            />
                            </div>
                        ))}
                        </div>

                        {/* Nút Xem thêm */}
                        {promotions?.length > visibleCount && (
                        <div className="text-center mt-4">
                            <button
                                onClick={loadMore}
                                style={{ background: "none", border: "none", padding: 0, outline: "none" }}
                                className="transition-all focus:outline-none"
                            >
                                <img
                                    src="/btn-more.webp"
                                    alt="Xem thêm"
                                    style={{ width: 186, height: 46, objectFit: "contain", display: "block" }}
                                />
                            </button>
                        </div>
                        )}
                    </>
                    ) : (
                        <div className="mt-12">
                        
                        </div>
                    )}
                    </div>
                </div>
            </div>
        {/* Mobile */}

            <div className="min-h-screen flex flex-col items-center md:hidden block">
                {/* Mobile wrapper: header + body chung một background */}
                <div 
                    className="flex-1 w-full flex flex-col items-center relative"
                    style={{
                        backgroundColor: '#000103'
                    }}
                >
                    {/* Video background - chỉ hiển thị đúng kích thước */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute top-0 left-0 w-full z-0"
                        style={{ 
                            pointerEvents: 'none',
                            objectFit: 'cover',
                            height: '100vh',
                            maxHeight: '100vh'
                        }}
                    >
                        <source src="/bg-mb.mp4" type="video/mp4" />
                    </video>
                    {/* Overlay gradient */}
                    <div 
                        className="absolute top-0 left-0 w-full z-0"
                        style={{
                            height: '100vh',
                            pointerEvents: 'none'
                        }}
                    />
                    {/* Header */}
                    <div className="p-2 sm:p-4 w-full flex flex-col items-center justify-between relative z-10">
                        <img 
                            src="/logo.webp" 
                            alt="Logo" 
                            className={`${styles.logo} ${styles.fadeIn}`} 
                        />
                        <button
                            onClick={() => {
                                if (window.history.length > 1) {
                                    const previousUrl = document.referrer;
                                    if (previousUrl.includes('rr')) {
                                        window.history.back();
                                    } else {
                                        window.location.href = "https://rr311.com";
                                    }
                                } else {
                                    window.location.href = "https://rr311.com";
                                }
                            }}
                            className="transition-all duration-300 hover:scale-105 mt-2 sm:mt-4"
                            style={{
                                padding: 0,
                                border: "none",
                                background: "none",
                            }}
                        >
                            <img
                                src="/btn-home.webp"
                                alt="Về trang chủ"
                                style={{
                                    display: "block",
                                    width: "201px",
                                    height: "41px",
                                    marginBottom: "20px",
                                }}
                            />
                        </button>
                        <div className="w-8 sm:w-12" />
                        {/* Hình ảnh tiêu đề */}
                        <div className="w-full flex justify-center items-center px-2">
                            <div 
                                className="flex-grow flex flex-col items-center text-gray-700 bg-opacity-75 pt-4 sm:pt-6 rounded-xl"
                                style={{ 
                                    backgroundImage: "url('/bg-modal-mb.webp')", 
                                    backgroundSize: "100% 100%", // Hiển thị ảnh full kích thước vùng chứa
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    width: "100%",
                                    maxWidth: "100%",
                                    minHeight: "330px",
                                }}
                            >
                                <img src="/title-modal-mb.webp" alt="Tittle" className="w-auto max-h-[50px] sm:max-h-[80px] max-w-full mb-0 sm:mb-4" />
                                {/* Form username + captcha */}
                                <div className="py-2 sm:py-4 px-2 sm:px-4 flex flex-col sm:flex-row items-center justify-center rounded-lg mt-2 sm:mt-6 w-full gap-3 sm:gap-4">
                                    {/* Cột 1: Username */}
                                    <div className="flex flex-col w-full sm:flex-1 max-w-full">
                                        <span 
                                            className="font-bold text-[#f4db8d] mb-1 sm:mb-2 w-full text-center" 
                                            style={{ fontSize: 'clamp(16px, 4vw, 24px)' }}
                                        >
                                            Vui lòng nhập tên tài khoản
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Nhập Tên tài khoản"
                                            className="w-full mx-auto"
                                            style={{
                                                width: "80%",
                                                height: "45px",
                                                paddingLeft: "16px",
                                                paddingRight: "8px",
                                                borderRadius: 9999,
                                                border: "none",
                                                outline: "none",
                                                background: "#f5f9ff",
                                                fontSize: "14px",
                                                textAlign: "left",
                                            }}
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    {/* Cột 2: Captcha */}
                                    <div className="flex flex-col w-full sm:flex-1 max-w-full">
                                        <span 
                                            className="font-bold text-[#f4db8d] mb-1 sm:mb-2 w-full text-center" 
                                            style={{ fontSize: 'clamp(16px, 4vw, 24px)' }}
                                        >
                                            Nhập mã CAPTCHA
                                        </span>
                                        <div className="relative w-full flex items-center">
                                            <input
                                                type="text"
                                                placeholder="Nhập Captcha"
                                                className="w-full mx-auto"
                                                style={{
                                                    width: "80%",
                                                    height: "45px",
                                                    paddingLeft: "16px",
                                                    paddingRight: "70px",
                                                    borderRadius: 9999,
                                                    border: "none",
                                                    outline: "none",
                                                    background: "#f5f9ff",
                                                    fontSize: "14px",
                                                    textAlign: "left",
                                                }}
                                                value={captcha}
                                                onChange={(e) => setCaptcha(e.target.value)}
                                            />
                                            {captchaSvg && (
                                                <div
                                                    className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full cursor-pointer select-none max-w-[110px] max-h-[30px]"
                                                    style={{ display: "flex", alignItems: "center" }}
                                                    dangerouslySetInnerHTML={{ __html: captchaSvg }}
                                                    onClick={fetchCaptcha}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {/* Cột 3: Button xác nhận */}
                                    <div className="flex items-end h-full pt-2 sm:pt-4 w-full sm:w-auto">
                                        <button
                                            onClick={checkUsername}
                                            style={{ background: "none", border: "none", padding: 0, outline: "none", width: "100%" }}
                                            className="group focus:outline-none"
                                        >
                                            <img
                                                src="/btn-accept.webp"
                                                alt="Xác nhận"
                                                style={{ width: "100%", maxWidth: "200px", height: "45px", objectFit: "contain", display: "block", margin: "0 auto" }}
                                                className="transition-all group-hover:scale-105"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs + Content */}
                    <div className="w-full flex flex-col items-center p-2 sm:p-4 relative z-10">
                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 sm:gap-4 rounded-full mt-4 sm:mt-6 justify-center items-center w-full px-2">
                            <button
                                className={`px-4 sm:px-6 py-0 rounded-full border border-gray-400 flex items-center justify-center transition-all
                                    ${activeButton === 'promotions'
                                        ? 'text-white font-bold bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]'
                                        : 'text-black font-bold'
                                    }`}
                                style={{
                                    fontFamily: 'SVN-Aptima, sans-serif',
                                    fontWeight: 700,
                                    fontSize: "clamp(16px, 3vw, 18px)",
                                    lineHeight: "1.2",
                                    letterSpacing: "-2%",
                                    textTransform: "uppercase",
                                    background: activeButton !== 'promotions'
                                        ? 'linear-gradient(180deg, rgba(0,49,107,1) 0%, rgba(3,50,165,1) 100%)'
                                        : undefined,
                                    opacity: 1,
                                    color: "#fff",
                                    maxHeight: '45px',
                                    height: '45px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}
                                onClick={() => setActiveButton('promotions')}
                            >
                                Khuyến mãi hot
                            </button>
                            <button
                                className={`px-4 sm:px-6 py-0 rounded-full border border-gray-400 flex items-center justify-center transition-all
                                    ${activeButton === 'conditions'
                                        ? 'text-white font-bold bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]'
                                        : 'text-black font-bold'
                                    }`}
                                style={{
                                    fontFamily: 'SVN-Aptima, sans-serif',
                                    fontWeight: 700,
                                    fontSize: "clamp(16px, 3vw, 18px)",
                                    lineHeight: "1.2",
                                    letterSpacing: "-2%",
                                    textTransform: "uppercase",
                                    background: activeButton !== 'conditions'
                                        ? 'linear-gradient(180deg, rgba(0,49,107,1) 0%, rgba(3,50,165,1) 100%)'
                                        : undefined,
                                    opacity: 1,
                                    color: "#fff",
                                    maxHeight: '45px',
                                    height: '45px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}
                                onClick={() => navigate('/video-su-kien')}
                            >
                                VIDEO SỰ KIỆN
                            </button>
                            <button
                                className={`px-4 sm:px-6 py-0 rounded-full border border-gray-400 flex items-center justify-center transition-all
                                    ${activeButton === 'inputcode'
                                        ? 'text-white font-bold bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]'
                                        : 'text-black font-bold'
                                    }`}
                                style={{
                                    fontFamily: 'SVN-Aptima, sans-serif',
                                    fontWeight: 700,
                                    fontSize: "clamp(16px, 3vw, 18px)",
                                    lineHeight: "1.2",
                                    letterSpacing: "-2%",
                                    textTransform: "uppercase",
                                    background: activeButton !== 'inputcode'
                                        ? 'linear-gradient(180deg, rgba(0,49,107,1) 0%, rgba(3,50,165,1) 100%)'
                                        : undefined,
                                    opacity: 1,
                                    color: "#fff",
                                    maxHeight: '45px',
                                    height: '45px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}
                                onClick={() => setActiveButton('inputcode')}
                            >
                                NHẬP CODE
                            </button>
                            <button
                                className={`px-4 sm:px-6 py-0 rounded-full border border-gray-400 flex items-center justify-center transition-all
                                    ${activeButton === 'receiveCode'
                                        ? 'text-white font-bold bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]'
                                        : 'text-black font-bold'
                                    }`}
                                style={{
                                    fontFamily: 'SVN-Aptima, sans-serif',
                                    fontWeight: 700,
                                    fontSize: "clamp(16px, 3vw, 18px)",
                                    lineHeight: "1.2",
                                    letterSpacing: "-2%",
                                    textTransform: "uppercase",
                                    background: activeButton !== 'receiveCode'
                                        ? 'linear-gradient(180deg, rgba(0,49,107,1) 0%, rgba(3,50,165,1) 100%)'
                                        : undefined,
                                    opacity: 1,
                                    color: "#fff",
                                    maxHeight: '45px',
                                    height: '45px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}
                                onClick={() => setActiveButton('receiveCode')}
                            >
                                NHẬN MÃ DỰ THƯỞNG
                            </button>
                            <button
                                className={`px-4 sm:px-6 py-0 rounded-full border border-gray-400 flex items-center justify-center transition-all
                                    ${activeButton === 'charity'
                                        ? 'text-white font-bold bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]'
                                        : 'text-black font-bold'
                                    }`}
                                style={{
                                    fontFamily: 'SVN-Aptima, sans-serif',
                                    fontWeight: 700,
                                    fontSize: "clamp(16px, 3vw, 18px)",
                                    lineHeight: "1.2",
                                    letterSpacing: "-2%",
                                    textTransform: "uppercase",
                                    background: activeButton !== 'charity'
                                        ? 'linear-gradient(180deg, rgba(0,49,107,1) 0%, rgba(3,50,165,1) 100%)'
                                        : undefined,
                                    opacity: 1,
                                    color: "#fff",
                                    maxHeight: '45px',
                                    height: '45px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}
                                onClick={() => setActiveButton('charity')}
                            >
                                THIỆN NGUYỆN
                            </button>
                            <button
                                className={`px-4 sm:px-6 py-0 rounded-full border border-gray-400 flex items-center justify-center transition-all
                                    ${activeButton === 'live'
                                        ? 'text-white font-bold bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]'
                                        : 'text-black font-bold'
                                    }`}
                                style={{
                                    fontFamily: 'SVN-Aptima, sans-serif',
                                    fontWeight: 700,
                                    fontSize: "clamp(16px, 3vw, 18px)",
                                    lineHeight: "1.2",
                                    letterSpacing: "-2%",
                                    textTransform: "uppercase",
                                    background: activeButton !== 'live'
                                        ? 'linear-gradient(180deg, rgba(0,49,107,1) 0%, rgba(3,50,165,1) 100%)'
                                        : undefined,
                                    opacity: 1,
                                    color: "#fff",
                                    maxHeight: '45px',
                                    height: '45px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}
                                onClick={() => setActiveButton('live')}
                            >
                                XEM LIVE
                            </button>
                        </div>

                        {/* Nội dung */}
                        {activeButton === "promotions" ? (
                            <>
                                {/* Danh sách ảnh */}
                                <div className="flex flex-col gap-2 mt-4 w-full max-w-md">
                                    {promotionsMB?.slice(0, visibleCount).map((promotion) => (
                                        <div key={promotion.id} className="w-full p-2">
                                            <img
                                                src={promotion.announcementImages[0].url}
                                                alt={`img-${promotion.id}`}
                                                className="w-full h-auto object-cover cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                                                onClick={() => clickPromotion(promotion)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Nút Xem thêm */}
                                {promotionsMB?.length > visibleCount && (
                                    <div className="text-center mt-4">
                                        <button
                                            onClick={loadMore}
                                            style={{ background: "none", border: "none", padding: 0, outline: "none" }}
                                            className="transition-all focus:outline-none"
                                        >
                                            <img
                                                src="/btn-more.webp"
                                                alt="Xem thêm"
                                                style={{ width: 140, height: 35, objectFit: "contain", display: "block" }}
                                            />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="mt-6 mb-4">
                               {}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer></Footer>
            <PromotionModal1 isOpen={openModal === true} onClose={closeModal} promotion={promotion}/>
            <ListPromotionModal isOpen={openListPromotionModal === true} onClose={closeListPromotionModal} promotions = {listPromotions} username={username}/>
            {showForbiddenModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-96">
                        <h2 className="text-lg font-bold text-red-600 text-center">
                            TÀI KHOẢN KHÔNG ĐƯỢC THAM GIA KHUYẾN MÃI
                        </h2>
                        <p className="text-sm text-gray-700 text-center mt-2">
                            Vui lòng liên hệ CSKH 24/7 để được hỗ trợ.
                        </p>
                        <div className="mt-4 text-center">
                            <a
                                href="https://cskhrr88.pages.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                https://cskhrr88.pages.dev
                            </a>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={() => setShowForbiddenModal(false)}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomePage;
