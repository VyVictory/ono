import React, { createContext, useContext, useState, useEffect } from "react";
import Privacy from "../Auth/Privacy";
import EditProfile from "../Auth/EditProfile/EditProfile";
import ImageZoomModal from "../ImageZoomModal";
const ModuleContext = createContext();
export const ModuleProvider = ({ children }) => {
  const [usecase, setUsecase] = useState(null);
  const [usecase1, setUsecase1] = useState(null);
  const [zoomImg, setZoomImg] = useState(null);
  return (
    <ModuleContext.Provider
      value={{ usecase, setUsecase, usecase1, setUsecase1,setZoomImg }}
    >
      {children}
      <Privacy isOpen={usecase == "Privacy"} onClose={() => setUsecase(null)} />
      <EditProfile
        isOpen={usecase == "EditProfile"}
        onClose={() => setUsecase(null)}
      />

      {zoomImg && (
        <ImageZoomModal imageUrl={zoomImg} onClose={() => setZoomImg(null)} />
      )}
    </ModuleContext.Provider>
  );
};

export const useModule = () => useContext(ModuleContext);
