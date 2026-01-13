import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "./VideoCard";
import { useGetVideos } from "../hooks/useGetVideos";

const VideoList = () => {
  const [filter, setFilter] = useState("newest");
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetVideos();
  const [fullscreenVideo, setFullscreenVideo] = useState(null);

  const pinnedVideos = data?.pinned || [];
  const latestVideos = data?.latest || [];
  const popularVideos = data?.popular || [];

  const getCurrentVideos = () => {
    const videos = filter === "newest" ? latestVideos : popularVideos;  
    return videos;
  };

  const currentVideos = getCurrentVideos();

  // Helper functions
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

  const videoRows = groupVideosIntoRows(currentVideos);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-white">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-white">
        <p className="text-red-400">
          {error?.message || "Có lỗi xảy ra khi tải video"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full container px-2 md:px-0">
      {pinnedVideos.length > 0 && (
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center mb-4 sm:mb-4">
            <span
              className="w-[160px] md:w-[206px] flex items-center justify-center gap-2 text-white text-[14px] md:text-[20px] font-['SVN-Gilroy'] text-center align-middle rounded-[50px] px-[5px] md:px-[10px] py-[5px] md:py-[10px] border-[2.25px] border-[#FFFFFF8F]  
              bg-gradient-to-b from-[rgba(0,49,107,0.98)] to-[rgba(3,50,165,0.98)]"
              style={{ fontFamily: "SVN-Aptima, sans-serif" }}
            >
              <img src="/pinedIco.png" alt="" /> Video đã ghim
            </span>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {groupVideosIntoRows(pinnedVideos).map((row, rowIndex) => {
              const isPortrait = row.aspectRatio === "9:16";
              const gridClasses = isPortrait
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

              return (
                <div
                  key={`pinned-row-${rowIndex}`}
                  className={`grid gap-4 sm:gap-6 ${gridClasses}`}
                >
                  {row.cards.map((video, cardIndex) => (
                    <VideoCard
                      key={
                        video._id ||
                        `pinned-${rowIndex}-${cardIndex}-${video.url}`
                      }
                      video={video}
                      onVideoClick={handleVideoClick}
                      size="large"
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-4">
        <button
          onClick={() => setFilter("newest")}
          className={`w-[120px] md:w-[206px] flex items-center justify-center text-white gap-2 text-[14px] md:text-[20px] font-['SVN-Gilroy'] text-center align-middle rounded-[50px] px-[10px] py-[10px] border-[2.25px] border-[#FFFFFF8F] bg-gradient-to-b  ${
            filter === "newest"
              ? "text-white border-b-2 border-[#FFFFFF8F] from-[rgba(0,49,107,0.98)] to-[rgba(3,50,165,0.98)]"
              : "text-gray-400 hover:text-white border-[#85ACFF4F] from-[rgba(0,30,65,0.98)] to-[rgba(0,23,82,0.98)]"
          }`}
        >
          <img src="/videoIco.png" alt="" /> Mới nhất
        </button>
        <button
          onClick={() => setFilter("popular")}
          className={`w-[120px] md:w-[206px] flex items-center justify-center gap-2 text-white text-[14px] md:text-[20px] font-['SVN-Gilroy'] text-center align-middle rounded-[50px] px-[10px] py-[10px] border-[2.25px] border-[#FFFFFF8F] bg-gradient-to-b  ${
            filter === "popular"
              ? "text-white border-b-2 border-[#FFFFFF8F] from-[rgba(0,49,107,0.98)] to-[rgba(3,50,165,0.98)]"
              : "text-gray-400 hover:text-white border-[#85ACFF4F] from-[rgba(0,30,65,0.98)] to-[rgba(0,23,82,0.98)]"
          }`}
        >
          <img src="/videoIco.png" alt="" /> Phổ biến
        </button>
      </div>

      {currentVideos.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {videoRows.map((row, rowIndex) => {
            const isPortrait = row.aspectRatio === "9:16";
            const gridClasses = isPortrait
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

            return (
              <div
                key={`row-${rowIndex}`}
                className={`grid gap-4 sm:gap-6 ${gridClasses}`}
              >
                  {row.cards.map((video, cardIndex) => (
                    <VideoCard
                      key={
                        video._id ||
                        `${filter}-row-${rowIndex}-card-${cardIndex}-${video.url}`
                      }
                      video={video}
                      onVideoClick={handleVideoClick}
                      size="default"
                    />
                  ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Không có video nào</p>
        </div>
      )}

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
    </div>
  );
};

export default VideoList;
