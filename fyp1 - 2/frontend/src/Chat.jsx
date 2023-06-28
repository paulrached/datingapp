import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './CreateProfile.css';
import './Login.css';
import Cookies from "js-cookie";//nizar

import '@fortawesome/fontawesome-free/css/all.css';
import ImageUploader from 'react-images-upload';
import { useNavigate } from "react-router-dom";


function Chat() {
  const [user, setUser] = useState([]);
  const [photo, setPhoto] = useState([]);
  const userId = Cookies.get("userID");
  const userfname = Cookies.get("userfname");
  const userlname = Cookies.get("userlname");
  const username1 = Cookies.get("username");

  const navigate = useNavigate();

  useEffect(() => {
    if (userId === undefined || userId === null) {
      navigate("/");
    }
  }, [userId, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/usermatchInfo?userId=${userId}`);
        const userData = response.data.user;
        const photoData = response.data.photo;
        setUser(userData);
        setPhoto(photoData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const imagePath = photo && photo.details ? photo.details.replace(/^public\\images\\/, '') : '';

const idtosend=userId
const handleUnMatch = (userid1,userId) => {
  axios.post('http://localhost:8081/unMatch', { userid1, idtosend })
    .then(response => {
      window.location.reload();
    })
    .catch(error => {
      // Handle errors if any
    });
};


 

  return (
    <div>
      <div className="p-3 centerElement">
        <h1>Boundless</h1>
        <h4>
          {userfname} {userlname}
        </h4>
        <h4>
         chat page
        </h4>
      </div>

      <nav className="navbar navbar-expand-sm" style={{ backgroundColor: '#b8141c' }}>
        <div className="container-fluid">
          <h6></h6>
          <h6>
            <a href="/users">
              <span
                id="boot-icon"
                className="bi bi-person-circle"
                style={{ fontSize: '2rem', color: 'rgb(255, 255, 255)' }}
              ></span>
            </a>
            <p>users</p>
          </h6>

          <h6>
            <a href="/encounters">
              <span
                id="boot-icon"
                className="bi bi-people"
                style={{ fontSize: '2rem', color: 'rgb(255, 255, 255)' }}
              ></span>
            </a>
            <p>encounters</p>
          </h6>

          <h6>
          <a href="/Chat">
              <span
                id="boot-icon"
                className="bi bi-chat-dots"
                style={{ fontSize: '2rem', color: 'rgb(255, 255, 255)' }}
              ></span>
            </a>
            <p>chats</p>
          </h6>

          <h6>
            <a href="/userProfile">
              <span
                id="boot-icon"
                className="bi bi-file-person"
                style={{ fontSize: '2rem', color: 'rgb(255, 255, 255)' }}
              ></span>
            </a>
            <p>profile</p>
          </h6>
          <h6></h6>
        </div>
      </nav>
      <h8>ps:here you can chat with your matches</h8>

      <div className="container mt-5">
        <div className="container">
          <div className="row">
            {user.length > 0 ? (
              
                user.map((user) => {
                  const imagePath = photo.find((p) => p.user_id === user.user_id)?.details.replace(/^public\\images\\/, '');
  
                  return (
                    <div className="col-sm-6 col-lg-4 mb-4" key={user.id}>
                      <div className="card">
                        <img
                          className="card-img-top"
                          src={`http://localhost:8081/images/${imagePath}`}
                          alt={user.username}
                        />
                        <div className="card-body">
                          <h5 className="card-title">
                            <strong>
                              {user.first_name} {user.last_name}
                            </strong>
                          </h5>
                          <p className="card-text">{user.about}</p>
                          <div className="card-icons">
                            <p>
                              <span
                                id="boot-icon"
                                className="bi bi-geo-alt-fill"
                                style={{ fontSize: '1rem', color: 'rgb(56, 86, 204)' }}
                              />
                              {user.city}
                            </p>
                          </div>
                          <div className="card-buttons">
                          <a className="btn" href={`http://localhost:3001/chat.html?currentUser=${username1}&otherUser=${user.username}`}>
                      <span id="boot-icon" className="bi bi-chat-square-text" style={{ fontSize: '1rem', color: 'rgb(84, 84, 84)' }}>
                         Chat
                     </span>
                        </a>
                            
                        <button className="btn" onClick={() => handleUnMatch(user.user_id)}>
                        <span
                          id="boot-icon"
                          className="bi bi-person-x"
                          style={{ fontSize: '1rem', color: '#b8141c' }}
                        >
                          UnMatch
                        </span>
                      </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>0 results</p>
              )}
            
          </div>
        </div>
      </div>

      <div className="footer">
  <div className="footer-content">
    <p class="footer-text">Contact Us:</p>
    <p class="footer-text">@Nizar: nizar_atallah@hotmail.com</p>
    <p class="footer-text">@Paul: paul-rached@hotmail.com</p>
    <div class="social-media">
      <a href="#" class="social-link">
        <i class="fab fa-facebook"></i>
      </a>
      <a href="#" class="social-link">
        <i class="fab fa-twitter"></i>
      </a>
      <a href="#" class="social-link">
        <i class="fab fa-instagram"></i>
      </a>
      <a href="#" class="social-link">
        <i class="fab fa-linkedin"></i>
      </a>
    </div>
  </div>
  <p class="footer-text">© 2023 Boundless. All rights reserved.</p>
</div>

    </div>
  );
}

export default Chat;
