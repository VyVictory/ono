import React from "react";
import { useNavigate } from "react-router-dom";

const urlList = {
  admin: "/admin",
  home: "/",
  messages: "/messages",
  videos: "/videos",
  store: "/store",
  groups: "/groups",
  notification: "/notification",
  login: "/login",
};

const LinkNotLoad = ({ namepage, children, css }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (urlList[namepage]) {
      navigate(urlList[namepage]);
    } else {
      console.log("Invalid page name:", namepage);
    }
  };

  return (
    <div onClick={handleClick} className={css}>
      {children}
    </div>
  );
};

export default LinkNotLoad;
