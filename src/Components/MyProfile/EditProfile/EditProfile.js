import React, { useState, useMemo } from "react";
import "./EditProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { DANGER, DEFAULT_AVATAR } from "../../../Constant/constant";
import {
  getProfile,
  getProfileData,
  updateProfileInfo,
  updateProfilePhoto,
} from "../MyProfileSlice";
import { FaPlusSquare } from "react-icons/fa";
import { getAuthData } from "../../../Pages/Authentication/AuthenticationSlice";
import { ADD_TOAST } from "../../UI/Toast/ToastSlice";
import Loader from "../../UI/Loader/Loader";

const EditProfile = ({ onClose }) => {
  const { user } = useSelector(getAuthData);
  const { userProfile } = useSelector(getProfileData);
  const { displayName, photoURL, website, bio } = userProfile;
  const initialValue = {
    avatar: photoURL,
    website: website,
    bio: bio,
  };
  const [formValues, setFormValues] = useState(initialValue);
  const [imgLoading, setImgLoading] = useState(true);
  const dispatch = useDispatch();

  const areValuesChanges = useMemo(
    () =>
      JSON.stringify(initialValue) === JSON.stringify(formValues)
        ? true
        : false,
    // eslint-disable-next-line
    [formValues]
  );

  const submitHandler = async () => {
    if (formValues?.avatar !== initialValue?.avatar) {
      await dispatch(
        updateProfilePhoto({
          user: user,
          avatar: formValues.avatar,
        })
      )
        .unwrap()
        .then()
        .catch((error) => {
          console.log("ERROR MESG ", error.message);
          dispatch(ADD_TOAST(DANGER, error.message));
        });
    }
    await dispatch(
      updateProfileInfo({
        uid: user?.uid,
        bio: formValues.bio,
        website: formValues.website,
      })
    )
      .unwrap()
      .then()
      .catch((error) => dispatch(ADD_TOAST(DANGER, error.message)));

    await dispatch(getProfile({ profileId: user?.uid }))
      .unwrap()
      .then()
      .catch((error) => dispatch(ADD_TOAST(DANGER, error.message)));

    onClose();
  };

  const imageChangeHandler = (event) =>
    setFormValues((prev) => ({ ...prev, avatar: event.target.files[0] }));

  const formValuesHandler = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
      <h1 className="modal-header">Edit Profile</h1>
      <div className="modal-body edit-profile-body">
        <div className="edit-profile-tag">
          <span>Avatar</span>
          <div className="edit-profile-image">
            {imgLoading && (
              <div className="loader-wrapper">
                <Loader />
              </div>
            )}

            <img
              src={
                photoURL || formValues?.avatar
                  ? photoURL === formValues?.avatar
                    ? photoURL
                    : URL.createObjectURL(formValues?.avatar)
                  : DEFAULT_AVATAR
              }
              onLoad={() => setImgLoading(false)}
              alt={displayName}
            />

            <label htmlFor="uploadFile-profilepic">
              <FaPlusSquare />
            </label>

            <input
              type="file"
              name="uploadFile"
              id="uploadFile-profilepic"
              onChange={imageChangeHandler}
            />
          </div>
        </div>
        <div className="edit-profile-tag">
          <span>Username</span>
          <h2>{displayName?.split(" ")[0]}</h2>
        </div>
        <div className="edit-profile-tag">
          <span>Name</span>
          <h2>{displayName}</h2>
        </div>
        <div className="edit-profile-tag">
          <span>Website</span>
          <textarea
            spellCheck="false"
            rows="1"
            name="website"
            value={formValues?.website}
            onChange={formValuesHandler}
          />
        </div>
        <div className="edit-profile-tag">
          <span>Bio</span>
          <textarea
            spellCheck="false"
            rows="3"
            name="bio"
            value={formValues?.bio}
            onChange={formValuesHandler}
          />
        </div>
      </div>
      <div className="modal-btns">
        <button
          className="btn btn-primary edit-profile-submit"
          disabled={areValuesChanges}
          onClick={submitHandler}
        >
          Submit
        </button>
        <button className="btn btn-primary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
