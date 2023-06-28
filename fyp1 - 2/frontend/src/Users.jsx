import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './CreateProfile.css';
import './Login.css';
import Cookies from 'js-cookie';
import '@fortawesome/fontawesome-free/css/all.css';
import ImageUploader from 'react-images-upload';
import { useNavigate } from 'react-router-dom';

function Users() {
  const [user, setUser] = useState([]);
  const [Mainuser, MainsetUser] = useState([]);
  const [photo, setPhoto] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const userId = Cookies.get('userID');
  const userfname = Cookies.get('userfname');
  const userlname = Cookies.get('userlname');

  const navigate = useNavigate();

  useEffect(() => {
    if (userId === undefined || userId === null) {
      navigate('/');
    }
  }, [userId, navigate]);
  useEffect(() => {
    const MainfetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/userInfo?userId=${userId}`);//nizar/////////
        const MainuserData = response.data.user[0];
       
        MainsetUser(MainuserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    MainfetchUserData();
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/alluserInfo?userId=${userId}`);
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



    //new
  const handleChat = (username) => {
    if (Mainuser.number_chats === 0) {
      console.log('Number of chats is 0');
      return; // Exit the function
    }
  
    axios.post('http://localhost:8081/saveNbchat', { userId })
      .then(response => {
        console.log(response.data);
        // Handle the response if needed
        if (response.data.Status === 'Success') {
          const currentUser = encodeURIComponent(Mainuser.username);
          const otherUser = encodeURIComponent(username);
          const chatUrl = `http://localhost:3001/chat.html?currentUser=${currentUser}&otherUser=${otherUser}`;
          window.location.href = chatUrl;
        }
      })
      .catch(error => {
        // Handle errors if any
        console.error(error);
      });
  };
  


  const idtosend=userId  
  const handleBlock = (userid1,userId) => {
    axios.post('http://localhost:8081/Block', { userid1, idtosend })
    .then(response => {
      
    })
    .catch(error => {
      // Handle errors if any
    });
  };

  const handleFilter = (gender) => {
    setSelectedGender(gender);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = selectedGender
    ? user.filter((user) => user.gender === selectedGender && user.first_name.toLowerCase().includes(searchQuery.toLowerCase()))
    : user.filter((user) => user.first_name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <div className="p-3 centerElement">
        <h1>Boundless</h1>
        <h4>
          {userfname} {userlname}
        </h4>
        <h4>
         all users
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

      <h10>ps: here are all our users........</h10><p></p>
      <h12>Remaining direct chats:{Mainuser.number_chats} </h12>  {/* new */}

      <div className="container mt-5">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 mb-3">
              <div className="btn-group">
                <button
                  className={`btn ${selectedGender === 'male' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleFilter('male')}
                >
                  Male
                </button>
                <button
                  className={`btn ${selectedGender === 'female' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleFilter('female')}
                >
                  Female
                </button>
              </div>
            </div>
            <div className="col-sm-12 mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by first name"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
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
                        <div className="card-buttons">   {/* new */}
                        <button className="btn" onClick={() => handleChat(user.username)}>
                        <span
                         id="boot-icon"
                         className="bi bi-chat-square-text"
                          style={{ fontSize: '1rem', color: 'rgb(84, 84, 84)' }}
                             >
                            Direct Chat
                         </span>
                        </button>
                        <a href="/Users">
                        <button className="btn"  onClick={() => handleBlock(user.user_id)}>
                        <span
                          id="boot-icon"
                          className="bi bi-person-x"
                          style={{ fontSize: '1rem', color: '#b8141c' }}
                        >
                          block
                        </span>
                      </button></a>
                       
                          
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

export default Users;
