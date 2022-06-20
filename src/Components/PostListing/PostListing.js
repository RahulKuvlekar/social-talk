import React from "react";
import "./PostListing.css";
import { useSelector } from "react-redux";
import Post from "../Post/Post";
import Loader from "../UI/Loader/Loader";
import { getPostData } from "../PostSlice/PostSlice";

const PostListing = () => {
  const { allPosts, postLoading } = useSelector(getPostData);

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
