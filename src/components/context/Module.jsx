import React, { createContext, useContext, useState, useEffect } from "react";
import Privacy from "../Auth/Privacy";
import EditProfile from "../Auth/EditProfile/EditProfile";
import ImageZoomModal from "../ImageZoomModal";
import CallModel from "../call/CallModel";
import { useSocketContext } from "./socketProvider";
const ModuleContext = createContext();
export const ModuleProvider = ({ children }) => {
  const [usecase, setUsecase] = useState(null);
  const { socket } = useSocketContext();
  const [usecase1, setUsecase1] = useState(null);
  const [zoomImg, setZoomImg] = useState(null);
  const [addPost, setAddPost] = useState(null);
  const [callId, setCallId] = useState(null); 
  return (
    <ModuleContext.Provider
      value={{
        usecase,
        setUsecase,
        setCallId,
        callId,
        usecase1,
        setUsecase1,
        setZoomImg,
        addPost,
        setAddPost,
      }}
    >
      {children}
      <Privacy isOpen={usecase == "Privacy"} onClose={() => setUsecase(null)} />
      <EditProfile
        isOpen={usecase == "EditProfile"}
        onClose={() => setUsecase(null)}
      />
      <CallModel
        isOpen={usecase == "Call"}
        onClose={() => {setUsecase(null); setCallId(null)}}
        id={callId}
        socket={socket}
      />
      {zoomImg && (
        <ImageZoomModal imageUrl={zoomImg} onClose={() => setZoomImg(null)} />
      )}
    </ModuleContext.Provider>
  );
};

export const useModule = () => useContext(ModuleContext);
