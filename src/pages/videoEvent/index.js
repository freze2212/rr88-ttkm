import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import styles from "../homepage/style.module.css";
import Loader from "../../components/loading";
import VideoList from "../../components/VideoList";

const VideoEvent = () => {
  const activeButton = "videoEvent";
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const loadingTimeout = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(loadingTimeout);
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen flex flex-col">
        <div
          className="flex-1 flex flex-col relative"
          style={{ backgroundColor: "#000103" }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full z-0 hidden md:block"
            style={{
              pointerEvents: "none",
              objectFit: "cover",
              height: "100vh",
              maxHeight: "100vh",
            }}
          >
            <source src="/bg-pc.mp4" type="video/mp4" />
          </video>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full z-0 block md:hidden"
            style={{
              pointerEvents: "none",
              objectFit: "cover",
              height: "100vh",
              maxHeight: "100vh",
            }}
          >
            <source src="/bg-mb.mp4" type="video/mp4" />
          </video>

          <div
            className="absolute top-0 left-0 w-full z-0"
            style={{
              height: "100vh",
              pointerEvents: "none",
            }}
          />

          <div className="p-2 sm:p-4 flex flex-col items-center justify-between relative z-10">
            <div className="hidden sm:block absolute top-4 left-4 transition-all duration-300 hover:scale-105 z-20">
              <button
                onClick={() => {
                  if (window.history.length > 1) {
                    const previousUrl = document.referrer;
                    if (previousUrl.includes("rr")) {
                      window.history.back();
                    } else {
                      window.location.href = "https://rr311.com";
                    }
                  } else {
                    window.location.href = "https://rr311.com";
                  }
                }}
                style={{ padding: 0, border: "none", background: "none" }}
              >
                <img
                  src="/btn-home.webp"
                  alt="Về trang chủ"
                  style={{
                    display: "block",
                    width: "clamp(80px, 10vw, 160px)",
                    height: "auto",
                  }}
                />
              </button>
            </div>

            <img
              src="/logo.webp"
              alt="Logo"
              className={`${styles.logo} ${styles.fadeIn} cursor-pointer hover:opacity-80 transition-opacity`}
              onClick={() => navigate("/")}
            />

            <div className="block sm:hidden mt-0">
              <button
                onClick={() => {
                  if (window.history.length > 1) {
                    const previousUrl = document.referrer;
                    if (previousUrl.includes("rr")) {
                      window.history.back();
                    } else {
                      window.location.href = "https://rr311.com";
                    }
                  } else {
                    window.location.href = "https://rr311.com";
                  }
                }}
                className="transition-all duration-300 hover:scale-105"
                style={{ padding: 0, border: "none", background: "none" }}
              >
                <img
                  src="/btn-home.webp"
                  alt="Về trang chủ"
                  style={{
                    display: "block",
                    width: "clamp(80px, 40vw, 160px)",
                    height: "auto",
                  }}
                />
              </button>
            </div>
            <div className="w-8 sm:w-16" />
          </div>

          <div className="w-full flex flex-col items-center p-2 sm:p-4 relative z-10">
            <div className="w-full mt-4 sm:mt-8 flex flex-col items-center">
              <div
                className="
                                    hidden
                                    sm:grid
                                    grid-cols-3
                                    gap-4
                                    w-full
                                    max-w-[1230px]
                                "
              >
                <button
                  onClick={() => navigate("/")}
                  className={`videoevent-btn flex items-center justify-center rounded-full border border-gray-400 transition-all font-bold uppercase text-white
                                        ${
                                          activeButton === "promotions"
                                            ? "bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]"
                                            : "bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]"
                                        }
                                    `}
                  style={{
                    fontFamily: "SVN-Aptima, sans-serif",
                    fontWeight: 700,
                    fontSize: "29.5px",
                    lineHeight: "1.25",
                    letterSpacing: "-2%",
                    width: "398px",
                    height: "72px",
                    maxWidth: "398px",
                    maxHeight: "72px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  KHUYẾN MÃI HOT
                </button>
                <button
                  className={`videoevent-btn flex items-center justify-center rounded-full border border-gray-400 transition-all font-bold uppercase text-white
                                        ${
                                          activeButton === "videoEvent"
                                            ? "bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]"
                                            : "bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]"
                                        }
                                    `}
                  style={{
                    fontFamily: "SVN-Aptima, sans-serif",
                    fontWeight: 700,
                    fontSize: "29.5px",
                    lineHeight: "1.25",
                    letterSpacing: "-2%",
                    width: "398px",
                    height: "72px",
                    maxWidth: "398px",
                    maxHeight: "72px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  VIDEO SỰ KIỆN
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="videoevent-btn flex items-center justify-center rounded-full border border-gray-400 transition-all font-bold uppercase text-white bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]"
                  style={{
                    fontFamily: "SVN-Aptima, sans-serif",
                    fontWeight: 700,
                    fontSize: "29.5px",
                    lineHeight: "1.25",
                    letterSpacing: "-2%",
                    width: "398px",
                    height: "72px",
                    maxWidth: "398px",
                    maxHeight: "72px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  NHẬP CODE
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="videoevent-btn flex items-center justify-center rounded-full border border-gray-400 transition-all font-bold uppercase text-white bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]"
                  style={{
                    fontFamily: "SVN-Aptima, sans-serif",
                    fontWeight: 700,
                    fontSize: "29.5px",
                    lineHeight: "1.25",
                    letterSpacing: "-2%",
                    width: "398px",
                    height: "72px",
                    maxWidth: "398px",
                    maxHeight: "72px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  NHẬN MÃ DỰ THƯỞNG
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="videoevent-btn flex items-center justify-center rounded-full border border-gray-400 transition-all font-bold uppercase text-white bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]"
                  style={{
                    fontFamily: "SVN-Aptima, sans-serif",
                    fontWeight: 700,
                    fontSize: "29.5px",
                    lineHeight: "1.25",
                    letterSpacing: "-2%",
                    width: "398px",
                    height: "72px",
                    maxWidth: "398px",
                    maxHeight: "72px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  THIỆN NGUYỆN
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="videoevent-btn flex items-center justify-center rounded-full border border-gray-400 transition-all font-bold uppercase text-white bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]"
                  style={{
                    fontFamily: "SVN-Aptima, sans-serif",
                    fontWeight: 700,
                    fontSize: "29.5px",
                    lineHeight: "1.25",
                    letterSpacing: "-2%",
                    width: "398px",
                    height: "72px",
                    maxWidth: "398px",
                    maxHeight: "72px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  XEM LIVE
                </button>
              </div>
              <div
                className="
                                    w-full
                                    grid
                                    grid-cols-3
                                    gap-2
                                    sm:hidden
                                "
              >
                <button
                  onClick={() => navigate("/")}
                  className={`videoevent-btn flex items-center justify-center rounded-full border border-gray-400 transition-all font-bold uppercase text-white
                                        ${
                                          activeButton === "promotions"
                                            ? "bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]"
                                            : "bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]"
                                        }
                                    `}
                  style={{
                    fontFamily: "SVN-Aptima, sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    lineHeight: "1.25",
                    letterSpacing: "-2%",
                    width: "131px",
                    height: "24px",
                    maxWidth: "131px",
                    maxHeight: "24px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  Khuyến mãi hot
                </button>
                <button
                  className={`videoevent-btn flex items-center justify-center rounded-full border border-gray-400 transition-all font-bold uppercase text-white
                                        ${
                                          activeButton === "videoEvent"
                                            ? "bg-gradient-to-b from-[#2B8DFE] to-[#0045F1]"
                                            : "bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]"
                                        }
                                    `}
                  style={{
                    fontFamily: "SVN-Aptima, sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    lineHeight: "1.25",
                    letterSpacing: "-2%",
                    width: "131px",
                    height: "24px",
                    maxWidth: "131px",
                    maxHeight: "24px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  VIDEO SỰ KIỆN
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="videoevent-btn flex items-center justify-center rounded-full border border-gray-400 transition-all font-bold uppercase text-white bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]"
                  style={{
                    fontFamily: "SVN-Aptima, sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    lineHeight: "1.25",
                    letterSpacing: "-2%",
                    width: "131px",
                    height: "24px",
                    maxWidth: "131px",
                    maxHeight: "24px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  NHẬP CODE
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="videoevent-btn flex items-center justify-center rounded-full border border-gray-400 transition-all font-bold uppercase text-white bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]"
                  style={{
                    fontFamily: "SVN-Aptima, sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    lineHeight: "1.25",
                    letterSpacing: "-2%",
                    width: "131px",
                    height: "24px",
                    maxWidth: "131px",
                    maxHeight: "24px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  NHẬN MÃ DỰ THƯỞNG
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="videoevent-btn flex items-center justify-center rounded-full border border-gray-400 transition-all font-bold uppercase text-white bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]"
                  style={{
                    fontFamily: "SVN-Aptima, sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    lineHeight: "1.25",
                    letterSpacing: "-2%",
                    width: "131px",
                    height: "24px",
                    maxWidth: "131px",
                    maxHeight: "24px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  THIỆN NGUYỆN
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="videoevent-btn flex items-center justify-center rounded-full border border-gray-400 transition-all font-bold uppercase text-white bg-[linear-gradient(180deg,rgba(0,49,107,1)_0%,rgba(3,50,165,1)_100%)]"
                  style={{
                    fontFamily: "SVN-Aptima, sans-serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    lineHeight: "1.25",
                    letterSpacing: "-2%",
                    width: "131px",
                    height: "24px",
                    maxWidth: "131px",
                    maxHeight: "24px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  XEM LIVE
                </button>
              </div>
              <style>
                {`
                                  @media (max-width: 1024px) {
                                    .videoevent-btn {
                                        width: 180px !important;
                                        font-size: 18px !important;
                                    }
                                  }
                                  @media (max-width: 640px) {
                                    .videoevent-btn {
                                        width: 131px !important;
                                        height: 24px !important;
                                        font-size: 9.74px !important;
                                    }
                                    .videoevent-btn {
                                        min-width: 0 !important;
                                    }
                                  }
                                `}
              </style>
            </div>

            <div className="mt-8 sm:mt-8 w-full flex flex-col items-center">
              <VideoList />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VideoEvent;
