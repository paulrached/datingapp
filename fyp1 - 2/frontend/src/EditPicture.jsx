import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

function EditPicture() {
  const navigate = useNavigate();
  const [picture, setPicture] = useState(null);
  const userId = Cookies.get("userID");
  

  const handlePictureChange = (e) => {
    const picture = e.target.files[0];
    setPicture(picture);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('picture', picture);
    formData.append('userId', userId);

    axios
      .post('http://localhost:8081/EditPicture', formData)
      .then((response) => {
        console.log(response.data);
        
          navigate('/UserProfile');
        
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error and set error message
      });
  };

  return (
    <div className='UploadfileWithBackground'>
      <div className="text-center">
        <h1>
          <strong>Boundless</strong>
        </h1>
        
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="panel panel-primary">
            <div className="panel-body">
              <h3 className="text-on-pannel text-primary">
                <strong className="text-uppercase">
                  Profile Picture{' '}
                  <span style={{ color: '#ff0000' }}>*</span>
                </strong>
              </h3>
              <input
                className="form-control"
                type="file"
                name="picture"
                accept="image/*"
                onChange={handlePictureChange}
                required
              />
            </div>
          </div>
          <div className="btn-center panel panel-primary">
            <div className="panel-body">
              {/* Button */}
              <button type="submit" className="btn-primary btn-block">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* footer */}
      <div className="footer">
        <p>
          Fields marked with <span style={{ color: '#ff0000' }}>*</span> are required.
        </p>
      </div>
      
    </div>
  );
}

export default EditPicture;
