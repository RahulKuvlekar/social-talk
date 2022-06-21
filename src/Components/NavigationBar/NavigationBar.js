import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHome, FaPlusCircle } from "react-icons/fa";
import "./NavigationBar.css";
import { useSelector } from "react-redux";
import Modal from "../UI/Modal/Modal";
import MakePost from "../MakePost/MakePost";
import { DEFAULT_AVATAR } from "../../Constant/constant";
import { getAuthData } from "../../Pages/Authentication/AuthenticationSlice";
import SearchBar from "../Searchbar/SearchBar";

const NavigationBar = () => {
  const { user } = useSelector(getAuthData);
  const [isPostModalOpen, setPostModal] = useState(false);
  const openModal = () => setPostModal(true);
  const closeModal = () => setPostModal(false);

  return (
    <header className="nav-bar">
      <nav className="nav-bar-container">
        <div className="nav-section">
          <div className="burger-menu">
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>

          {/* <div className="nav-logo">
            <a className="link-no-style" href="/index.html">
              <img src="https://picsum.photos/100/100" alt="Logo" />
            </a>
          </div>  */}

          <div className="nav-logo-title">
            <NavLink className="link-no-style" to="/">
              Social Talks
            </NavLink>
          </div>
        </div>

        <div className="nav-section">
          <SearchBar />

          <ul className="nav-pill nav-btn-icons">
            <li className="list-inline-item">
              <button className="nav-icon-btn" onClick={openModal}>
                <span className="nav-icon">
                  <FaPlusCircle />
                </span>
                {/* <span className="nav-icon-text"> Post </span> */}
              </button>
            </li>
            <li className="list-inline-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-icon-btn nav-active" : "nav-icon-btn"
                }
              >
                <span className="nav-icon">
                  <FaHome />
                </span>
                {/* <span className="nav-icon-text"> Home </span> */}
              </NavLink>
            </li>
            <li className="list-inline-item">
              <Link to={`/profile/${user?.uid}`}>
                <img
                  src={user?.photoURL ? user?.photoURL : DEFAULT_AVATAR}
                  alt="user"
                  className="avatar avatar-sm"
                />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <Modal isOpen={isPostModalOpen} onClose={closeModal}>
        <MakePost onClose={closeModal} />
      </Modal>
    </header>
  );
};

export default NavigationBar;
