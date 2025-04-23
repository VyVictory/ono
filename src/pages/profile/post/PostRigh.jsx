import avt from "../../../img/DefaultAvatar.jpg";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import pngTest from "../../../img/post/post.png";
import HeadCreatePost from "./HeadCreatePost"; 
import Post from "../../post/Post";
const PostRight = ({ data }) => { 
  return (
    <>
      {data?.myprofile && <HeadCreatePost />}
      <Post data={data} />
    </>
  );
};

export default PostRight;
