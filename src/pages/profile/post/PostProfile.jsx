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
import Post from "../../../components/post/Post";
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
  const [heightLeft, setHeightLeft] = useState(0);
  const leftRef = useRef(null);
  return (
    <div
      className="relative  flex" //bg-black
      style={{ minHeight: heightBG }}
    >
      {/* left */}
      <div className={`h-full  w-full min-h-screen  flex justify-center `}>
        <div
          ref={targetRefH}
          className={`pb-4  hidden  w-full md:flex profileW   flex-row ${
            isPassed ? "fixed bottom-0 px-3" : ""
          }`}
        >
          {/* chiều cao thẻ này */}
          <div ref={leftRef} className="flex flex-col  w-2/5 ">
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
        className="absolute  pb-2   w-full"
        style={{ pointerEvents: "none", minHeight: `${height}px` }}
      >
        <div className="  w-full flex profileW justify-center md:pl-6 ">
          <div className="flex flex-row justify-center w-full">
            {/* // độn div left */}
            <div className="  min-h-full w-2/5 hidden md:block"></div>
            <div
              className="flex flex-col space-y-3 min-h-full relative md:w-3/5 md:px-0"
              style={{ pointerEvents: "auto" }}
            >
              <div className=" min-h-full ">
                <PostRight data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProfile;
