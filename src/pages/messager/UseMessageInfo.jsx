import { useLocation, useSearchParams } from "react-router-dom";
import { getFriendsMess } from "../../service/friend";
import { useEffect, useState } from "react";

const useMessageInfo = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [type, setType] = useState("");
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      let resolvedType = "";
      let resolvedId = null;

      if (location.pathname.includes("/messages/inbox")) {
        resolvedType = "inbox";
        resolvedId = searchParams.get("idUser");

        if (!resolvedId) {
          try {
            const response = await getFriendsMess(0, 1, "");
            resolvedId = response?.data?.friends?.[0]?._id || null;
          } catch (error) {
            console.error("Lỗi khi lấy friend:", error);
          }
        }
      } else if (location.pathname.includes("/messages/group")) {
        resolvedType = "group";
        resolvedId = searchParams.get("idGroup");
      }

      setType(resolvedType);
      setId(resolvedId);
    };

    fetchInfo();
  }, [location.pathname, searchParams]);

  return { type, id };
};

export default useMessageInfo;
