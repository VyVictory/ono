import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/context/AuthProvider";
import { useLocation } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import bgVideo1 from "../img/login/bg1.mp4"; 
import bgVideo2 from "../img/login/bg2.mp4"; 
import bgVideo3 from "../img/login/bg3.mp4"; 
import bgVideo4 from "../img/login/bg4.mp4"; 
import bgVideoMobile from "../img/login/bgMobile.mp4"; 

export default function Auth() {
  const { showLogin, setShowLogin } = useAuth();
  const [formType, setFormType] = useState("login");
  const location = useLocation();
  const videoRef = useRef(null);

  // Danh sách video nền desktop
  const desktopVideos = [bgVideo1, bgVideo2]//bgVideo3,,  bgVideo4]

  // State để lưu video phù hợp với thiết bị
  const [currentVideo, setCurrentVideo] = useState(null);

  // Chọn video theo màn hình (mobile hoặc desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentVideo(bgVideoMobile); // Mobile
      } else {
        setCurrentVideo(desktopVideos[Math.floor(Math.random() * desktopVideos.length)]); // Desktop random
      }
    };

    handleResize(); // Gọi khi component mount
    window.addEventListener("resize", handleResize); // Lắng nghe thay đổi kích thước màn hình

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Giảm tốc độ phát video khi đã có video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // Chạy chậm 50%
    }
  }, [currentVideo]);

  const chaneform = (form) => {
    setFormType(form);
  };

  const renderForm = () => {
    switch (formType) {
      case "register":
        return <Register chaneform={chaneform} />;
      case "login":
        return <Login chaneform={chaneform} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen fixed z-50 flex items-center justify-center">
      {/* Nếu đang ở trang login, hiển thị video nền */}
      {location.pathname === "/login" && currentVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={currentVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Overlay làm mờ nếu không phải trang login */}
      {location.pathname !== "/login" && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
      )}

      {/* Nội dung form login / register */}
      <div className="relative overflow-hidden h-screen w-full px-4 max-w-md">
        {renderForm()}
      </div>
    </div>
  );
}
