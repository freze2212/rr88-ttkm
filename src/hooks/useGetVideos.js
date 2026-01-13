import { useQuery } from "react-query";
import { getVideos } from "../services/videoService";

export const useGetVideos = () => {
  return useQuery({
    queryKey: ["videos"],
    queryFn: getVideos,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
