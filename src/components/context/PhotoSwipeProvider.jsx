import { createContext, useContext, useEffect, useRef } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

const PhotoSwipeContext = createContext();

export const PhotoSwipeProvider = ({ children }) => {
  const lightbox = useRef(null);

  useEffect(() => {
    lightbox.current = new PhotoSwipeLightbox({
      gallery: "#gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.current.init();

    return () => {
      if (lightbox.current) {
        lightbox.current.destroy();
        lightbox.current = null;
      }
    };
  }, []);
  const openGallery = (index, galleryId) => {
    if (lightbox.current) {
      lightbox.current.destroy();
    }

    lightbox.current = new PhotoSwipeLightbox({
      gallery: `#${galleryId}`,
      children: "a",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.current.init();
    lightbox.current.loadAndOpen(index);
  };

  return (
    <PhotoSwipeContext.Provider value={{ openGallery }}>
      {children}
    </PhotoSwipeContext.Provider>
  );
};

export const usePhotoSwipe = () => useContext(PhotoSwipeContext);
