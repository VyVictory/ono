import { useState } from "react";


const CustomButton = ({ children, className = "", ...props }) => {
  const [ripple, setRipple] = useState([]);

  const addRipple = (event) => {
    const { clientX, clientY, currentTarget } = event;
    const rect = currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;

    setRipple([...ripple, { x, y, size }]);

    setTimeout(() => {
      setRipple((prev) => prev.slice(1));
    }, 600);
  };

  return (
    <button
      {...props}
      className={`relative overflow-hidden p-3 rounded-xl hover:bg-gray-100 ${className}`}
      onClick={addRipple}
    >
      {children}
      <span className="absolute inset-0 flex justify-center items-center">
        {ripple.map((r, i) => (
          <span
            key={i}
            className="absolute bg-black opacity-30 rounded-full transform scale-0 animate-ripple"
            style={{
              width: r.size,
              height: r.size,
              left: r.x,
              top: r.y,
            }}
          ></span>
        ))}
      </span>
    </button>
  );
};

export default CustomButton;
