import { useEffect, useState } from "react";
import { getSearchUser } from "../service/user";
import { XMarkIcon } from "@heroicons/react/24/solid";
import avt from "../img/DefaultAvatar.jpg";

const SearchList = ({ value }) => {
  const [searchListUser, setSearchListUser] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  // Tải lịch sử tìm kiếm từ localStorage khi mở trang
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);
  }, []);

  // Gọi API khi có giá trị tìm kiếm
  useEffect(() => {
    if (!value) return;

    const fetchUsers = async () => {
      const response = await getSearchUser(value);
      if (response) {
        setSearchListUser(response);
      } else {
        setSearchListUser([]);
      }
    };

    fetchUsers();
  }, [value]);

  // Lưu lịch sử tìm kiếm
  const handleSaveSearch = (profile) => {
    const newHistory = [...searchHistory];

    // Kiểm tra xem user đã có trong lịch sử chưa
    if (!newHistory.find((item) => item._id === profile._id)) {
      newHistory.unshift(profile); // Thêm vào đầu danh sách
      if (newHistory.length > 5) newHistory.pop(); // Giới hạn 5 kết quả
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    }
  };

  // Xóa một người dùng khỏi lịch sử tìm kiếm
  const handleRemoveHistory = (id) => {
    const updatedHistory = searchHistory.filter((user) => user._id !== id);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    setSearchHistory(updatedHistory);
  };

  return (
    <div className=" px-1 bg-white shadow-md rounded-lg">
      {!value ? (
        <ul className="space-y-2">
          <li className="font-bold text-lg text-gray-700">Lịch sử tìm kiếm</li>
          {searchHistory.length > 0 ? (
            searchHistory.map((profile) => (
              <div
                key={profile._id}
                className="flex justify-between items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 duration-150 rounded-lg shadow-sm"
              >
                <a
                  href={`/profile/posts?id=${profile._id}`}
                  className="flex items-center space-x-3"
                >
                  <img
                    className="w-10 h-10 border border-gray-300 rounded-full"
                    src={profile?.avt || avt}
                    alt="user avatar"
                  />
                  <div className="text-sm">
                    <div className="font-medium text-gray-800">
                      {profile.firstName} {profile.lastName}
                    </div>
                  </div>
                </a>
                <button
                  onClick={() => handleRemoveHistory(profile._id)}
                  className="p-1 rounded-full hover:bg-gray-300"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            ))
          ) : (
            <li className="text-gray-500">Chưa có lịch sử tìm kiếm</li>
          )}
        </ul>
      ) : (
        <ul className="overflow-y-auto max-h-96 px-2 overflow-x-hidden space-y-2">
          {searchListUser.length > 0 ? (
            searchListUser.map((profile) => (
              <a
                key={profile._id}
                href={`/profile/posts?id=${profile._id}`}
                className="flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm transition-all duration-150"
                onClick={() => handleSaveSearch(profile)}
              >
                <img
                  className="w-10 h-10 border border-gray-300 rounded-full"
                  src={profile?.avt || avt}
                  alt="user avatar"
                />
                <div className="text-sm ml-3">
                  <div className="font-medium text-gray-800">
                    {profile.firstName} {profile.lastName}
                  </div>
                  <div className="text-gray-600 text-xs truncate">
                    {profile.email}
                  </div>
                </div>
              </a>
            ))
          ) : (
            <li className="text-gray-500 p-5 text-center">Không tìm thấy kết quả</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchList;
