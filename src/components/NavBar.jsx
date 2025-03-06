import React, { useState, useEffect, useRef, use } from "react";
import {
  VideoCameraIcon,
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  ArrowLeftIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline"; // Import icon
import logo from "../img/logo.gif";
import avt from "../img/DefaultAvatar.jpg";
import LinkTo from "./LinkTo";
import UserDropDow from "./UserDropDow";
import { useAuth } from "./context/AuthProvider";
import SearchList from "./searchUser";

const NavBar = () => {
  const { showLogin, setShowLogin, profile, isLoadingProfile } = useAuth();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState(null);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const inputSearchRef = useRef(null);
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isDropdownVisible) {
      setIsDropdownVisible(false);
    }
  };

  const toggleMenu = () => {
    setIsDropdownVisible(!isDropdownVisible);
    if (isSearchVisible) {
      setIsSearchVisible(false);
    }
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearchVisible(false);
    }
  };

  useEffect(() => {
    if (isDropdownVisible || isSearchVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownVisible, isSearchVisible]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsDropdownVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const menuItems = [
    { icon: HomeIcon, label: "Home", namepage: "home" },
    { icon: VideoCameraIcon, label: "Videos", namepage: "videos" },
    { icon: UsersIcon, label: "Friends", namepage: "groups" },
    { icon: ShoppingBagIcon, label: "Marketplace", namepage: "store" },
  ];
  const [width, setWidth] = useState(234.913); // State to hold the current width

  // Update width on render
  useEffect(() => {
    if (inputSearchRef.current && inputSearchRef.current >= 234.913) {
      setWidth(inputSearchRef.current.offsetWidth); // Set the initial width dynamically
    }
  }, []);
  return (
    <nav
      className="HighNavbar bg-white shadow-md fixed w-screen flex justify-items-center z-40 "
      style={{ minWidth: "screen" }}
    >
      <div className="flex w-[100%] ">
        {/* Left: Logo and Search bg */}
        <div
          ref={searchRef}
          className={`z-10  left-0 top-0 flex flex-col w-full max-w-[300px]  ${
            isSearchVisible &&
            "border-r-2 absolute bg-white shadow-lg rounded-br-lg"
          } `}
        >
          {/* Phần trên: Logo và ô tìm kiếm */}
          <div className="HighNavbar flex items-center justify-end h-full px-2 space-x-1  w-full">
            {/* Logo hoặc nút quay lại */}
            {isSearchVisible ? (
              <button
                onClick={() => setIsSearchVisible(false)}
                className="h-10 w-6 flex items-center"
              >
                <ArrowLeftIcon className="h-6 w-6 text-blue-500 hover:scale-125 " />
              </button>
            ) : (
              <button className="w-10 h-10 ">
                <img className=" w-10 rounded-full" src={logo} alt="" />
              </button>
            )}
            {/* Ô tìm kiếm */}
            <div
              ref={inputSearchRef}
              className={`flex w-full items-center flex-grow transition-all duration-300 ease-in-out`}
              style={{
                maxWidth: isSearchVisible ? "350px" : width, // Transition width
                overflow: "hidden",
              }}
            >
              {/* Nút mở ô tìm kiếm */}
              <button onClick={() => setIsSearchVisible(true)}>
                <MagnifyingGlassIcon
                  className={`h-10 w-10 stroke-gray-300 p-2 bg-slate-100 hover:stroke-violet-400
            ${
              isSearchVisible
                ? "rounded-l-full "
                : "rounded-full lg:rounded-r-none"
            }`}
                />
              </button>

              {/* Input tìm kiếm */}
              <div
                className={`relative w-full bg-slate-100 border-gray-300 rounded-r-full ${
                  isSearchVisible ? "block" : "hidden lg:block"
                }`}
              >
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={() => setIsSearchVisible(true)}
                  placeholder="Tìm kiếm trên O no"
                  className="w-full py-2 h-10 border rounded-md focus:outline-none focus:ring-0 bg-transparent border-none px-4 pr-10"
                />

                {/* Nút X để xóa nội dung tìm kiếm */}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Phần dưới: Hiển thị kết quả tìm kiếm */}
          {isSearchVisible && <SearchList value={searchTerm} />}
        </div>

        <div className="flex-grow"></div>
        {/* Right: Profile and Menu */}
        <div className="flex items-center sm:space-x-2 space-x-1 pr-4 ">
          <button
            className="lg:hidden  bg-gray-100 p-2 rounded-full hover:bg-blue-100 hover:ring-2 hover:ring-blue-200 transition duration-300"
            onClick={toggleMenu}
          >
            <Bars3Icon className="h-7 w-7 text-gray-700 hover:text-blue-500 transition" />
          </button>
          <LinkTo namepage="messages">
            <div className="bg-gray-100 p-2 rounded-full hover:bg-blue-100 hover:ring-2 hover:ring-blue-200 transition duration-300">
              <ChatBubbleLeftIcon className="h-7 w-7 text-gray-700 hover:text-blue-500 transition" />
            </div>
          </LinkTo>
          <LinkTo
            namepage="notification"
            css="bg-gray-100 p-2 rounded-full hover:bg-blue-100 hover:ring-2 hover:ring-blue-200 transition duration-300"
          >
            <BellIcon className="h-7 w-7 text-gray-700 hover:text-blue-500 transition" />
          </LinkTo>
          {isLoadingProfile ? (
            <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin" />
          ) : profile === undefined ? (
            <div className="h-12 w-12 bg-gray-300 rounded-full animate-pulse"></div> // Skeleton UI khi chưa có profile
          ) : profile ? (
            // <button
            //   onClick={() => setShowLogin(true)}
            //   className="h-12 w-12 border-2 border-gray-300 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-200 transition duration-300"
            // >
            //   <img
            //     src={avt}
            //     alt="Profile"
            //     className="w-full h-full object-cover"
            //   />
            // </button>
            <UserDropDow avt={avt} />
          ) : (
            <div className="h-full flex py-2">
              {/* <button
                onClick={() => setShowLogin(true)}
                className="px-4 border rounded-md bg-violet-50 border-none  hover:bg-violet-200 transition text-nowrap"
              >
                Đăng nhập
              </button> */}
              <a
                href="/login"
                className="px-4 border rounded-md bg-violet-50 border-none  hover:bg-violet-200 transition text-nowrap flex text-center items-center"
              >
                {" "}
                Đăng nhập
              </a>
            </div>
          )}
        </div>

        <ul style={{ height: "40px" }}></ul>
      </div>
      {/* Center: Navigation Links */}
      <div className="h-[64px] absolute left-1/2 transform -translate-x-1/2 top-0 w-fit flex justify-center">
        <ul className="HighNavbar hidden lg:flex flex-row justify-center gap-3">
          {menuItems.map(({ icon: Icon, namepage }, index) => (
            <div key={index} className="h-full py-1 flex items-center">
              {" "}
              {/*border-b-4 border-blue-500*/}
              <LinkTo
                namepage={namepage}
                css="group flex items-center hover:bg-gray-200 w-24 h-full justify-center rounded-md transition-colors duration-200"
              >
                <div className="flex items-center justify-center h-full w-full aspect-square">
                  <Icon className="h-6 w-6 text-gray-600 transition-colors duration-200 group-hover:text-blue-500 stroke-[1.5]" />
                </div>
              </LinkTo>
            </div>
          ))}
        </ul>
      </div>

      {/* Dropdown Menu */}
      {isDropdownVisible && !isSearchVisible && (
        <div
          ref={dropdownRef}
          className="absolute top-12 right-0 w-48 bg-white shadow-md p-4 rounded-md transition-opacity duration-200"
        >
          <ul className="flex flex-col gap-1">
            {menuItems.map(({ icon: Icon, label, namepage }, index) => (
              <LinkTo
                key={index}
                namepage={namepage}
                css="flex items-center gap-2 p-2 hover:bg-blue-200 rounded-md transition-colors"
              >
                <Icon className="h-6 w-6 " />
                <span className="text-gray-700">{label}</span>
              </LinkTo>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
