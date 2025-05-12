import React, { createContext, useContext, useState, useEffect } from "react";
import Privacy from "../Auth/Privacy";
import EditProfile from "../Auth/EditProfile/EditProfile";
import ImageZoomModal from "../ImageZoomModal";
import UpdatePostModal from "../UpdatePostModal";
const ModuleContext = createContext();
export const ModuleProvider = ({ children }) => {
  const [usecase, setUsecase] = useState(null);
  const [updatePost, setUpdatePost] = useState(null);
  const [postUpdateData, setPostUpdateData] = useState(null);
  const [usecase1, setUsecase1] = useState(null);
  const [zoomImg, setZoomImg] = useState(null);
  const [addPost, setAddPost] = useState(null);
  return (
    <ModuleContext.Provider
      value={{
        usecase,
        setUsecase,
        usecase1,
        setUsecase1,
        setZoomImg,
        addPost,
        setAddPost,
        updatePost,
        setUpdatePost,
        postUpdateData,
        setPostUpdateData,
      }}
    >
      {children}
      <Privacy isOpen={usecase == "Privacy"} onClose={() => setUsecase(null)} />
      <EditProfile
        isOpen={usecase == "EditProfile"}
        onClose={() => setUsecase(null)}
      />
      {updatePost && <UpdatePostModal postId={updatePost} />}

      {zoomImg && (
        <ImageZoomModal imageUrl={zoomImg} onClose={() => setZoomImg(null)} />
      )}
    </ModuleContext.Provider>
  );
};

export const useModule = () => useContext(ModuleContext);
