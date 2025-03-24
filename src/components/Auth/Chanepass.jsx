import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingAnimation from "../LoadingAnimation";
import axios from "axios";
import { resetPass, verrifyOTP } from "../../service/auth";
import { FcGoogle } from "react-icons/fc";
export default function ChangePass({ otp, chaneform }) {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpValid, setOtpValid] = useState(null);

  useEffect(() => {
    const fetchVerify = async () => {
      try {
        const res = await verrifyOTP(otp);
        if (res.status === 200) {
          setOtpValid(true);
        } else {
          setOtpValid(false);
        }
      } catch (error) {
        setOtpValid(false);
      }
    };
    fetchVerify();
  }, [otp]);

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.newPassword) {
      validationErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
    }
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Vui lòng nhập lại mật khẩu.";
    } else if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Mật khẩu không khớp.";
    }
    return validationErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await resetPass(formData.newPassword, otp);

        if (response.status === 200) {
          toast.success("Đổi mật khẩu thành công!");
          setTimeout(() => chaneform("login"), 1000);
        } else {
          toast.error("Đổi mật khẩu thất bại, vui lòng thử lại.");
        }
      } catch (error) {
        toast.error("Đổi mật khẩu thất bại, vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  return (
    <div className="flex justify-center items-center h-[100dvh] w-full">
      <div className="relative bg-gradient-to-br to-purple-100 from-pink-100 p-0.5 shadow-lg shadow-black rounded-2xl w-full my-4 max-w-sm">
        <div className="bg-white rounded-xl p-4">
          <div className="p-8 px-8">
            <div className="flex justify-between items-center">
              <button
                onClick={() => chaneform("login")}
                className="absolute top-0 right-0 p-2 rounded-full"
              >
                <XMarkIcon className="h-8 w-8 hover:bg-red-200 rounded-lg" />
              </button>
              <h1 className="text-2xl w-full text-center font-bold text-gray-800 mb-12">
                Đổi Mật Khẩu
              </h1>
            </div>

            {otpValid === false ? (
              <p className="text-red-500 text-center font-medium">
                Mã OTP đã hết hạn hoặc không hợp lệ!
              </p>
            ) : (
              <>
                <div className="mb-5">
                  <label className="block text-gray-600 text-sm font-medium">
                    Nhập mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="mt-2 block w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-inner shadow-gray-200"
                    placeholder="Nhập mật khẩu mới"
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="mb-5">
                  <label className="block text-gray-600 text-sm font-medium">
                    Nhập lại mật khẩu
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-2 block w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-inner shadow-gray-200"
                    placeholder="Nhập lại mật khẩu"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {!loading ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-white w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 font-medium rounded-lg text-sm px-5 text-center mb-2"
                  >
                    Đổi mật khẩu
                  </button>
                ) : (
                  <div className="w-full flex justify-center items-center">
                    <LoadingAnimation />
                  </div>
                )}
              </>
            )}
            <div className="flex items-center justify-between mt-3 mb-4 text-nowrap">
              <button
                onClick={() => chaneform("login")}
                className="text-sm text-blue-500 hover:underline"
              >
                Đăng nhập
              </button>
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
