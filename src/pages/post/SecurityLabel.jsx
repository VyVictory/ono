import {
  GlobeAltIcon,
  LockClosedIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const SecurityLabel = ({ security }) => {
  let icon, text, color;

  switch (security) {
    case "Public":
      icon = <GlobeAltIcon className="h-6 w-6 text-blue-500 px-1" />;
      text = "Public";
      color = "   text-blue-500";
      break;
    case "MyFriend":
      icon = <UserGroupIcon className="h-6 w-6 text-green-500 px-1" />;
      text = "Friend";
      color = "  text-green-500";
      break;
    case "Private":
      icon = <LockClosedIcon className="h-6 w-6 text-red-500 px-1" />;
      text = "Private";
      color = " text-red-500";
      break;
    default:
      return null;
  }

  return (
    <div className="flex flex-row items-center">
      {icon}
      <div className={`border-l-2 px-1 ${color}`}>{text}</div>
    </div>
  );
};
export default SecurityLabel;
