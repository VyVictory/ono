import { useState, useEffect } from "react";

export default function ImageGallery({ images }) {
  const [sortedImages, setSortedImages] = useState([]);
  const maxVisibleImages = 8; // Giới hạn ảnh hiển thị, ảnh dư vào ô cuối cùng

  useEffect(() => {
    if (!images || images.length === 0) return;

    const fetchImageSizes = async () => {
      const classifiedImages = await Promise.all(
        images.map((img) => {
          return new Promise((resolve) => {
            const image = new Image();
            image.src = img.url;
            image.onload = () => {
              const { width, height } = image;
              let type = "square";

              if (height >= 1.7 * width) {
                type = "tall";
              } else if (width >= 1.7 * height) {
                type = "wide";
              }

              resolve({ ...img, width, height, type });
            };
          });
        })
      );

      setSortedImages(classifiedImages);
    };

    fetchImageSizes();
  }, [images]);

  const visibleImages = sortedImages.slice(0, maxVisibleImages - 1);
  const remainingCount = sortedImages.length - visibleImages.length;

  return (
    <div className="grid grid-cols-3 gap-2 auto-rows-[150px]">
      {visibleImages.map((item, index) => (
        <div
          key={index}
          className={`overflow-hidden rounded-md shadow-md
            ${item.type === "tall" ? "row-span-2 h-[calc(2*150px+0.5rem)] flex items-center justify-center" : "h-[150px]"}
            ${item.type === "wide" ? "col-span-2 w-full" : ""}
          `}
        >
          <img
            src={item.url}
            alt="image"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="relative flex items-center justify-center bg-gray-200 rounded-md shadow-md h-[150px]">
          <span className="text-xl font-bold text-gray-700">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
}
