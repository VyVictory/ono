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
  const menuCss = () => "text-gray-700 hover:bg-gray-300 rounded-xl block py-3 px-4 flex items-center gap-3";  

  return (  
    <ul className="space-y-2">  
      <li>  
        <Link to="/" className={menuCss()}>  
          <HomeIcon fontSize="large" /> Trang chủ  
        </Link>  
      </li>  
      <li>  
        <Link to="/messages" className={menuCss()}>  
          <MailIcon fontSize="large" /> Tin nhắn  
        </Link>  
      </li>  
      <li>  
        <Link to="/profile" className={menuCss()}>  
          <PersonIcon fontSize="large" /> Hồ sơ  
        </Link>  
      </li>  
      <li>  
        <Link to="/settings" className={menuCss()}>  
          <SettingsIcon fontSize="large" /> Cài đặt  
        </Link>  
      </li>  
      <li>  
        <Link to="/notifications" className={menuCss()}>  
          <NotificationsIcon fontSize="large" /> Thông báo  
        </Link>  
      </li>  
      <li>  
        <Link to="/help" className={menuCss()}>  
          <HelpIcon fontSize="large" /> Trợ giúp  
        </Link>  
      </li>  
      <li>  
        <a  
          href="/logout"  
          className="py-3 px-4 text-red-600 hover:bg-red-200 rounded-xl flex items-center gap-3"  
        >  
          <LogoutIcon fontSize="large" /> Đăng xuất  
        </a>  
      </li>  
    </ul>  
  );  
};  

export default ContentSiderBar;
