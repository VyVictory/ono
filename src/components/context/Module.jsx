import React, { createContext, useContext, useState, useEffect } from "react";
import Privacy from "../Auth/Privacy";
import EditProfile from "../Auth/EditProfile/EditProfile";
import ImageZoomModal from "../ImageZoomModal";
import UpdatePostModal from "../UpdatePostModal";
import { PostDetail } from "../../pages/post/PostDetail";
import ReportModal from "../ReportModal";
import ShareWithFriendsModal from "../ShareWithFriendsModal";
const ModuleContext = createContext();
export const ModuleProvider = ({ children }) => {
  const [usecase, setUsecase] = useState(null);
  const [updatePost, setUpdatePost] = useState(null);
  const [cmtVisible, setCmtVisible] = useState(null);
  const [postUpdateData, setPostUpdateData] = useState(null);
  const [usecase1, setUsecase1] = useState(null);
  const [zoomImg, setZoomImg] = useState(null);
  const [postId, setPostId] = useState(null);
  const [addPost, setAddPost] = useState(null);
  const [report, setReport] = useState();
  const [share, setShare] = useState(null);
  //{type,id}
  const [fetchCmt, setFetchCmt] = useState(false);
  return (
    <ModuleContext.Provider
      value={{
        fetchCmt,
        share,
        setShare,
        setFetchCmt,
        usecase,
        setUsecase,
        usecase1,
        setUsecase1,
        setZoomImg,
        postId,
        setPostId,
        addPost,
        setAddPost,
        updatePost,
        setUpdatePost,
        postUpdateData,
        setPostUpdateData,
        cmtVisible,
        setCmtVisible,
        report,
        setReport,
      }}
    >
      {children}
      <Privacy isOpen={usecase == "Privacy"} onClose={() => setUsecase(null)} />
      <EditProfile
        isOpen={usecase == "EditProfile"}
        onClose={() => setUsecase(null)}
      />
      {updatePost && <UpdatePostModal postId={updatePost} />}
      {postId && <PostDetail PostId={postId} />}
      {zoomImg && (
        <ImageZoomModal imageUrl={zoomImg} onClose={() => setZoomImg(null)} />
      )}
      <ReportModal open={report} onClose={() => setReport(null)} />
      <ShareWithFriendsModal open={share} onClose={() => setShare(null)} />
    </ModuleContext.Provider>
  );
};

export const useModule = () => useContext(ModuleContext);
