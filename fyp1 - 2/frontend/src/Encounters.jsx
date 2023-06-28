import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './CreateProfile.css';
import './Login.css';
import '@fortawesome/fontawesome-free/css/all.css';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ImageUploader from 'react-images-upload';

function Encounters() {

  const userId = Cookies.get("userID");
  //main user
  const [Mainuser, MainsetUser] = useState([]);
  ///displayed random users
  const [user, setUser] = useState([]);
  const [language, setLanguage] = useState([]);
  const [religion, setReligion] = useState([]);
  const [photo, setPhoto] = useState([])


///////// get info of main user such as nb of likes
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
  
/////////navigation
  const navigate = useNavigate();//nizar
  useEffect(() => {
    if (userId === undefined || userId === null) {
      navigate("/"); // Redirect to the login page if userId is not present
    }
  }, [userId, navigate]);
  const handleRefresh = () => {
    window.location.reload();
  };
  
/////////get info of random user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/RanduserInfo?userId=${userId}`);
        const userData = response.data.user[0];
        const languageData = response.data.language[0];
        const religionData=response.data.religion[0];
        const photoData=response.data.photo[0];
        setUser(userData);
        setLanguage(languageData);
        setReligion(religionData);
        setPhoto(photoData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  
  const imagePath = photo && photo.details ? photo.details.replace(/^public\\images\\/, '') : '';

  const calculateAge = (birthDate) => {
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  
  const handleSaveLike = () => {
    // Check if Mainuser.Number_Likes is 0
    if (Mainuser.number_likes === 0) {
      console.log('Number of likes is 0');
      return; // Exit the function
    }
  
    const likedUserId = user.user_id;
    
    // Send the userId and likedUserId to the server
    axios.post('http://localhost:8081/saveLike', { userId, likedUserId })
      .then(response => {
        console.log(response.data);
        // Handle the response if needed
        if (response.data.Status === 'Success') {
          window.location.reload();
        }
      })
      .catch(error => {
        // Handle errors if any
        console.error(error);
      });
  };
  


  return (
    <div>
      <div className="p-3 centerElement">
        <h1>Boundless</h1>
        <h4>
          {Mainuser && Mainuser.first_name} {Mainuser && Mainuser.last_name}
        </h4>
        <h4>
          encounters
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
      


      {/* NB LIKES */}
      <h6>
        <span className="bi bi-hand-thumbs-up" style={{ fontSize: '1.5rem', color: 'rgb(184, 20, 28)' }}></span> Number of Likes Left: <span style={{ color: 'rgb(60, 118, 211)' }}>{Mainuser && Mainuser.number_likes}</span>
      </h6>
      <h6>
        <span className="bi bi-chat-left" style={{ fontSize: '1.5rem', color: 'rgb(184, 20, 28)' }}></span> Number of Chats Left: <span style={{ color: 'rgb(60, 118, 211)' }}>{Mainuser && Mainuser.number_chats}</span>
      </h6>








      <div className="container mt-5 ">
        <div className="row">
        <div className="col-sm-4 d-flex justify-content-end">
      {/* creating the dislike button with an icon on it */}
      <button
        type="button"
        className="btn"
        name="submit"
        value="dislike"
        onClick={handleRefresh}
      >
        <span
          id="boot-icon"
          className="bi bi-hand-thumbs-down"
          style={{
            fontSize: '8rem',
            WebkitTextStrokeColor: 'rgb(220, 24, 24)',
            color: 'rgb(224, 26, 26)',
          }}
        ></span>
      </button>
    </div>

          <div className="col-sm-4">
          <div><img className="imsize" src={"http://localhost:8081/images/"+ imagePath} alt="Profile" /></div> 

            <h4 style={{ backgroundColor: '#b8141c' }}>
              <font color="#FFFFFF">About Me</font>
            </h4>{user && user.about}
            <p style={{ textAlign: 'left', padding: '8px' }}></p>
            
            <h3 style={{ backgroundColor: '#b8141c' }}>
              <font color="#FFFFFF">
                <span
                  id="boot-icon"
                  className="bi bi-person-lines-fill"
                  style={{ fontSize: '1.5rem', color: 'rgb(255, 255, 255)' }}
                ></span>{' '}
                Info
              </font>
            </h3>

            {/* username */}
            <h6 style={{ textAlign: 'left', padding: '4px' }}>
              <span id="boot-icon" className="bi bi-person"
                style={{ fontSize: '1.5rem', color: 'rgb(184, 20, 28)' }}
              ></span>
              <font color="#b8141c"> user name: </font>{user && user.username}
            </h6>

            {/* location */}
            <h6 style={{ textAlign: 'left', padding: '4px' }}>
              <span
                id="boot-icon"
                className="bi bi-geo-alt"
                style={{ fontSize: '1.5rem', color: 'rgb(184, 20, 28)' }}
              ></span>
              <font color="#b8141c"> </font>{user && user.city}
            </h6>

            {/* birth date */}
            <h6 style={{ textAlign: 'left', padding: '4px' }}>
              <span
                id="boot-icon"
                className="bi bi-calendar-day-fill"
                style={{ fontSize: '1.5rem', color: 'rgb(184, 20, 28)' }}
              ></span>
              <font color="#b8141c"> birth date: </font>{user && user.birth_date && new Date(user.birth_date).toLocaleDateString()}
            </h6>

            {/* age */}
            <h6 style={{ textAlign: 'left', padding: '4px' }}>
              <font color="#b8141c">age: </font>{calculateAge(user && user.birth_date)}
            </h6>

            {/* sex */}
        <h6 className="h6-user-profile"><span id="boot-icon" className="user-icons bi bi-gender-female "></span>
        <span id="boot-icon" className="user-icons bi bi-gender-male"></span>
        <span style={{ color: '#b8141c' }}> gender: </span>
        {user && user.gender}
        </h6> 

            {/* language */}
        <h6 className="h6-user-profile"><span id="boot-icon" className="user-icons bi bi-pen"></span>
        <span style={{ color: '#b8141c' }}> language: </span>
        {language && language.language_name}
        </h6>

            {/* email */}
        <h6 className="h6-user-profile"><span id="boot-icon" className="user-icons bi-envelope"></span>
        <span style={{ color: '#b8141c' }}> email: </span>
        {user && user.email}
        </h6>

            {/* education */}
        <h6 className="h6-user-profile"><span id="boot-icon" className="user-icons bi-mortarboard"></span>
        <span style={{ color: '#b8141c' }}> education: </span>
        {user && user.education}
        </h6>
        {/* work */}
        <h6 className="h6-user-profile"><span id="boot-icon" className="user-icons bi-briefcase-fill"></span>
        <span style={{ color: '#b8141c' }}> work: </span>
        {user && user.work}
        </h6>
        {/* religion */}
        <h6 className="h6-user-profile"><span id="boot-icon" className="user-icons fas fa-praying-hands"></span>
        <span style={{ color: '#b8141c' }}> religion: </span>
        {religion && religion.religion_name}
        </h6>
        {/* intrests */}
        <h6 className="h6-user-profile"><span >
        </span><span style={{ color: '#b8141c' }}> intrests: </span>
        </h6>
          </div>

          <div className="col-sm-4  d-flex ">
            {/* like button */}
            <button
              type="button"
              className="btn"
              name="submit"
              value="like"
              onClick={handleSaveLike}
            >
              <span
                id="boot-icon"
                className="bi bi-hand-thumbs-up"
                style={{ fontSize: '8rem', color: 'rgb(117, 205, 10)' }}
              ></span>
            </button>
            {/* </form> */}
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

export default Encounters;
