import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthProvider";
import { register } from "../../service/auth";
import authToken from "../../service/storage/authToken";

export default function Register({ chaneform }) {
  const { setShowLogin } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.firstName) validationErrors.firstName = "Vui lòng nhập họ.";
    if (!formData.lastName) validationErrors.lastName = "Vui lòng nhập tên.";
    if (!formData.email) {
      validationErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "Email không hợp lệ.";
    }
    if (!formData.password)
      validationErrors.password = "Vui lòng nhập mật khẩu.";
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Mật khẩu không khớp.";
    }
    if (!formData.birthDate)
      validationErrors.birthDate = "Vui lòng nhập ngày sinh.";
    if (!formData.gender) validationErrors.gender = "Vui lòng chọn giới tính.";

    return validationErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await register(formData);
        console.log(response);
        if (response) {
          authToken.setToken(response.token);
          toast.success("Đăng ký thành công!");
          setTimeout(() => {
            if (window.location.pathname === "/login") {
              window.location.href = "/";
            } else {
              window.location.reload();
            }
          }, 1000);
        }
      } catch (error) {
        toast.error("Đăng ký thất bại, vui lòng thử lại.");
      }
    } else {
      setErrors(validationErrors);
    }
  };
  const primaryStar = () => {
    return <div className="text-red-500 mr-1">*</div>;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="flex justify-center items-center h-screen w-full  ">
      <div className="relative bg-gradient-to-br to-purple-200 from-pink-200 p-0.5 rounded-2xl w-full my-4 max-w-sm">
        <div className="bg-white  rounded-xl p-6 pb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl w-full text-center font-bold text-gray-800">
              Đăng ký
            </h1>
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-0 right-0 p-2 rounded-full"
            >
              <XMarkIcon className="h-8 w-8 hover:bg-red-200 rounded-lg" />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <InputField
              label="Email"
              name="email"
              onHoder="Nhập email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Họ"
                name="firstName"
                onHoder="Nhập họ"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              <InputField
                label="Tên"
                name="lastName"
                onHoder="Nhập tên"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Mật khẩu"
                name="password"
                type="password"
                onHoder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <InputField
                label="Nhập lại mật khẩu"
                name="confirmPassword"
                type="password"
                onHoder="Nhập mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Ngày sinh"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                error={errors.birthDate}
              />
              <div>
                <label className="flex flex-row text-black text-sm font-medium ">
                  {primaryStar()}Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-2 block w-full px-4 py-3 min-h-[46.3px] rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none bg-gray-100 shadow-inner shadow-gray-200"
                >
                  <option value="">Chọn</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
              </div>
            </div>

            {/* <button
            onClick={handleSubmit}
            className="w-full py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-sm shadow-violet-600 hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            Đăng ký
          </button> */}

            <div className="pb-2 px-2 space-y-4 ">
              <div className="w-full flex justify-between text-sm text-gray-600">
                <span>Đã có tài khoản?</span>{" "}
                <button
                  onClick={() => chaneform("login")}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Đăng nhập ngay
                </button>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                class="text-white  w-full py-3  bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 text-center me-2"
              >
                Đăng ký
              </button>
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
}

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  onHoder,
}) => (
  <div>
    <label className="flex flex-row text-black text-sm font-medium">
      <div className="text-red-500 mr-1">*</div>
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={onHoder}
      className={`mt-2 block w-full px-4 py-3  rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-inner shadow-gray-200 ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && (
      <p className="text-red-500 text-xs" style={{ marginBottom: "-10px" }}>
        {error}
      </p>
    )}
  </div>
);
