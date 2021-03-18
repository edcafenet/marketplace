import React, { Component } from 'react';

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <button className="btn btn-primary" style={{float : 'right', paddingRight : '10px', margin: '10px 10px 10px 0', display:'inline-block'}} onClick={handleClose}>Close</button>
        {children}
      </section>
    </div>
  );
};

Modal.defaultStyles = {}

export default Modal;
