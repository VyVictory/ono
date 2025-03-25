import { useState, useRef, useEffect } from "react";
import { PencilIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthProvider";
import { editUser } from "../../service/user";
import { toast } from "react-toastify";
import { useConfirm } from "../context/ConfirmProvider";
const Privacy = ({ isOpen, onClose }) => {
  const { profile, setProfile } = useAuth(); // Lấy dữ liệu user từ AuthProvider
  // const confirm = useConfirm();
  const modalRef = useRef(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  // Đóng modal khi click ra ngoài
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
    setTempValue(profile[field] || "");
  };

  const handleSave = async () => {
    if (!editingField) return;
    // if (!(await confirm("Bạn có chắc muốn đổi thông tin không?"))) {
    //   toast.error("Bạn đã hủy thay đổi!");
    //   return;
    // }
    try {
      await editUser({ [editingField]: tempValue }); // Gọi API cập nhật dữ liệu
      setProfile((prev) => ({ ...prev, [editingField]: tempValue })); // Cập nhật state
      toast.success("Cập nhật thành công! 🎉");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error(error);
    }
    setEditingField(null);
  };

  return (
    isOpen && (
      <div className="w-full min-h-full fixed z-50 bg-black bg-opacity-50 flex items-center justify-center inset-0">
        <div ref={modalRef} className="bg-white p-6 rounded-xl shadow-lg w-96">
          <h2 className="text-xl font-bold text-center mb-4">
            Chỉnh sửa thông tin
          </h2>
          <div className="space-y-4">
            {["email", "phoneNumber"].map((field) => (
              <div
                key={field}
                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
              >
                {editingField === field ? (
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-0 focus:outline-none"
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
            disabled={!editingField}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    )
  );
};

export default Privacy;
