import { useState, useRef, useEffect } from "react";
import { PencilIcon, XCircleIcon } from "@heroicons/react/24/solid";

const Privacy = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState({
    email: "example@gmail.com",
    password: "********",
    phone: "0123456789",
  });

  const [editingField, setEditingField] = useState(null);
  const modalRef = useRef(null);

  // Đóng khi click bên ngoài modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [editingField]: e.target.value });
  };

  const handleSave = () => {
    setEditingField(null);
  };

  return (
    isOpen && (
      <div className="w-full min-h-full fixed z-50 bg-black bg-opacity-50 transition-opacity flex items-center justify-center inset-0">
        <div ref={modalRef} className="bg-white p-6 rounded-xl shadow-lg w-96">
          <h2 className="text-xl font-bold text-center mb-4">
            Chỉnh sửa thông tin
          </h2>
          <div className="space-y-4">
            {["email", "password", "phone"].map((field) => (
              <div
                key={field}
                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
              >
                {editingField === field ? (
                  <input
                    type={field === "password" ? "password" : "text"}
                    value={profile[field]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-0 focus:ring-none focus:outline-none"
                  />
                ) : (
                  <span className="flex-1">{profile[field]}</span>
                )}
                {editingField === field ? (
                  <XCircleIcon
                    className="h-6 w-6 text-red-500 cursor-pointer ml-2"
                    onClick={() => setEditingField(null)}
                  />
                ) : (
                  <PencilIcon
                    className="h-6 w-6 text-blue-500 cursor-pointer ml-2"
                    onClick={() => handleEdit(field)}
                  />
                )}
              </div>
            ))}
          </div>
          <button
            className="w-full mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            onClick={handleSave}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    )
  );
};
export default Privacy;
// Component chính để hiển thị nút mở modal
