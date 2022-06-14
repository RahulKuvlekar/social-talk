import { useState, useEffect, useMemo } from "react";
import { DANGER, DEFAULT_AVATAR } from "../../Constant/constant";
import { useSelector, useDispatch } from "react-redux";
import { getAuthData } from "../../Pages/Authentication/AuthenticationSlice";
import { editPost } from "../PostSlice/PostSlice";
import { ADD_TOAST } from "../UI/Toast/ToastSlice";

const EditPost = ({ onClose, initialValue, postId }) => {
  const [formValue, setFormValue] = useState(initialValue);
  const [formError, setFormError] = useState({});
  const [formIsSubmit, setformIsSubmit] = useState(false);
  const { user } = useSelector(getAuthData);
  const dispatch = useDispatch();

  const prevValuesAreChanged = useMemo(
    () =>
      formValue?.postCaption !== initialValue?.postCaption ||
      formValue?.postDescription !== initialValue?.postDescription
        ? true
        : false,
    // eslint-disable-next-line
    [formValue]
  );

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

  const editPostHandler = async (postCaption, postDescription) => {
    const data = {
      postCaption,
      postDescription,
      postId,
    };
    dispatch(editPost(data))
      .unwrap()
      .then()
      .catch((error) => dispatch(ADD_TOAST(DANGER, error.message)));
  };

  useEffect(() => {
    if (formIsSubmit && Object.keys(formError).length === 0) {
      editPostHandler(formValue.postCaption, formValue.postDescription);
      resetHandler();
      onClose();
    }

    // eslint-disable-next-line
  }, [formIsSubmit]);

  return (
    <div className="post-modal">
      <h1 className="modal-header">Edit Post</h1>
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
            <button
              className={`btn btn-primary ${
                prevValuesAreChanged ? "" : "btn-disabled"
              }`}
              onClick={submitHandler}
              disabled={!prevValuesAreChanged}
            >
              Edit
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

export default EditPost;
