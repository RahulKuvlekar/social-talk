import React, { useEffect } from "react";
import MyProfile from "../../Components/MyProfile/MyProfile";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfile,
  getProfileData,
} from "../../Components/MyProfile/MyProfileSlice";
import Loader from "../../Components/UI/Loader/Loader";
import { ADD_TOAST } from "../../Components/UI/Toast/ToastSlice";
import { DANGER } from "../../Constant/constant";
import ProfilePostListing from "../../Components/ProfilePostListing/ProfilePostListing";
import { getPostData } from "../../Components/PostSlice/PostSlice";

const Profile = () => {
  const { userProfile, profileLoader } = useSelector(getProfileData);
  const { allPosts } = useSelector(getPostData);
  const { profileId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (profileId) {
      dispatch(getProfile({ profileId }))
        .unwrap()
        .then()
        .catch((error) => {
          dispatch(
            ADD_TOAST(DANGER, error.message + " Please try Login again.")
          );
        });
    }
    // eslint-disable-next-line
  }, [profileId]);

  return (
    <div className="main-section">
      {(() => {
        if (profileLoader) return <Loader />;
        return (
          <>
            {userProfile && <MyProfile />}
            {allPosts && <ProfilePostListing />}
          </>
        );
      })()}
    </div>
  );
};

export default Profile;
