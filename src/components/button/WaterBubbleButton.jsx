import React, { useState } from "react";

const WaterBubbleButton = ({ children, onClick }) => {
  const [ripple, setRipple] = useState([]);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = { id: Date.now(), size, x, y };
    setRipple((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipple((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <button
      onClick={(e) => {
        createRipple(e);
        if (onClick) onClick();
      }}
      className="relative w-full h-full p-2  border border-gray-100 shadow-gray-200 text-black rounded-full flex items-center justify-center shadow-lg  transition-transform duration-300 hover:scale-110 active:scale-95 overflow-hidden"
    >
      {children}
      {ripple.map((r) => (
        <span
          key={r.id}
          className="absolute bg-white opacity-95 rounded-full transform scale-0 animate-ripple"
          style={{
            width: `${r.size}px`,
            height: `${r.size}px`,
            top: `${r.y}px`,
            left: `${r.x}px`,
          }}
        />
      ))}
    </button>
  );
};

export default WaterBubbleButton;
