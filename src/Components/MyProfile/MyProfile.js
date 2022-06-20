import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./MyProfile.css";
import { useDispatch, useSelector } from "react-redux";
import {
  followProfile,
  getProfileData,
  unfollowProfile,
} from "./MyProfileSlice";
import { DEFAULT_AVATAR } from "../../Constant/constant";
import {
  getAuthData,
  signOutSocialTalks,
} from "../../Pages/Authentication/AuthenticationSlice";
import { getPostData } from "../PostSlice/PostSlice";
import { ADD_TOAST } from "../UI/Toast/ToastSlice";
import { FaSignOutAlt } from "react-icons/fa";
import SmallLoader from "../UI/SmallLoader/SmallLoader";
import Modal from "../UI/Modal/Modal";
import EditProfile from "./EditProfile/EditProfile";
import Loader from "../UI/Loader/Loader";

const MyProfile = () => {
  const { profileId } = useParams();
  const dispatch = useDispatch();
  const { userProfile, smallLoader } = useSelector(getProfileData);
  const { user } = useSelector(getAuthData);
  const { uid } = user;
  const { myPosts } = useSelector(getPostData);
  const [editModal, setEditModal] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  const openEditModal = () => setEditModal(true);
  const closeEditModal = () => setEditModal(false);

  const followUserHandler = () => {
    dispatch(followProfile({ profileId, uid }))
      .unwrap()
      .then()
      .catch((error) => dispatch(ADD_TOAST, error.message));
  };
  const unfollowUserHandler = () => {
    dispatch(unfollowProfile({ profileId, uid }))
      .unwrap()
      .then()
      .catch((error) => dispatch(ADD_TOAST, error.message));
  };

  return (
    <div className="UserProfile-section">
      <div className="UserProfile-profilePic">
        {imgLoading && (
          <div className="loader-wrapper">
            <Loader />
          </div>
        )}
        <img
          src={userProfile?.photoURL ? userProfile?.photoURL : DEFAULT_AVATAR}
          alt={userProfile?.displayName}
          onLoad={() => setImgLoading(false)}
          className={imgLoading ? "display-none" : "display-block"}
        />
      </div>
      <div className="UserProfile-description">
        <div className="UserProfile-header">
          <h1 className="UserProfile-username">
            {userProfile?.displayName?.split(" ")[0]}
          </h1>
          {user.uid === profileId ? (
            <button onClick={openEditModal} className="UserProfile-btn">
              Edit Profile
            </button>
          ) : userProfile.followers[uid] ? (
            <button onClick={unfollowUserHandler} className="UserProfile-btn">
              {smallLoader ? <SmallLoader /> : "Following"}
            </button>
          ) : (
            <button onClick={followUserHandler} className="UserProfile-btn">
              {smallLoader ? <SmallLoader /> : "Follow"}
            </button>
          )}
          {user.uid === profileId && (
            <FaSignOutAlt
              className="UserProfile-btn-signout"
              onClick={() => {
                dispatch(signOutSocialTalks());
              }}
            />
          )}
        </div>
        <div className="UserProfile-row UserProfile-counts">
          <h3 className="UserProfile-counts">
            <span>{myPosts?.length} </span>
            posts
          </h3>
          <h3 className="UserProfile-counts">
            <span>{Object.keys(userProfile?.followers)?.length} </span>
            followers
          </h3>
          <h3 className="UserProfile-counts">
            <span>{Object.keys(userProfile?.following)?.length} </span>
            following
          </h3>
        </div>
        <div className="UserProfile-body">
          <h3 className="UserProfile-displayName">
            {userProfile?.displayName}
          </h3>
          <h3 className="UserProfile-bio">{userProfile?.bio}</h3>
          <a
            href={userProfile?.website}
            rel="noopener noreferrer"
            target="_blank"
            className="UserProfile-website"
          >
            {userProfile?.website}
          </a>
        </div>
      </div>
      <Modal isOpen={editModal} onClose={closeEditModal}>
        <EditProfile onClose={closeEditModal} />
      </Modal>
    </div>
  );
};

export default MyProfile;
