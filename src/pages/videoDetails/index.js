import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoCard from "../../components/VideoCard";
import { useGetVideos } from "../../hooks/useGetVideos";
import Footer from "../../components/footer";

const VideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useGetVideos();
  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const allVideos = useMemo(() => {
    if (!data) return [];
    const allVideosArray = [
      ...(data.pinned || []),
      ...(data.latest || []),
      ...(data.popular || []),
    ];
    
    const uniqueVideosMap = new Map();
    allVideosArray.forEach((video) => {
      if (video._id) {
        if (!uniqueVideosMap.has(video._id)) {
          uniqueVideosMap.set(video._id, video);
        } else {
        }
      }
    });
    
    return Array.from(uniqueVideosMap.values());
  }, [data]);

  const currentVideo = useMemo(() => {
    return allVideos.find((v) => v._id === id) || null;
  }, [allVideos, id]);

  // Lấy comments từ currentVideo (từ API)
  const comments = useMemo(() => {
    return currentVideo?.comments || [];
  }, [currentVideo]);

  // Hàm random avatar cho user - dạng đại gia giàu sang, phú bà đẳng cấp
  const getRandomAvatar = (userId, username) => {
    // Xử lý userId: nếu là object thì lấy _id, nếu không thì dùng trực tiếp
    let actualUserId = userId;
    if (userId && typeof userId === 'object') {
      actualUserId = userId._id || userId.id || JSON.stringify(userId);
    }
    
    // Kết hợp userId và username để tạo seed duy nhất cho mỗi user
    // Điều này đảm bảo mỗi user có avatar khác nhau ngay cả khi có cùng userId (không nên xảy ra nhưng để chắc chắn)
    let seedString = '';
    if (actualUserId) {
      const userIdStr = typeof actualUserId === 'string' ? actualUserId : String(actualUserId);
      seedString = userIdStr;
    }
    if (username) {
      seedString = seedString ? `${seedString}-${username}` : username;
    }
    
    if (!seedString) {
      // Nếu không có userId và username, tạo random seed
      const randomSeed = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`;
    }
    
    // Tạo hash từ seedString để chọn màu nền
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      const char = seedString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Sử dụng seedString làm seed để đảm bảo mỗi user có avatar cố định nhưng khác nhau
    // Encode để tránh ký tự đặc biệt trong URL
    const seed = encodeURIComponent(seedString);
    
    // Màu sắc sang trọng: vàng, đen, trắng, xanh navy, đỏ đậm, tím, xanh lá đậm
    const richColors = ['ffd700', '000000', 'ffffff', '1a1a2e', '16213e', '0f3460', '8b0000', '4b0082', '2d5016', '8b4513'];
    const bgColor = richColors[Math.abs(hash) % richColors.length];
    
    // Style adventurer tạo avatar đẹp, đẳng cấp với nhiều tùy chọn phụ kiện
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=${bgColor}`;
  };


  // Hàm normalize text: bỏ dấu, chuyển thường, bỏ khoảng cách
  const normalizeText = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
      .replace(/\s+/g, ""); // Bỏ tất cả khoảng cách
  };

  const relatedVideos = useMemo(() => {
    if (!currentVideo) return [];
    let filtered = allVideos.filter(
      (v) => v._id !== id && (v.aspectRatio || "16:9") === "16:9"
    );
    
    // Filter theo search term nếu có
    if (searchTerm.trim()) {
      const normalizedSearch = normalizeText(searchTerm);
      filtered = filtered.filter((v) =>
        normalizeText(v.title || "").includes(normalizedSearch)
      );
    }
    
    return filtered.slice(0, 4);
  }, [allVideos, id, currentVideo, searchTerm]);

  const groupVideosIntoRows = (videos) => {
    const landscapeVideos = videos.filter(
      (v) => (v.aspectRatio || "16:9") === "16:9"
    );
    const portraitVideos = videos.filter((v) => v.aspectRatio === "9:16");

    const rows = [];
    let landscapeIndex = 0;
    let portraitIndex = 0;
    let rowIndex = 0;
    while (
      landscapeIndex < landscapeVideos.length ||
      portraitIndex < portraitVideos.length
    ) {
      const isEvenRow = rowIndex % 2 === 0;

      if (isEvenRow && landscapeIndex < landscapeVideos.length) {
        const row = landscapeVideos.slice(landscapeIndex, landscapeIndex + 3);
        if (row.length > 0) {
          rows.push({
            cards: row,
            columns: 3,
            aspectRatio: "16:9",
          });
          landscapeIndex += 3;
        }
      } else if (!isEvenRow && portraitIndex < portraitVideos.length) {
        const row = portraitVideos.slice(portraitIndex, portraitIndex + 6);
        if (row.length > 0) {
          rows.push({
            cards: row,
            columns: 6,
            aspectRatio: "9:16",
          });
          portraitIndex += 6;
        }
      } else {
        if (landscapeIndex < landscapeVideos.length) {
          const row = landscapeVideos.slice(landscapeIndex, landscapeIndex + 3);
          if (row.length > 0) {
            rows.push({
              cards: row,
              columns: 3,
              aspectRatio: "16:9",
            });
            landscapeIndex += 3;
          }
        } else if (portraitIndex < portraitVideos.length) {
          const row = portraitVideos.slice(portraitIndex, portraitIndex + 6);
          if (row.length > 0) {
            rows.push({
              cards: row,
              columns: 6,
              aspectRatio: "9:16",
            });
            portraitIndex += 6;
          }
        } else {
          break;
        }
      }

      rowIndex++;
    }

    return rows;
  };

  const getVimeoId = (url) => {
    if (!url || typeof url !== "string") return null;
    const trimmedUrl = url.trim();
    if (trimmedUrl === "") return null;
    const match = trimmedUrl.match(
      /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
    );
    return match ? match[1] : null;
  };

  const isDirectVideoUrl = (url) => {
    if (!url) return false;
    const trimmedUrl = url.trim().toLowerCase();
    return (
      trimmedUrl.endsWith(".mp4") ||
      trimmedUrl.endsWith(".webm") ||
      trimmedUrl.endsWith(".mov") ||
      trimmedUrl.includes("blob.") ||
      trimmedUrl.includes("/uploads/")
    );
  };

  const getVideoType = (url) => {
    if (!url || typeof url !== "string") return null;
    const trimmedUrl = url.trim().toLowerCase();
    if (
      trimmedUrl.includes("vimeo.com") ||
      trimmedUrl.includes("player.vimeo.com")
    ) {
      return "vimeo";
    }
    if (isDirectVideoUrl(trimmedUrl)) {
      return "direct";
    }
    return null;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // Hàm xử lý click video: 9:16 fullscreen, 16:9 navigate
  const handleVideoClick = (video) => {
    // Scroll lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const aspectRatio = video.aspectRatio || "16:9";
    if (aspectRatio === "9:16") {
      // Mở fullscreen cho video 9:16
      setFullscreenVideo(video);
    } else {
      // Navigate cho video 16:9
      navigate(`/video/${video._id}`);
    }
  };

  const getDisplayVideos = () => {
    let filtered = allVideos.filter(
      (v) => v._id !== id && !relatedVideos.some((rv) => rv._id === v._id)
    );
    
    // Filter theo search term nếu có
    if (searchTerm.trim()) {
      const normalizedSearch = normalizeText(searchTerm);
      filtered = filtered.filter((v) =>
        normalizeText(v.title || "").includes(normalizedSearch)
      );
    }
    
    return filtered;
  };

  const displayVideos = getDisplayVideos();
  const videoRows = groupVideosIntoRows(displayVideos);

  if (!currentVideo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000103]">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Video không tồn tại</p>
          <button
            onClick={() => navigate("/video-su-kien")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const videoUrl = currentVideo.url ? currentVideo.url.trim() : null;
  const videoType = getVideoType(videoUrl);
  const vimeoId = getVimeoId(videoUrl);

  return (
    <>
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

          <div className="w-full px-4 py-3 md:py-4 flex items-center justify-between relative z-10">
            <div className={`flex items-center gap-2 md:gap-3 ${isSearchFocused ? 'hidden' : ''}`}>
              <img 
                src="/logo.webp" 
                alt="Logo" 
                className="w-[400px] cursor-pointer hover:opacity-80 transition-opacity" 
                onClick={() => navigate("/")}
              />
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-0">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-20 bg-gray-800/80 text-white rounded-full border border-gray-600/50 focus:outline-none focus:border-blue-500 focus:bg-gray-800"
                />

                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={`flex md:hidden ${isSearchFocused ? 'flex-1 w-[90%]' : 'flex-1 max-w-xs mx-2'}`}>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full px-3 py-1.5 pl-8 pr-16 bg-gray-800/80 text-white text-sm rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500 focus:bg-gray-800"
                />

                <svg
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={`flex items-center gap-3 z-20 ${isSearchFocused ? 'hidden' : ''}`}>
              {/* Nút về trang chủ */}
              <div className="hidden md:flex items-center transition-all duration-300 hover:scale-105">
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
            </div>
          </div>

          <div className="w-full flex flex-col items-center p-2 md:p-4 md:pt-0 md:pb-0 relative z-10">
            <div className="w-full mt-4 sm:mt-0 flex flex-col items-center">
              <div className="min-h-screen flex flex-col bg-[#04040480] rounded-[50px]">
                <div className="flex-1 mx-auto px-6 py-6 max-w-[1800px]">
                  <div className="grid grid-cols-1 lg:grid-cols-[1400px_340px] gap-6 justify-center">
                    <div className="w-full">
                      <div
                        className={`relative w-full bg-gray-900 rounded-lg overflow-hidden ${
                          currentVideo.aspectRatio === "9:16"
                            ? " max-h-[80vh]"
                            : "aspect-[15/9]"
                        }`}
                      >
                        {videoType === "vimeo" && vimeoId ? (
                          <iframe
                            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            title={currentVideo.title}
                          />
                        ) : videoType === "direct" && videoUrl ? (
                          <video
                            src={videoUrl}
                            className="w-full h-full"
                            controls
                            autoPlay
                            playsInline
                            style={{ objectFit: "contain" }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-gray-400">No video available</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <h1
                          className="text-white text-xl md:text-2xl font-bold mb-3"
                          style={{ fontFamily: "SVN-Aptima, sans-serif" }}
                        >
                          {currentVideo.title}
                        </h1>
                        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                          <span className="text-gray-300 text-sm md:text-base">
                            {formatViews(currentVideo.views || 0)} Lượt xem
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-5 px-4 py-3 rounded-[30px]" style={{ backgroundColor: "#101116" }}>
                              <div className="flex items-center gap-2">
                                <img
                                  src="/like.png"
                                  alt="Like"
                                  className="w-6 h-6 opacity-80"
                                />
                                <span className="text-sm md:text-base text-white">
                                  {formatViews(currentVideo.likeCount || 0)}
                                </span>
                              </div>
                              <span className="text-white">|</span>
                              <div className="flex items-center gap-2">
                                <img
                                  src="/dislike.png"
                                  alt="Dislike"
                                  className="w-6 h-6 opacity-80"
                                />
                              </div>
                            </div>
                            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z" />
                              </svg>
                              <span className="text-sm md:text-base">
                                Share
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="mt-6 bg-[#18162282] p-6 rounded-e-lg">
                          <h2
                            className="text-white text-lg font-semibold mb-4"
                            style={{ fontFamily: "SVN-Aptima, sans-serif" }}
                          >
                            Bình luận
                          </h2>

                          <div className="space-y-5">
                            {comments.length === 0 ? (
                              <div className="text-gray-400 text-center py-4">Chưa có bình luận nào</div>
                            ) : (
                              comments.map((comment, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden border border-gray-700">
                                    <img
                                      src={getRandomAvatar(null, comment.username)}
                                      alt={comment.username || "User"}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const userName = comment.username || "User";
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&color=fff&size=150&bold=true&font-size=0.5`;
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold mb-1.5 text-sm">
                                      {comment.username || "User"}
                                    </p>
                                    <p className="text-white text-sm leading-relaxed mb-2.5">
                                      {comment.comment || comment.text || ""}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                      <div className="flex items-center gap-1.5 text-gray-400">
                                        <img
                                          src="/like.png"
                                          alt="Like"
                                          className="w-5 h-5 opacity-80"
                                        />
                                        <span className="text-sm md:text-base text-gray-400">
                                          {comment.countLike || 0}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="space-y-4">
                        {relatedVideos.map((video) => (
                          <div
                            key={video._id}
                            className="cursor-pointer"
                          >
                            <VideoCard
                              video={video}
                              onVideoClick={handleVideoClick}
                              size="default"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#3C3C3C] w-full">
                <div className="container mx-auto">
                  {videoRows.length > 0 && (
                    <div className="mt-10 mb-6">
                      <div className="space-y-4 sm:space-y-6">
                        {videoRows.map((row, rowIndex) => {
                          const isPortrait = row.aspectRatio === "9:16";
                          const gridClasses = isPortrait
                            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

                          return (
                            <div
                              key={`row-${rowIndex}`}
                              className={`grid gap-4 sm:gap-6 ${gridClasses}`}
                            >
                              {row.cards.map((video, cardIndex) => (
                                <VideoCard
                                  key={video._id || `${rowIndex}-${cardIndex}`}
                                  video={video}
                                  onVideoClick={handleVideoClick}
                                  size="default"
                                />
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
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
          </div>
        </div>
      </div>

      <Footer />

      {/* Fullscreen Video Player cho video 9:16 */}
      {fullscreenVideo && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={() => setFullscreenVideo(null)}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setFullscreenVideo(null)}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
              style={{ fontSize: "32px", lineHeight: "1" }}
            >
              ×
            </button>

            {/* Video player */}
            <div className="w-full h-full flex items-center justify-center">
              {getVideoType(fullscreenVideo.url) === "vimeo" && getVimeoId(fullscreenVideo.url) ? (
                <iframe
                  src={`https://player.vimeo.com/video/${getVimeoId(fullscreenVideo.url)}?autoplay=1&title=0&byline=0&portrait=0&fullscreen=1`}
                  className="w-full h-full max-w-full max-h-full"
                  style={{ aspectRatio: "9/16" }}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={fullscreenVideo.title}
                />
              ) : getVideoType(fullscreenVideo.url) === "direct" && fullscreenVideo.url ? (
                <video
                  src={fullscreenVideo.url.trim()}
                  className="w-full h-full max-w-full max-h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                  style={{ aspectRatio: "9/16" }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-white text-center">
                  <p>Video không khả dụng</p>
                  <button
                    onClick={() => setFullscreenVideo(null)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default VideoDetails;
