import React from "react";
import ProfileTag from "../ProfileTag/ProfileTag";
import { useSelector } from "react-redux";
import { getAuthData } from "../../Pages/Authentication/AuthenticationSlice";
import "./ProfileListing.css";
import { getAllProfilesData } from "../UserSlice/UserSlice";

const ProfileListing = () => {
  const {
    user: { uid, displayName, photoURL },
  } = useSelector(getAuthData);

  const { userProfiles } = useSelector(getAllProfilesData);

  const suggestedProfiles = userProfiles.filter(
    (profile) => Math.random() < 0.5 && profile.uid !== uid
  );

  return (
    <div className="profileListing-section">
      <div className="profileListing-userprofile">
        <ProfileTag uid={uid} displayName={displayName} photoURL={photoURL} />
      </div>
      <span className="text-grey-md">Suggestions for you</span>
      <div className="profileListing-suggestions">
        {suggestedProfiles.length > 0 &&
          suggestedProfiles.map((profile) => (
            <ProfileTag
              key={`suggested-profiletag-${profile.uid}`}
              uid={profile?.uid}
              displayName={profile?.displayName}
              photoURL={profile?.photoURL}
            />
          ))}
      </div>
    </div>
  );
};

export default ProfileListing;
