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
 
  return (
    <div
      className="relative  flex" //bg-black 
    >
      {/* left */}
     
    </div>
  );
};

export default PostProfile;
