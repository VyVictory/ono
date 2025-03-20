const ContentSiderBar = () => {
  return (
    <>
      {" "}
      <ul>
        <li>
          <a href="/" className="block py-2 px-4">
            Trang chủ
          </a>
        </li>
        <li>
          <a href="/messages" className="block py-2 px-4">
            Tin nhắn
          </a>
        </li>
        <li>
          <a href="/profile" className="block py-2 px-4">
            Hồ sơ
          </a>
        </li>
      </ul>
    </>
  );
};

export default ContentSiderBar;
