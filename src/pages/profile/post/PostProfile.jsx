import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "../../../components/context/AuthProvider";
import "../../../css/post.css";
import PostLeft from "./PostLeft";
import PostRight from "./PostRigh";
const PostProfile = ({ data }) => {
  const scrollRef = useRef(null);
  const targetRef = useRef(null);
  const targetRefH = useRef(null);

  const [isPassed, setIsPassed] = useState(false);
  const [height, setHeight] = useState(0);
  // Cập nhật chiều cao
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (targetRefH.current) {
        setHeight(targetRefH.current.offsetHeight);
      }
    });
    // console.log("dawdaw");
    targetRefH.current && observer.observe(targetRefH.current);
    return () => observer.disconnect();
  }, []);
  // Cuộn đến phần tử khi render
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  const violetRef = useRef(null);
  const [heightBG, setHeightBG] = useState(0);

  useEffect(() => {
    if (violetRef.current) {
      setHeightBG(violetRef.current.offsetHeight);
    }
  }, []);
  // Xử lý sự kiện cuộn
  const handleScroll = useCallback(() => {
    if (targetRef.current && height != 0) {
      const rect = targetRef.current.getBoundingClientRect();
      setIsPassed(rect.bottom - window.innerHeight < 0);
    }
  }, [height]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  return (
    <div
      className="relative  flex" //bg-black
      style={{ minHeight: heightBG }}
    >
      {/* left */}
     
    </div>
  );
};

export default PostProfile;
