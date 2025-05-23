import { useEffect, useState } from "react";
import { getSearchUser } from "../service/user";
import { XMarkIcon } from "@heroicons/react/24/solid";
import avt from "../img/DefaultAvatar.jpg";
import { useNavigate } from "react-router-dom";
import UserStatusIndicator from "./UserStatusIndicator";

const SearchList = ({ value, close }) => {
  const [searchListUser, setSearchListUser] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  // Tải lịch sử tìm kiếm từ localStorage khi mở trang
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);
  }, []);
  const navigate = useNavigate();
  // Gọi API khi có giá trị tìm kiếm
  useEffect(() => {
    if (!value) return;

    const fetchUsers = async () => {
      const response = await getSearchUser(value);
      if (response) {
        setSearchListUser(response.data);
      } else {
        setSearchListUser([]);
      }
    };

    fetchUsers();
  }, [value]);

  // Lưu lịch sử tìm kiếm
  const handleNextProfile = (id) => {
    navigate(`/profile/posts?id=${id}`);
    close();
  };
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
  const handleClearHistory = () => {
    localStorage.removeItem("searchHistory");
    setSearchHistory([]);
  };
  const avatarRender = (data) => {
    return (
      <UserStatusIndicator userId={data?._id} userData={data} css="h-10 w-10" />
    );
  };
  return (
    <div className=" p-4 pt-2 bg-white  shadow-md rounded-lg overflow-y-auto max-h-96">
      {!value ? (
        <ul className="space-y-2">
          <li className="font-bold pb-2 text-lg text-gray-500 flex justify-between w-full">
            Lịch sử tìm kiếm
            {searchHistory.length > 0 && (
              <button className="hover:scale-125 ">
                <XMarkIcon
                  onClick={handleClearHistory}
                  className="w-6 h-6 text-red-600"
                />
              </button>
            )}
          </li>

          {searchHistory.length > 0 ? (
            searchHistory.map((profile) => (
              <div
                key={profile._id}
                className="flex justify-between items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 duration-150 rounded-lg shadow-sm"
              >
                <button
                  onClick={() => handleNextProfile(profile._id)}
                  className="flex items-center gap-2 w-full"
                >
                  {avatarRender(profile)}
                  <UserRender data={profile}/>
                </button>
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
        <ul className="  space-y-2">
          {searchListUser.length > 0 ? (
            searchListUser.map((profile) => (
              <button
                key={profile._id}
                onClick={() => {
                  handleSaveSearch(profile), handleNextProfile(profile._id);
                }}
                className="flex items-center w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm transition-all duration-150 gap-2"
              >
                {avatarRender(profile)}
                <UserRender data={profile} />
              </button>
            ))
          ) : (
            <li className="text-gray-500 p-5 text-center">
              Không tìm thấy kết quả
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
const UserRender = ({ data }) => {
  return (
    <div className="text-sm">
      <div className="font-medium text-gray-800 text-start">
        {data?.firstName} {data?.lastName}
      </div>
    </div>
  );
};
export default SearchList;
