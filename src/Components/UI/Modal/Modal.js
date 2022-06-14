import React from "react";
import ReactDOM from "react-dom";
import { FaTimesCircle } from "react-icons/fa";
import "./Modal.css";

const Backdrop = ({ onClose }) => {
  return <div className="modal-backdrop" onClick={onClose}></div>;
};

const Overlay = ({ onClose, children }) => {
  return (
    <div className="modal-overlay">
      {children && <FaTimesCircle className="modal-close" onClick={onClose} />}
      {children}
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <React.Fragment>
      {isOpen &&
        ReactDOM.createPortal(
          <Backdrop onClose={onClose} />,
          document.getElementById("root-backdrop")
        )}
      {isOpen &&
        ReactDOM.createPortal(
          <Overlay onClose={onClose} children={children} />,
          document.getElementById("root-overlay")
        )}
    </React.Fragment>
  );
};

export default Modal;
