import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToBookmark,
  removeFromBookmark,
  likePost,
  unLikePost,
  addComment,
  deletePost,
} from "../PostSlice/PostSlice";
import { getAuthData } from "../../Pages/Authentication/AuthenticationSlice";
import Modal from "../UI/Modal/Modal";
import EditPost from "../EditPost/EditPost";
import { DEFAULT_AVATAR, WARNING } from "../../Constant/constant";
import {
  FaEdit,
  FaTrash,
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaHeart,
  FaBookmark,
} from "react-icons/fa";
import moment from "moment";
import "./Post.css";
import { ADD_TOAST } from "../UI/Toast/ToastSlice";
import { Link } from "react-router-dom";
import { getProfileURL } from "../../Utils/post";

const Post = ({ data }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector(getAuthData);
  const {
    postCaption,
    postDescription,
    likes,
    comments,
    bookmarks,
    id,
    userInfo,
  } = data;

  const likesCount = useMemo(() => Object.keys(likes).length, [likes]);

  const likePosthandler = async () => {
    dispatch(likePost({ postId: id, uid: user.uid }))
      .unwrap()
      .then()
      .catch((error) => {
        dispatch(ADD_TOAST(WARNING, error.message));
      });
  };
  const unlikePosthandler = async () => {
    dispatch(unLikePost({ postId: id, uid: user.uid }))
      .unwrap()
      .then()
      .catch((error) => {
        dispatch(ADD_TOAST(WARNING, error.message));
      });
  };
  const addBookmarkhandler = async () => {
    dispatch(addToBookmark({ postId: id, uid: user.uid }))
      .unwrap()
      .then()
      .catch((error) => {
        dispatch(ADD_TOAST(WARNING, error.message));
      });
  };
  const removeBookmarkhandler = async () => {
    dispatch(removeFromBookmark({ postId: id, uid: user.uid }))
      .unwrap()
      .then()
      .catch((error) => {
        dispatch(ADD_TOAST(WARNING, error.message));
      });
  };

  const addCommenthandler = async () => {
    const comment = {
      commentText: commentInput,
      timestamp: moment().valueOf(),
      userInfo: {
        displayName: user?.displayName,
        email: user?.email,
        photoURL: user?.photoURL ? user?.photoURL : null,
        uid: user?.uid,
      },
    };

    dispatch(addComment({ postId: id, comment: comment }))
      .unwrap()
      .then()
      .catch((error) => {
        dispatch(ADD_TOAST(WARNING, error.message));
      });

    setCommentInput("");
  };

  const deletePosthandler = async () => {
    const data = {
      postId: id,
    };
    dispatch(deletePost(data))
      .unwrap()
      .then(() => closeDeleteModal())
      .catch((error) => dispatch(ADD_TOAST, error.message));
  };

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);
  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);
  const commentHandler = (e) => setCommentInput(e.target.value);

  return (
    <div className="post-section">
      <div className="post-header">
        <Link to={getProfileURL(userInfo?.uid)}>
          <img
            src={
              data?.userInfo?.photoURL
                ? data?.userInfo?.photoURL
                : DEFAULT_AVATAR
            }
            alt={data?.userInfo?.displayName}
          />
        </Link>
        <div className="post-header-info">
          <div>
            <Link
              to={getProfileURL(userInfo?.uid)}
              className="text-grey-md userProfile-link"
            >
              {data?.userInfo?.displayName}
            </Link>
            <h5 className="text-grey-lt">{data?.userInfo?.email}</h5>
            <h6 className="text-grey-lt">
              {moment(data?.userInfo?.date?.seconds * 1000).format(
                "MMMM Do YYYY, h:mm a"
              )}
            </h6>
          </div>
          {user?.uid === userInfo?.uid && (
            <div className="post-header-btn">
              <FaEdit onClick={openEditModal} />
              <FaTrash onClick={openDeleteModal} />
            </div>
          )}
        </div>
      </div>
      <div className="post-body">
        <div className="post-description">{postDescription}</div>
      </div>
      <div className="post-footer">
        <div className="post-btn-reactions">
          <span>
            {likes[user?.uid] ? (
              <FaHeart
                className="post-reaction post-reaction-heart"
                onClick={unlikePosthandler}
              />
            ) : (
              <FaRegHeart className="post-reaction" onClick={likePosthandler} />
            )}
            <FaRegComment className="post-reaction" />
          </span>
          {bookmarks[user?.uid] ? (
            <FaBookmark
              className="post-reaction post-reaction-bookmark"
              onClick={removeBookmarkhandler}
            />
          ) : (
            <FaRegBookmark
              className="post-reaction"
              onClick={addBookmarkhandler}
            />
          )}
        </div>
        <span className="post-likes">
          {likesCount === 0 ? (
            "Be the first to like this post"
          ) : (
            <>
              Liked by <span>{likesCount}</span> people
            </>
          )}
        </span>
        <div className="post-caption">
          <Link
            to={getProfileURL(userInfo?.uid)}
            className="post-username userProfile-link"
          >
            {userInfo?.displayName}
          </Link>
          {postCaption}
        </div>
        <div className="post-comment-section">
          {comments.length > 0 &&
            comments.map((data, idx) => (
              <div key={`post-comment-${idx}`} className="post-comments">
                <span>
                  <span className="post-comment-username">
                    {data?.userInfo?.displayName}
                  </span>
                  <span className="post-comment-text">{data?.commentText}</span>
                </span>
                <span className="post-comment-date">
                  {moment(data?.timestamp)?.fromNow()}
                </span>
              </div>
            ))}
        </div>

        <div className="post-date">
          {moment(data?.userInfo?.date?.seconds * 1000)
            .fromNow()
            .toUpperCase()}
        </div>
      </div>
      <div className="post-inputcomment">
        <input
          type="text"
          placeholder="Add a Comment ..."
          value={commentInput}
          onChange={commentHandler}
        />
        <button
          disabled={commentInput.length === 0 ? true : false}
          onClick={addCommenthandler}
        >
          Post
        </button>
      </div>

      <Modal isOpen={editModalOpen} onClose={closeEditModal}>
        <EditPost
          initialValue={{ postCaption, postDescription }}
          onClose={closeEditModal}
          postId={id}
        />
      </Modal>
      <Modal isOpen={deleteModalOpen} onClose={closeDeleteModal}>
        <h1 className="modal-header">Confirm Delete</h1>
        <div className="modal-body">
          <h2>Are you sure ? You want to delete this post ?</h2>
        </div>
        <div className="modal-btns">
          <button className="btn btn-primary" onClick={deletePosthandler}>
            Confirm
          </button>
          <button className="btn btn-primary" onClick={closeDeleteModal}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Post;
