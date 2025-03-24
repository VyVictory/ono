import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthProvider";
import { login } from "../../service/auth";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import LoadingAnimation from "../LoadingAnimation";
import { Button } from "@headlessui/react";
import authToken from "../../service/storage/authToken";

export default function Login({ chaneform }) {
  const { setShowLogin } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "lhphuc@gmail.com",
    password: "adad",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    if (!formData.password)
      validationErrors.password = "Vui lòng nhập mật khẩu.";
    return validationErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier);
        const requestData = isEmail
          ? { email: formData.identifier, password: formData.password }
          : { numberPhone: formData.identifier, password: formData.password };

        // Gửi yêu cầu đăng nhập
        const { token, user } = await login(requestData);
        console.log(user);

        toast.success(`Chào mừng bạn, ${user?.firstName + user?.lastName}.`, {
          autoClose: 500,
        });

        setTimeout(() => {
          if (window.location.pathname === "/login") {
            window.location.href = "/";
          } else {
            window.location.reload();
          }
        }, 1000);

        setShowLogin(false);
      } catch (error) {
        toast.error(error.message || "Đăng nhập thất bại, vui lòng thử lại.", {
          autoClose: 500,
        });
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
  // Đăng nhập với Google
  const handleGoogleLogin = async (response) => {
    try {
      const googleToken = response.credential;
      if (!googleToken) throw new Error("Không nhận được token từ Google");

      // Gửi token đến server để xác thực
      const { data } = await axios.get(
        "https://ono-wtxp.onrender.com/auth/google/callback",
        { googleToken },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!data.token) throw new Error("Không nhận được token từ server");
      authToken.setToken(data.token);
      setUserData(data.user);
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      alert("Đăng nhập Google thất bại, vui lòng thử lại.");
    }
  };
  const openLoginPopup = () => {
    // Kích thước mặc định cho desktop
    let popupWidth = 500;
    let popupHeight = 600;

    // Nếu là thiết bị di động, dùng full screen
    if (window.innerWidth < 768) {
      popupWidth = window.innerWidth * 0.9;
      popupHeight = window.innerHeight * 0.9;
    }

    const left = (window.innerWidth - popupWidth) / 2;
    const top = (window.innerHeight - popupHeight) / 2;

    window.open(
      "https://ono-wtxp.onrender.com/auth/google/callback",
      "_blank",
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
    );
  };
  return (
    <div className="flex justify-center items-center h-[100dvh] w-full">
      <div className="relative bg-gradient-to-br to-purple-100 from-pink-100 p-0.5  shadow-lg shadow-black  rounded-2xl w-full my-4 max-w-sm">
        <div className="bg-white  rounded-xl p-4">
          <div className="p-8 px-8">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-0 right-0 p-2 rounded-full"
              >
                <XMarkIcon className="h-8 w-8 hover:bg-red-200 rounded-lg" />
              </button>
              <h1 className="text-2xl w-full text-center font-bold text-gray-800 mb-12">
                Đăng nhập
              </h1>
            </div>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none  shadow-inner shadow-gray-200"
                placeholder="Nhập email hoặc số điện thoại"
              />
              {errors.identifier && (
                <p className="text-red-500 text-xs mt-2">{errors.identifier}</p>
              )}
            </div>

            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-gray-600 text-sm font-medium"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none  shadow-inner shadow-gray-200"
                placeholder="Nhập mật khẩu"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            <Link
              to="/forgotpass"
              className="float-right text-sm text-blue-500 hover:underline mb-2"
            >
              Quên mật khẩu?
            </Link>

            {/* <button
            onClick={handleSubmit}
            type="submit"
            className="w-full py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-sm shadow-violet-600 hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button> */}
            {!loading ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                class="text-white w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 text-center me-2 mb-2"
              >
                Đăng nhập
              </button>
            ) : (
              <div className="w-full flex justify-center items-center">
                <LoadingAnimation />
              </div>
            )}
            {/* Nút đăng nhập với Google */}

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
              <button
                onClick={openLoginPopup}
                className="flex items-center justify-center gap-2 border border-gray-300 px-4 py-2 rounded-lg shadow-md bg-white hover:bg-gray-100 transition w-full"
              >
                <FcGoogle className="text-xl" />
                <span className="text-gray-700 font-medium">
                  Đăng Nhập Google
                </span>
              </button>
            </div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
