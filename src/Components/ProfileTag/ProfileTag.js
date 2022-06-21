import React from "react";
import "./ProfileTag.css";
import { Link } from "react-router-dom";
import { getProfileURL } from "../../Utils/post";
import { DEFAULT_AVATAR } from "../../Constant/constant";

const ProfileTag = ({
  displayName,
  photoURL,
  uid,
  search = false,
  onClick,
}) => {
  return (
    <div className="profile-tag">
      {search ? (
        <Link to={getProfileURL(uid)} onClick={onClick}>
          <img
            src={photoURL ? photoURL : DEFAULT_AVATAR}
            alt=""
            className="profile-tag-img"
          />
        </Link>
      ) : (
        <Link to={getProfileURL(uid)}>
          <img
            src={photoURL ? photoURL : DEFAULT_AVATAR}
            alt=""
            className="profile-tag-img"
          />
        </Link>
      )}

      <div className="profile-tag-username">
        {search ? (
          <Link to={getProfileURL(uid)} onClick={onClick}>
            <h2 className="profile-tag-displayName">
              {displayName?.split(" ")[0]}
            </h2>
          </Link>
        ) : (
          <Link to={getProfileURL(uid)}>
            <h2 className="profile-tag-displayName">
              {displayName?.split(" ")[0]}
            </h2>
          </Link>
        )}
        {search ? (
          <Link to={getProfileURL(uid)} onClick={onClick}>
            <h2 className="profile-tag-name">{displayName}</h2>
          </Link>
        ) : (
          <Link to={getProfileURL(uid)}>
            <h2 className="profile-tag-name">{displayName}</h2>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfileTag;
