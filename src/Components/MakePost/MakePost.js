import { useState, useEffect } from "react";
import { DANGER, DEFAULT_AVATAR } from "../../Constant/constant";
import { useSelector, useDispatch } from "react-redux";
import { getAuthData } from "../../Pages/Authentication/AuthenticationSlice";
import "./MakePost.css";
import { serverTimestamp } from "firebase/firestore";
import { makePost } from "../PostSlice/PostSlice";
import { ADD_TOAST } from "../UI/Toast/ToastSlice";

const MakePost = ({ onClose }) => {
  const initialValue = {
    postCaption: "",
    postDescription: "",
  };
  const [formValue, setFormValue] = useState(initialValue);
  const [formError, setFormError] = useState({});
  const [formIsSubmit, setformIsSubmit] = useState(false);
  const { user } = useSelector(getAuthData);
  const dispatch = useDispatch();
  const validate = ({ postCaption, postDescription }) => {
    const error = {};
    if (!postCaption) error.postCaption = "Post Caption is required*";

    if (!postDescription)
      error.postDescription = "Post Description is required*";

    return error;
  };

  const focusHandler = () => {
    setFormError({});
    setformIsSubmit(false);
  };
  const resetHandler = () => {
    setFormValue(initialValue);
    setFormError({});
    setformIsSubmit(false);
  };

  const inputHandler = (event) => {
    const { value, name } = event.target;
    setFormValue((prev) =>
      name === "postDescription" && value.length > 250
        ? {
            ...prev,
          }
        : { ...prev, [name]: value }
    );
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setFormError(validate(formValue));
    setformIsSubmit(true);
  };

  const addPostHandler = async (postCaption, postDescription) => {
    const data = {
      postCaption,
      postDescription,
      userInfo: {
        date: serverTimestamp(),
        displayName: user?.displayName,
        email: user?.email,
        photoURL: user?.photoURL ? user?.photoURL : null,
        uid: user?.uid,
      },
      likes: {},
      comments: [],
      bookmarks: {},
    };
    dispatch(makePost(data))
      .unwrap()
      .then()
      .catch((error) => dispatch(ADD_TOAST(DANGER, error.message)));
  };

  useEffect(() => {
    if (formIsSubmit && Object.keys(formError).length === 0) {
      addPostHandler(formValue.postCaption, formValue.postDescription);
      resetHandler();
      onClose();
    }

    // eslint-disable-next-line
  }, [formIsSubmit]);

  return (
    <div className="post-modal">
      <h1 className="modal-header">Post</h1>
      <div className="modal-body">
        <div className="post-img">
          <img
            src={user?.photoURL ? user?.photoURL : DEFAULT_AVATAR}
            alt={user?.displayName}
          />
        </div>
        <div className="post-description">
          <textarea
            rows="1"
            name="postCaption"
            value={formValue?.postCaption}
            placeholder="Add Caption Here ."
            className={`${formError?.postCaption ? "error" : ""}`}
            onFocus={focusHandler}
            onChange={inputHandler}
          />
          {formError?.postCaption && (
            <p className="error-message">{formError?.postCaption}</p>
          )}
          <textarea
            rows="5"
            name="postDescription"
            value={formValue?.postDescription}
            placeholder="What happening in Life ?"
            className={`${formError?.postDescription ? "error" : ""}`}
            onFocus={focusHandler}
            onChange={inputHandler}
          />
          {formError?.postDescription && (
            <p className="error-message">{formError?.postDescription}</p>
          )}
          <h4 className="text-align-right">
            {formValue?.postDescription?.length}/250
          </h4>
          <div className="post-btns">
            <button className="btn btn-primary" onClick={submitHandler}>
              Post
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePost;
