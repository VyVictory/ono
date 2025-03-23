import avt from "../../../img/DefaultAvatar.jpg";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import pngTest from "../../../img/post/post.png";
import HeadCreatePost from "./HeadCreatePost";
import { usePhotoSwipe } from "../../../components/context/PhotoSwipeProvider";
import Post from "../../../components/post/Post";
const PostRight = ({ data }) => {
  const { openGallery } = usePhotoSwipe();
  return (
    <>
      {data?.myprofile && <HeadCreatePost />}
      <Post data={data} />
    </>
  );
};

export default PostRight;
