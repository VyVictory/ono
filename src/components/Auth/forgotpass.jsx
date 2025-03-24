import React, { useState, useEffect } from "react";
import { href, Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { forgotPassword } from "../../service/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { FcGoogle } from "react-icons/fc";
import LoadingAnimation from "../LoadingAnimation";

export default function Forgotpass({ chaneform }) {
  const { setShowLogin } = useAuth();
  const [formData, setFormData] = useState({ identifier: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const validationErrors = {};
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);
    const isPhoneNumber = /^[0-9]{10,15}$/.test(formData.identifier);

    if (!formData.identifier) {
      validationErrors.identifier = "Vui lòng nhập email hoặc số điện thoại.";
    } else if (!isEmail && !isPhoneNumber) {
      validationErrors.identifier =
        "Không hợp lệ. Vui lòng nhập email hoặc số điện thoại.";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);
      const requestData = isEmail
        ? { email: formData.identifier }
        : { numberPhone: formData.identifier };

      const res = await forgotPassword(requestData);
      if (res.status === 200) {
        setSuccessMessage(
          `Vui lòng kiểm tra hộp thư hoặc thư mục rác của bạn tại  <${formData.identifier}> để nhận hướng dẫn đặt lại mật khẩu.`
        );
      } else {
        toast.error(`Gửi thất bại: ${res.data.message}`, { autoClose: 1500 });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!", { autoClose: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100dvh] w-full">
      <div className="relative bg-gradient-to-br to-purple-100 from-pink-100 p-0.5 shadow-lg rounded-2xl w-full my-4 max-w-sm">
        <div className="bg-white rounded-xl p-4">
          <div className="p-8 px-8">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-0 right-0 p-2 rounded-full"
            >
              <XMarkIcon className="h-8 w-8 hover:bg-red-200 rounded-lg" />
            </button>
            <h1 className="text-2xl w-full text-center font-bold text-gray-800 mb-12">
              Quên mật khẩu
            </h1>

            {successMessage ? (
              <p className="text-center text-green-700 text-xl font-medium">
                {successMessage}
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label
                    htmlFor="identifier"
                    className="block text-gray-600 text-sm font-medium"
                  >
                    Email hoặc Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={(e) =>
                      setFormData({ ...formData, identifier: e.target.value })
                    }
                    className="mt-2 block w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-inner shadow-gray-200"
                    placeholder="Nhập email hoặc số điện thoại"
                  />
                  {errors.identifier && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.identifier}
                    </p>
                  )}
                </div>

                {!loading ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="text-white w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 font-medium rounded-lg text-sm px-5 text-center mb-2"
                  >
                    Nhận mật khẩu mới
                  </button>
                ) : (
                  <div className="w-full flex justify-center items-center">
                    <LoadingAnimation />
                  </div>
                )}
              </form>
            )} 
            <div className="flex items-center justify-between mt-3 mb-4 text-nowrap">
              <div className="text-sm text-gray-400 hover:underline">
                Chưa có tài khoản?
              </div>
              <button
                onClick={() => chaneform("register")}
                className="text-sm text-blue-500 hover:underline"
              >
                Đăng ký ngay
              </button>
            </div>
            <div className="w-full p-2 flex flex-row space-x-2">
              <div className="w-full h-3 border-b "></div>
              <div>hoặc</div>
              <div className=" w-full h-3 border-b"></div>
            </div>
            <div className="w-full px-10 mt-3 flex justify-end items-center">
              <a
                // onClick={openLoginPopup}
                href="https://ono-wtxp.onrender.com/auth/google/callback"
                className="flex items-center justify-center gap-2 border border-gray-300 px-4 py-2 rounded-lg shadow-md bg-white hover:bg-gray-100 transition w-full"
              >
                <FcGoogle className="text-xl" />
                <span className="text-gray-700 font-medium">
                  Đăng Nhập Google
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
