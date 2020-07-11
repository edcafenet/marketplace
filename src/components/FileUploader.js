import React, { Component } from 'react';
const FileUploader = props => {

const hiddenFileInput = React.useRef(null);

  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    props.handleInputFile(fileUploaded);
  };
  return (
    <>
      <button className="btn btn-primary" onClick={handleClick}>
        Upload
      </button>
      <input type="file"
             ref={hiddenFileInput}
             onChange={handleChange}
             style={{display:'none'}}
      />
    </>
  );
};

export default FileUploader;
