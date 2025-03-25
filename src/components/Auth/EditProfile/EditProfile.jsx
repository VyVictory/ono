import { useEffect, useRef, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { Button, Paper } from "@mui/material";
import { toast } from "react-toastify";
import { ModuleProvider, useModule } from "../../context/Module";
import { AnimatePresence, motion } from "framer-motion";
import { EditChane } from "./EditChane";
import { useAuth } from "../../context/AuthProvider";
import LoadingAnimation from "../../LoadingAnimation";
import { editUser } from "../../../service/user";
import { useProfile } from "../../context/profile/ProfileProvider";
const EditProfile = ({ isOpen, onClose }) => {
  const { set } = useModule();
  const { profile, setProfile } = useAuth();
  const [editField, setEditField] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const modalRef = useRef(null);
  const fields = ["firstName", "lastName", "gender", "title", "birthDate"];

  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile]);

  const handleSave = (field, value) => {
    const updatedField = { [field]: value }; // Chỉ cập nhật trường cụ thể

    editUser(updatedField) // Gửi chỉ trường cần cập nhật
      .then((response) => {
        if (response) {
          setUser((prev) => ({ ...prev, ...updatedField })); // Cập nhật state user
          setProfile((prev) => ({ ...prev, ...updatedField })); // Cập nhật profile chỉ với trường đó
          toast.success("Cập nhật thành công! 🎉");
        }
      })
      .catch((error) => {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        console.error(error);
      });

    setIsDialogOpen(false);
  };

  const openEditDialog = (field) => {
    setEditField(field);
    setIsDialogOpen(true);
  };
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  const fieldLabels = {
    firstName: "Họ",
    lastName: "Tên",
    gender: "Giới tính",
    title: "Chức danh",
    birthDate: "Ngày sinh",
  };

  if (!user) return <></>;
  return (
    <>
      <Dialog open={isOpen} onClose={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "linear" }}
          className="fixed inset-0 flex items-center justify-center   bg-opacity-50 bg-black px-4 lg:px-0 z-50"
          onClick={onClose}
        >
          <Paper
            onClick={(e) => e.stopPropagation()}
            className="w-96 max-w-[90dvh] border-2"
          >
            <div className="w-full h-full border-violet-100  p-4 bg-violet-50">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
                Thông tin cá nhân
              </h2>
              <div className="mt-4 space-y-4">
                {fields.map((field) => (
                  <div
                    key={field}
                    className="flex justify-between items-center shadow-inner shadow-blue-100 px-4 py-2 rounded-lg"
                  >
                    <p className="text-gray-700">
                      <span className="font-medium">{fieldLabels[field]}:</span>{" "}
                      {field === "birthDate"
                        ? formatDate(user[field])
                        : user[field]}
                    </p>
                    <button
                      onClick={() => openEditDialog(field)}
                      className="text-gray-600 hover:text-blue-600 transition"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Paper>
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
