import { useEffect, useRef, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { Button } from "@mui/material";

const EditChane = ({ isOpen, onClose, field, value, onSave }) => {
  const [inputValue, setInputValue] = useState(value);
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = () => {
    onSave(field, inputValue);
  };
  const modalRef = useRef(null);
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

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-80">
        <Dialog.Title className="text-lg font-semibold">
          Chỉnh sửa {field}
        </Dialog.Title>
        <input
          type={field === "email" ? "email" : "text"}
          name={field}
          value={inputValue}
          onChange={handleChange}
          className="w-full p-2 mt-2 border rounded-md"
          placeholder={`Nhập ${field}`}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outlined" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Lưu
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
export { EditChane };
