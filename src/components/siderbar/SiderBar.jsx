import ContentSiderBar from "./ContetentSiderBar";

const SiderBar = () => {
  return (
    <>
      <aside className="w-64 bg-gray-100 p-4 hidden md:block">
        <nav>
          <ContentSiderBar />
        </nav>
      </aside>
    </>
  );
};

export default SiderBar;
