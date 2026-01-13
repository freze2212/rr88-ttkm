import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "../pages/homepage/index";
import VideoEvent from "../pages/videoEvent/index";
import VideoDetails from "../pages/videoDetails/index";
import Maintenance from "../pages/maintenance/index";
import { useState, useEffect } from "react";
import { Suspense } from "react";

function Router() {
    const [isMaintenance, setIsMaintenance] = useState(() => {
        // Kiểm tra ngay lập tức từ biến môi trường
        return process.env.REACT_APP_MAINTENANCE?.toLowerCase() === "true";
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Chỉ kiểm tra API nếu không có biến môi trường
        if (!process.env.REACT_APP_MAINTENANCE) {
            const checkMaintenanceStatus = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/system/status`);
                    const data = await response.json();
                    setIsMaintenance(data.maintenance);
                } catch (error) {
                    console.error('Error checking maintenance status:', error);
                }
            };

            checkMaintenanceStatus();
            const interval = setInterval(checkMaintenanceStatus, 60000);
            return () => clearInterval(interval);
        }
    }, []);

    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <Routes>
                {isMaintenance ? (
                    <Route path="*" element={<Maintenance />} />
                ) : (
                    <>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/video-su-kien" element={<VideoEvent />} />
                        <Route path="/video/:id" element={<VideoDetails />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                )}
            </Routes>
        </Suspense>
    );
}

export default Router;