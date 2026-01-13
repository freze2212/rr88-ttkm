import React from "react";

const VideoCard = ({ video, onVideoClick, size = "default" }) => {
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

  const getVimeoId = (url) => {
    if (!url || typeof url !== "string") {
      return null;
    }

    const trimmedUrl = url.trim();

    if (trimmedUrl === "") {
      return null;
    }

    const patterns = [
      /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/,
      /vimeo\.com\/(\d+)/,
      /\/video\/(\d+)/,
    ];

    for (const pattern of patterns) {
      const match = trimmedUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const getThumbnail = (url) => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      return null;
    }

    const trimmedUrl = url.trim();

    if (isDirectVideoUrl(trimmedUrl)) {
      return null;
    }

    const vimeoId = getVimeoId(trimmedUrl);
    if (vimeoId) {
      return `https://vumbnail.com/${vimeoId}.jpg`;
    }

    return null;
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

  const videoUrl = video.url ? video.url.trim() : null;
  const thumbnail = getThumbnail(videoUrl);
  const videoType = getVideoType(videoUrl);
  const isDirectVideo = videoType === "direct";
  const aspectRatio = video.aspectRatio || "16:9";

  const sizeClasses = {
    default: {
      playButton: "w-12 h-12 sm:w-16 sm:h-16",
      playIcon: "w-5 h-5 sm:w-6 sm:h-6",
      title: "text-xs sm:text-sm",
    },
    large: {
      playButton: "w-16 h-16 sm:w-20 sm:h-20",
      playIcon: "w-6 h-6 sm:w-8 sm:h-8",
      title: "text-sm sm:text-base",
    },
  };

  const classes = sizeClasses[size] || sizeClasses.default;

  const getAspectRatioClass = () => {
    return aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-video";
  };

  return (
    <div
      className="relative group cursor-pointer"
      onClick={() => onVideoClick(video)}
    >
      <div
        className={`relative w-full ${getAspectRatioClass()} bg-gray-800 rounded-lg overflow-hidden`}
      >
        {isDirectVideo && videoUrl ? (
          <div className="relative w-full h-full">
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
              onLoadedMetadata={(e) => {
                const video = e.target;
                video.currentTime = 0.1;
              }}
              onSeeked={(e) => {
                e.target.pause();
              }}
            />
          </div>
        ) : thumbnail ? (
          <div className="relative w-full h-full">
            <img
              src={thumbnail}
              alt={video.title || "Video thumbnail"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800">
            <div className="text-center opacity-50">
              <svg
                className="w-16 h-16 mx-auto text-gray-500 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-400 text-xs sm:text-sm">No video URL</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 sm:mt-3">
        <h3
          className={`text-white  ${classes.title} font-[800] text-[12px] md:text-[16px] line-clamp-1 md:line-clamp-2 mb-1`}
        >
          {video.title || "Untitled Video"}
        </h3>
        <div className="flex items-center gap-3 text-[#fff] text-[12px] md:text-[16px] font-[500]">
          <span>{formatViews(video.views || 0)} Lượt xem</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
