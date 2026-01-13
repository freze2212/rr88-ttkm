import React, { useState, useEffect } from "react";
import logo from "../../assets/logo-rr88.png";
import { FaTools, FaClock, FaEnvelope, FaPhone, FaUsers } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';

const Maintenance = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [visitorCount, setVisitorCount] = useState(() => {
    // Lấy số người từ localStorage hoặc bắt đầu từ 0
    const savedCount = localStorage.getItem('maintenanceVisitorCount');
    return savedCount ? parseInt(savedCount) : 0;
  });
  const [progress, setProgress] = useState(0);
  const [isExtended, setIsExtended] = useState(false);
  const progressControls = useAnimation();

  useEffect(() => {
    // Get maintenance end time from environment variable or default to 24 hours
    const maintenanceHours = parseInt(process.env.REACT_APP_MAINTENANCE_HOURS || "24");
    
    // Reset maintenance time when starting
    const startTime = Date.now();
    localStorage.setItem('maintenanceStartTime', startTime.toString());
    localStorage.removeItem('maintenanceExtendedTime'); // Reset extended time
    setIsExtended(false); // Reset extended state

    // Tính thời gian kết thúc dựa trên thời gian bắt đầu mới
    const endTime = startTime + (maintenanceHours * 60 * 60 * 1000);

    // Calculate initial progress based on maintenance duration
    const totalDuration = maintenanceHours * 60 * 60 * 1000;
    const initialProgress = 0; // Start from 0
    setProgress(initialProgress);

    // Animate progress bar
    progressControls.start({
      width: `${initialProgress}%`,
      transition: { duration: 1, delay: 1.2 }
    });

    // Update progress every minute
    const progressInterval = setInterval(() => {
      const currentProgress = ((Date.now() - startTime) / totalDuration) * 100;
      setProgress(Math.min(currentProgress, 100));
      progressControls.start({
        width: `${Math.min(currentProgress, 100)}%`,
        transition: { duration: 0.5 }
      });
    }, 60000);

    // Countdown timer
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      // Nếu hết thời gian và chưa gia hạn
      if (distance < 0 && !isExtended) {
        // Tự động gia hạn thêm 10 phút
        const newEndTime = Date.now() + (10 * 60 * 1000);
        localStorage.setItem('maintenanceExtendedTime', newEndTime.toString());
        setIsExtended(true);
        endTime = newEndTime;
      }

      // Đảm bảo không hiển thị số âm
      const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      const seconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    // Visitor counter logic
    const visitorInterval = setInterval(() => {
      setVisitorCount(prev => {
        // Tính toán số người mới dựa trên thời gian trong ngày
        const hour = new Date().getHours();
        let increment;
        
        // Giờ thấp điểm (9h-11h và 14h-16h)
        if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16)) {
          // 75% tăng, 25% giảm
          if (Math.random() < 0.75) {
            increment = 1;
          } else {
            increment = -1; // Chỉ giảm 1 người
          }
        } 
        // Giờ cao điểm (23h-5h)
        else if (hour >= 23 || hour <= 5) {
          // 85% tăng, 15% giảm
          if (Math.random() < 0.85) {
            increment = Math.floor(Math.random() * 3) + 2; // 2-4 người
          } else {
            increment = -1; // Chỉ giảm 1 người
          }
        }
        // Giờ bình thường
        else {
          // 80% tăng, 20% giảm
          if (Math.random() < 0.8) {
            increment = Math.floor(Math.random() * 2) + 1; // 1-2 người
          } else {
            increment = -1; // Chỉ giảm 1 người
          }
        }

        // Đảm bảo số người không âm
        const newCount = Math.max(0, prev + increment);
        // Lưu số người vào localStorage
        localStorage.setItem('maintenanceVisitorCount', newCount.toString());
        return newCount;
      });
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(progressInterval);
      clearInterval(visitorInterval);
    };
  }, [progressControls, isExtended]);

  // Reset data when maintenance mode is turned off
  useEffect(() => {
    return () => {
      localStorage.removeItem('maintenanceStartTime');
      localStorage.removeItem('maintenanceVisitorCount');
      localStorage.removeItem('maintenanceExtendedTime');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 sm:p-12"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <img
            src={logo}
            alt="Company Logo"
            className="w-40 sm:w-56"
          />
        </motion.div>

        {/* Maintenance Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex justify-center mb-8"
        >
          <FaTools className="w-20 h-20 text-blue-500" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6"
        >
          🚧 Hệ Thống Đang Bảo Trì 🚧
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto"
        >
          Chúng tôi đang nâng cấp hệ thống để mang đến trải nghiệm tốt hơn cho quý khách.
          Vui lòng quay lại sau!
          {isExtended && (
            <span className="block mt-2 text-sm text-blue-600">
              * Thời gian bảo trì đã được gia hạn để đảm bảo chất lượng dịch vụ
            </span>
          )}
        </motion.p>

        {/* Visitor Counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center space-x-2 mb-8"
        >
          <FaUsers className="text-blue-500" />
          <span className="text-gray-700">
            Đang có <span className="font-bold text-blue-600">{visitorCount}</span> người đang chờ
          </span>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8"
        >
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{value}</div>
              <div className="text-sm text-gray-600 capitalize">{unit}</div>
            </div>
          ))}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-gray-50 rounded-xl p-6 mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Liên Hệ Hỗ Trợ
          </h2>
          <div className="flex justify-center">
            <a
              href="https://ttdvkh.rr88cskh.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <FaEnvelope className="text-blue-500" />
              <span className="text-gray-700">ttdvkh.rr88cskh.com</span>
            </a>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8"
        >
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              animate={progressControls}
              className="bg-blue-600 h-2.5 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            Tiến độ nâng cấp: {Math.round(progress)}%
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Maintenance;
