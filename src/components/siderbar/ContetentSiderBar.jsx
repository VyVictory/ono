import React from 'react';  
import HomeIcon from '@mui/icons-material/Home';  
import MailIcon from '@mui/icons-material/Mail';  
import PersonIcon from '@mui/icons-material/Person';  
import SettingsIcon from '@mui/icons-material/Settings';  
import NotificationsIcon from '@mui/icons-material/Notifications';  
import HelpIcon from '@mui/icons-material/Help';  
import LogoutIcon from '@mui/icons-material/Logout';  
import { Link } from 'react-router-dom';

const ContentSiderBar = () => {  
  const menuCss = () => {  
    return "text-gray-700 hover:bg-gray-200 rounded-xl block py-2 px-3 flex items-center";  
  };  

  return (  
    <>  
      <ul className="">  
        <li>  
          <Link to="/" className={menuCss()}>  
            <HomeIcon className="mr-2" /> Trang chủ  
          </Link>  
        </li>  
        <li>  
          <Link to="/messages" className={menuCss()}>  
            <MailIcon className="mr-2" /> Tin nhắn  
          </Link>  
        </li>  
        <li>  
          <Link to="/profile" className={menuCss()}>  
            <PersonIcon className="mr-2" /> Hồ sơ  
          </Link>  
        </li>  
        <li>  
          <Link to="/settings" className={menuCss()}>  
            <SettingsIcon className="mr-2" /> Cài đặt  
          </Link>  
        </li>  
        <li>  
          <Link to="/notifications" className={menuCss()}>  
            <NotificationsIcon className="mr-2" /> Thông báo  
          </Link>  
        </li>  
        <li>  
          <Link to="/help" className={menuCss()}>  
            <HelpIcon className="mr-2" /> Trợ giúp  
          </Link>  
        </li>  
        <li>  
          <a  
            href="/logout"  
            className="block py-2 px-4 text-red-600 hover:bg-red-100 rounded flex items-center"  
          >  
            <LogoutIcon className="mr-2" /> Đăng xuất  
          </a>  
        </li>  
      </ul>  
    </>  
  );  
};  

export default ContentSiderBar;