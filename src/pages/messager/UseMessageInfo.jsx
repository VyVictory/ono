import { useLocation, useSearchParams } from "react-router-dom";

const UseMessageInfo = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  let type = "";
  let id = "";

  if (location.pathname.includes("/messages/inbox")) {
    type = "inbox";
    id = searchParams.get("idUser");
  } else if (location.pathname.includes("/messages/group")) {
    type = "group";
    id = searchParams.get("idGroup");
  }

  return { type, id };
};
export default UseMessageInfo;
