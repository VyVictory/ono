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
      className="relative flex  justify-center  " //bg-black
      style={{ minHeight: heightBG }}
    >
      {/* left */}
      <div className={`h-full  w-full min-h-screen  flex justify-center `}>
        <div
          ref={targetRefH}
          className={`pb-4 space-y-4 hidden  w-full md:flex profileW py-4 flex-row ${
            isPassed ? "fixed bottom-0" : ""
          }`}
        >
          <div className="flex flex-col  w-2/5 space-y-4 md:pl-4">
            <PostLeft data={data} />
          </div>
          <div className="  min-h-screen w-3/5 hidden md:block"></div>
        </div>
      </div>
      <div className="absolute">
        <div className="bg-violet-600 " style={{ height: `${height}px` }}></div>
        <div className="w-full" ref={targetRef}></div>
      </div>
      {/* right */}
      <div
        ref={violetRef}
        className="absolute py-4"
        style={{ pointerEvents: "none" }}
      >
        <div className="  w-full flex profileW justify-center md:pl-8">
          <div className="flex flex-row justify-center">
            {/* // độn div left */}
            <div className="  min-h-screen w-2/5 hidden md:block"></div>
            <div
              className="flex flex-col space-y-4   md:w-3/5 px-5 md:pr-4 md:px-0"
              style={{ pointerEvents: "auto" }}
            >
              <PostRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProfile;
