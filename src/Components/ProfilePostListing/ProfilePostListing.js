import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostData, GET_MYPOST, RESET_MYPOST } from "../PostSlice/PostSlice";
import Post from "../Post/Post";
import { useParams } from "react-router-dom";

const ProfilePostListing = () => {
  const { profileId } = useParams();
  const { allPosts, myPosts } = useSelector(getPostData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GET_MYPOST(profileId));

    return () => dispatch(RESET_MYPOST());
    // eslint-disable-next-line
  }, [profileId, allPosts]);
  return (
    <div>
      {myPosts.length > 0 &&
        myPosts.map((post, id) => (
          <Post key={`profilepost-${id}`} data={post} />
        ))}
    </div>
  );
};

export default ProfilePostListing;
