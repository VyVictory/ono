import { useEffect, useRef, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { Button } from "@mui/material";
import { ModuleProvider, useModule } from "../../context/Module";
import { AnimatePresence, motion } from "framer-motion";
import { EditChane } from "./EditChane";
const EditProfile = ({ isOpen, onClose,  }) => {
  const { set } = useModule();
  const [editField, setEditField] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Nguyen Van A",
    email: "example@email.com",
    phone: "0123456789",
  });
  const modalRef = useRef(null);
  const fields = ["name", "email", "phone"];

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (modalRef.current && !modalRef.current.contains(event.target)) {
  //       onClose();
  //     }
  //   };
  //   if (isOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [isOpen, onClose]);

  const handleSave = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    setIsDialogOpen(false);
  };

  const openEditDialog = (field) => {
    setEditField(field);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 lg:px-0 z-40"
          onClick={onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-xl shadow-lg w-96"
          >
            <h2 className="text-lg font-semibold">Thông tin cá nhân</h2>
            {fields.map((field) => (
              <div
                key={field}
                className="flex justify-between items-center mt-2"
              >
                <p className="text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
                  {user[field]}
                </p>
                <button
                  onClick={() => openEditDialog(field)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </Dialog>
      {editField && (
        <EditChane
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          field={editField}
          value={user[editField]}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default EditProfile;
