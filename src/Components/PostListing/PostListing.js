import { useEffect } from "react";
import "./PostListing.css";
import { useDispatch, useSelector } from "react-redux";
import { getAuthData } from "../../Pages/Authentication/AuthenticationSlice";
import { getAllPost, getPostData } from "../PostSlice/PostSlice";
import { ADD_TOAST } from "../UI/Toast/ToastSlice";
import { DANGER } from "../../Constant/constant";
import Post from "../Post/Post";
import Loader from "../UI/Loader/Loader";

const PostListing = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(getAuthData);
  const { allPosts, postLoading } = useSelector(getPostData);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllPost())
        .unwrap()
        .then()
        .catch((error) => {
          dispatch(ADD_TOAST(DANGER, error.message));
        });
    }
  }, [isAuthenticated, dispatch]);
  return (
    <div>
      {postLoading && <Loader />}
      {allPosts?.length > 0 &&
        allPosts.map((data) => (
          <Post key={`singlepost-${data.id}`} data={data} />
        ))}
    </div>
  );
};

export default PostListing;
