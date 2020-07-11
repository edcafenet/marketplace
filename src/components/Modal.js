import React, { Component } from 'react';

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button className="btn btn-primary" style={{float : 'right', paddingRight : '5px'}} onClick={handleClose}>Close</button>
      </section>
    </div>
  );
};

export default Modal;
