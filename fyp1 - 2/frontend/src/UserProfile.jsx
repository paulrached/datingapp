import React, { useState, useEffect } from 'react';
import axios from 'axios'; // You'll need to install axios for making HTTP requests
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './CreateProfile.css';
import'./Login.css';
import Cookies from "js-cookie";//nizar
import { useNavigate } from "react-router-dom";
//import myImage from 'C:\Users\Paul\Desktop\fyp1 - 2\dating.jpg';
import ImageUploader from 'react-images-upload';
const UserProfile = () => {
  
  Cookies.remove('tiercode');


  const userId = Cookies.get("userID");//nizar
  

  const [user, setUser] = useState([]);
  const [language, setLanguage] = useState([]);
  const [religion, setReligion] = useState([]);
  const [photo, setPhoto] = useState([])
  const [plus, setPlus] = useState([]);
  const [gold, setGold] = useState([]);
  const [platinum, setPlatinum] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleDeleteProfile = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Make a DELETE request to backend API to delete the user profile
      await axios.post(`http://localhost:8081/deleteProfile?userId=${userId}`);
      // Once the profile is deleted, the user to the login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };


  /////
  const navigate = useNavigate();//nizar
  ///nizar redirect if session dont exist
  useEffect(() => {
    if (userId === undefined || userId === null) {
      navigate("/"); // Redirect to the login page if userId is not present
    }
  }, [userId, navigate]);
  /////////


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/userInfo?userId=${userId}`);//nizar/////////
        const userData = response.data.user[0];
        const languageData = response.data.language[0];
        const religionData=response.data.religion[0];
        const photoData=response.data.photo[0];
        const plusData=response.data.plus[0];
        const goldData=response.data.gold[0];
        const platinumData=response.data.platinum[0];

        setUser(userData);
        setLanguage(languageData);
        setReligion(religionData);
        setPhoto(photoData);
        setPlus(plusData);
        setGold(goldData);
        setPlatinum(platinumData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

//rename picture
  const imagePath = photo && photo.details ? photo.details.replace(/^public\\images\\/, '') : '';
  Cookies.set('userfname', user.first_name, { sameSite: 'strict' });//nizar
  Cookies.set('userlname', user.last_name, { sameSite: 'strict' });//nizar
  Cookies.set('username', user.username, { sameSite: 'strict' });//nizar

  //to know the age 
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
  const plusTitle = `For ${plus && plus.tier_cost}$, you can get ${plus && plus.number_likes} likes and ${plus && plus.number_chats} chats for 30 days`;
  const goldTitle = `For ${gold && gold.tier_cost}$, you can get ${gold && gold.number_likes} likes and ${gold && gold.number_chats} chats for 30 days`; 
  const platinumTitle = `For ${platinum && platinum.tier_cost}$, you can get ${platinum && platinum.number_likes} likes and ${platinum && platinum.number_chats} chats for 30 days`; 
  const handleUpgrade = (accountType) => {
    let tiercode = '';
  
    if (accountType === 'plus') {
      const tiercode = plus.tier_code;
      Cookies.set('tiercode', tiercode, { sameSite: 'strict' });
      navigate('/UserPayment');
    } else if (accountType === 'gold') {
      const tiercode = gold.tier_code;
      Cookies.set('tiercode', tiercode, { sameSite: 'strict' });
      navigate('/UserPayment');
    } else if (accountType === 'platinum') {
      const tiercode = platinum.tier_code;
      Cookies.set('tiercode', tiercode, { sameSite: 'strict' });
      navigate('/USerPayment');
    }
  };
  return (//nizar  user && user.first_name  badel user.first_name kelon hek 
    <div>
      <div className="p-3 centerElement">
        <h1>Boundless</h1>
         <h4>{user && user.first_name} {user && user.last_name}</h4> 
         <h4>profile page</h4> 
      </div>

      <nav className="navbar navbar-expand-sm" style={{ backgroundColor: '#b8141c' }}>
        <div className="container-fluid">
          <h6></h6>
          <h6>
            <a href="/users">
              <span id="boot-icon" className="bi bi-person-circle" style={{ fontSize: '2rem', color: 'rgb(255, 255, 255)' }}></span>
            </a>
            <p>users</p>
          </h6>

          <h6>
            <a href="/encounters">
              <span id="boot-icon" className="bi bi-people" style={{ fontSize: '2rem', color: 'rgb(255, 255, 255)' }}></span>
            </a>
            <p>encounters</p>
          </h6>

          <h6>
            
            <a href="/Chat">
              <span id="boot-icon" className="bi bi-chat-dots" style={{ fontSize: '2rem', color: 'rgb(255, 255, 255)' }}></span>
            </a>
            <p>chats</p>
          </h6>

          <h6>
            <a href="/userProfile">
              <span id="boot-icon" className="bi bi-file-person" style={{ fontSize: '2rem', color: 'rgb(255, 255, 255)' }}></span>
            </a>
            <p>profile</p>
          </h6>
          <h6></h6>
        </div>
      </nav>
      <div className="container mt-5">
  <div className="row">
    <div className="col-sm-4">
      <h2>About Me</h2>
      <h5>Photo of me:</h5>
      <div><img className="imsize" src={"http://localhost:8081/images/"+ imagePath} alt="Profile" /></div> 
      <h5>About:</h5>{user && user.about}
      
       
      
      <h3 className="mt-4">My Info:</h3>
        {/* username */}
        <h6 className="h6-user-profile">
          <span id="boot-icon" className="user-icons bi bi-person"></span>
          <span style={{ color: '#b8141c' }}> user name: </span>
          {user && user.username}
        </h6>
        {/* location */}
        <h6 className="h6-user-profile">
          <span id="boot-icon" className="user-icons bi bi-geo-alt"></span>
          <span style={{ color: '#b8141c' }}> city: </span>
          {user && user.city}
        </h6>
        {/* birthdate */}
        <h6 className="h6-user-profile"><span id="boot-icon" className="user-icons bi bi-calendar-day-fill"></span>
        <span style={{ color: '#b8141c' }}> birthdate: </span>
        {user && user.birth_date && new Date(user.birth_date).toLocaleDateString()}
        </h6> 
        {/* age  */}
        <h6 className="h6-user-profile">
        <span style={{ color: '#b8141c' }}>age: </span>
        {calculateAge(user && user.birth_date)}
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
{/*                        setings section                                          */}
        <ul className="nav nav-pills flex-column">
      <li className="nav-item">
        <h6 style={{ backgroundColor: '#b8141c' }}>
          <span className="bi bi-gear" style={{ fontSize: '1.5rem', color: 'rgb(255, 255, 255)' }}>
            Settings
          </span>
        </h6>
      </li>
      <li className="nav-item">
        <a style={{ textAlign: 'left', padding: '4px' }} className="nav-link" href="/EditProfile">
          <span className="bi bi-pencil-fill" style={{ fontSize: '1.5rem', color: 'rgb(13, 12, 89)' }}></span>
          Edit Profile
        </a>
      </li>
      <li className="nav-item">
        <a style={{ textAlign: 'left', padding: '4px' }} className="nav-link" href="/">
          <span className="bi bi-door-open" style={{ fontSize: '1.5rem', color: 'rgb(13, 12, 89)' }}></span>
          Logout
          
        </a>
        <a href="/BlockList">
        <button className="btn">
        <span
        id="boot-icon"
        className="bi bi-person-x"
        style={{ fontSize: '1rem', color: '#b8141c' }}
          >
          block list
          </span>
          </button></a>
            </li>
      {/* delete profile */}
      <li className="nav-item">
          <button onClick={() => setShowConfirmation(true)} type="button" className="btn btn-danger">
            <span className="bi bi-exclamation-triangle" style={{ fontSize: '1.5rem' }}></span>
            Delete Profile
          </button>
          {showConfirmation && (
            <div className="alert alert-danger mt-3">
              <p>Are you sure you want to delete your profile?</p>
              <button onClick={handleConfirmDelete} className="btn btn-warning me-5">Yes</button>
              <button onClick={() => setShowConfirmation(false)} className="btn btn-secondary">No</button>
            </div>
            )}
        </li>
    </ul>


    </div> 
    <div className="col-sm-4">
      <h2>Boundless</h2>
      <h5>Tell us more about yourself</h5>
      <div>
        <img
          src="src/Images/logo.jpg"
          alt="Description of the image"
          width="346"
          height="412.66"
        />
      </div>
    </div>
    <div className="col-sm-4">
    <h3 className="mt-4">Upgrade Your Account</h3>
      {/* Button white bg with logo and hover - Plus Account */}
      {/* <form method="post" style={{ textAlign: 'left', paddingLeft: '100px' }} onSubmit={handleFormSubmit}> */}
        <button type="submit" className="btn" name="submit" value="plus">
          <span className="bi bi-credit-card-2-back" style={{ fontSize: '1.5rem', color: 'rgb(60, 118, 211)' }} data-bs-toggle="tooltip" title={plusTitle} onClick={() => handleUpgrade('plus')}></span>Plus
        </button>
        {/* Gold Account */}
        <button type="submit" className="btn" name="submit" value="gold">
          <span className="bi bi-credit-card-2-back" style={{ fontSize: '1.5rem', color: 'rgb(255, 210, 48)' }} data-bs-toggle="tooltip" title={goldTitle} onClick={() => handleUpgrade('gold')}></span> Gold
        </button>
        {/* Platinum Account */}
        <button type="submit" className="btn" name="submit" value="platinum">
          <span className="bi bi-credit-card-2-back" style={{ fontSize: '1.5rem', color: 'rgb(229, 228, 226)' }} data-bs-toggle="tooltip" title={platinumTitle} onClick={() => handleUpgrade('platinum')}></span> Platinum
        </button>
      {/* </form> */}
      {/* Initialize tooltips text when hover over */}
      {/* <script>
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl)
        })
      </script> */}
      <h6>
        <span className="bi bi-hand-thumbs-up" style={{ fontSize: '1.5rem', color: 'rgb(184, 20, 28)' }}></span> Number of Likes Left: <span style={{ color: 'rgb(60, 118, 211)' }}>{user && user.number_likes}</span>
      </h6>
      <h6>
        <span className="bi bi-chat-left" style={{ fontSize: '1.5rem', color: 'rgb(184, 20, 28)' }}></span> Number of Chats Left: <span style={{ color: 'rgb(60, 118, 211)' }}>{user && user.number_chats}</span>
      </h6>
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
};

export default UserProfile;
