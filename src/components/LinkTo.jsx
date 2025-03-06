import React from 'react';
import { useNavigate } from 'react-router-dom';

const LinkTo = ({ namepage, children,css }) => {
  // Mapping the namepage to its corresponding path
  const pathMapping = {
    admin: '/admin',
    home: '/',
    messages: '/messages',
    videos: '/videos',
    store: '/store',
    groups: '/groups',
    notification: '/notification',
    // Add more mappings as needed
  };

  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(pathMapping[namepage])}
      className={css}>
      {children}
    </button>
  );
};

export default LinkTo;
