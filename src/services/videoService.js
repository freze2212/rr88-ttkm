import axiosInstance from "./axios_client";

export const getVideos = async () => {
  const response = await axiosInstance.get("/public/settings/video");
  const data = response.data;

  if (data.statusCode === 200 && data.data) {
    const shouldShowVideo = (video) => {
      const hasIsDisplay = video.hasOwnProperty('isDisplay');
      const hasIsHidden = video.hasOwnProperty('isHidden');
      let shouldShow = true;
      
      if (hasIsDisplay) {
        shouldShow = video.isDisplay === true;
      } else if (hasIsHidden) {
        shouldShow = video.isHidden !== true;
      }
      return shouldShow;
    };
    
    const latest16_9_filtered = (data.data.latest16_9 || []).filter(shouldShowVideo);
    const latest9_16_filtered = (data.data.latest9_16 || []).filter(shouldShowVideo);
    const latest = [...latest16_9_filtered, ...latest9_16_filtered];
      
    const popular16_9_filtered = (data.data.popular16_9 || []).filter(shouldShowVideo);
    const popular9_16_filtered = (data.data.popular9_16 || []).filter(shouldShowVideo);
    const popular = [...popular16_9_filtered, ...popular9_16_filtered];
    
    const pinned = (data.data.pinned || []).filter(shouldShowVideo);

    const result = {
      pinned,
      latest,
      popular,
    };
    return result;
  }

  throw new Error("Invalid response format");
};

// Like a video
export const likeVideo = async (videoId) => {
  const response = await axiosInstance.post(`/videos/${videoId}/like`);
  return response.data;
};

// Unlike a video
export const unlikeVideo = async (videoId) => {
  const response = await axiosInstance.delete("/likes", {
    data: {
      targetId: videoId,
      targetType: "VIDEO",
    },
  });
  return response.data;
};

// Login member
export const loginMember = async (loginData) => {
  const response = await axiosInstance.post("/members/login", loginData);
  return response.data;
};

// Get comments for a video
export const getVideoComments = async (videoId, page = 1, limit = 20) => {
  const response = await axiosInstance.get(`/videos/${videoId}/comments`, {
    params: { page, limit },
  });
  return response.data;
};

// Like a comment
export const likeComment = async (commentId) => {
  const response = await axiosInstance.post(`/comments/${commentId}/like`);
  return response.data;
};

// Unlike a comment
export const unlikeComment = async (commentId) => {
  const response = await axiosInstance.delete("/likes", {
    data: {
      targetId: commentId,
      targetType: "COMMENT",
    },
  });
  return response.data;
};

// Create a comment on a video
export const createComment = async (videoId, content) => {
  const response = await axiosInstance.post(`/videos/${videoId}/comments`, {
    content,
  });
  return response.data;
};
