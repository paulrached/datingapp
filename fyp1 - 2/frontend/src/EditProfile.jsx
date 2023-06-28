import React, { useState, useEffect } from 'react';
import axios from 'axios'; // You'll need to install axios for making HTTP requests
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './CreateProfile.css';
import'./Login.css';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import ImageUploader from 'react-images-upload';
import { Circle } from '@react-google-maps/api';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api/';
import { Link } from "react-router-dom";
const libraries = ["places"];
function EditProfile(){
  const userId = Cookies.get("userID");
  const navigate = useNavigate();
  useEffect(() => {
    if (userId === undefined || userId === null) {
      navigate("/"); // Redirect to the login page if userId is not present
    }
  }, [userId, navigate]);
  const [user, setUser] = useState([]);
  const [language, setLanguage] = useState([]);
  const [religion, setReligion] = useState([]);
  const [photo, setPhoto] = useState([])
  const [username, setusername] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [firstName, setfirstName] = useState(user.first_name);
  const [lastName, setlastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  //const [birthDatep, setBirthDatep] = useState("");
  const formattedDate = new Date(user.birth_date).toLocaleDateString('en-CA');


  const [education, setEducation] = useState("");
  const [work, setWork] = useState("");
  const [about, setAbout] = useState("");
  const [gender, setGender]= useState("");
  const [location, setLocation] = useState();
  const [languagep, setLanguagep] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [religionp, setReligionp] = useState([]);
  const [selectedReligion, setSelectedReligion] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [picture, setPicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFirstNameChange = (e) => {
    setfirstName(e.target.value);
  };
  const handleLastNameChange =(e) => {
    setlastName(e.target.value);
  };
  const handleBirthDateChange =(e) =>{
    setBirthDate(e.target.value);

  }
  // const handleBirthDateChange = (e) => {
  //   const { value } = e.target;
  //   setBirthDate(value);
  // };
  const handleEducationChange =(e) =>{
    setEducation(e.target.value)
  }
  const handleWorkChange =(e) =>{
    setWork(e.target.value)
  }
  const handleAboutChange =(e) =>{
    setAbout(e.target.value)
  }
  const handleGenderChange=(e) =>{
    setGender(e.target.value)
  }
  const handleLocationChange = (e) => {
    if (e.target.value !== location) {
      setLocation(e.target.value);
    }
  };
  const handlePlaceSelect = () => {
    const place = document.querySelector('input').value;
    setSelectedPlace(place);
  };
  const handlePictureChange = (e) => {
    const picture = e.target.files[0];
    setPicture(picture);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the data to the server using Axios
    axios.post('http://localhost:8081/editUserProfile', { 
      userId,
      picture,
      username,
      firstName,
      lastName,
      location,
      birthDate,
      gender,
      education,
      work,
      language: selectedLanguage,
     religion: selectedReligion,
      about ,})
      .then(response => {
        console.log(response.data);
        if(response.data.Status === 'Success'){
          navigate('/UserProfile');}else {
            setErrorMessage(response.data.Error); // Set the error message from the server response
          }
      })
      .catch(error => {
        console.error('Error:', error);
      setErrorMessage("An error occurred while signing up");
      });
    };
    //Language
    const fetchLanguage = () => {
      axios.get('http://localhost:8081/Language')
        .then(response => {
          setLanguage(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
    
    //Religion
    const fetchReligion = () => {
      axios.get('http://localhost:8081/Religion')
        .then(response => {
          setReligion(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/userInfo?userId=${userId}`);
        const userData = response.data.user[0];
        const languageData = response.data.language[0];
        const religionData=response.data.religion[0];
        const photoData=response.data.photo[0];

        setUser(userData);
        setLanguagep(languageData);
        setReligionp(religionData);
        setPhoto(photoData);
        // Set the field values with the retrieved data
        setusername(userData.username);
        setfirstName(userData.first_name);
        setlastName(userData.last_name);
        //setBirthDatep(userData.birth_date);
        setEducation(userData.education);
        setWork(userData.work);
        setAbout(userData.about);
        setGender(userData.gender);
        setLocation(userData.city);

        // Set the selected values for language and religion
        //setSelectedLanguage(languageData.language_name);
        //setSelectedReligion(religionData.religion_name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
    fetchLanguage();
    fetchReligion();
  }, [username]);

  const imagePath = photo && photo.details ? photo.details.replace(/^public\\images\\/, '') : '';
  return (
    <div>
      <div className="p-3 centerElement">
        <h1>Boundless</h1>
         <h4>{user.first_name} {user.last_name}</h4> 
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
    </div>
    <div className="col-sm-4">
      <h2>About Me</h2>
      <form  encType="multipart/form-data" onSubmit={handleSubmit}>
      {/* user picture */}
      <div><img className="imsize" src={"http://localhost:8081/images/"+ imagePath} alt="Profile" /></div> 
      {/* <input
                className="form-control"
                type="file"
                name="picture"
                accept="image/*"
                value={picture}
                onChange={handlePictureChange}
                // required
              /> */}
              <p>Click <Link to="/EditPicture">here</Link> to change your Profile Photo</p>
      <p></p>

        {/* first name */}
        <h6 className="h6-user-profile">
          <span style={{color: '#b8141c' }}> first name: </span>
          <input type="text" className="form-control1"  name="username" required 
            value={firstName}
            onChange={handleFirstNameChange}
            />
          
        </h6>
        {/* last name */}
        <h6 className="h6-user-profile">
          <span ></span>
          <span style={{ color: '#b8141c' }}> last name: </span>
          <input type="text" className="form-control1"  name="username" required 
            value={lastName}
            onChange={handleLastNameChange}
            />
        </h6>
        {/* location */}
        <h6 className="h6-user-profile">
          <span id="boot-icon" className="user-icons bi bi-geo-alt"></span>
          <span style={{ color: '#b8141c' }}> city:</span>
          <LoadScript googleMapsApiKey="AIzaSyCmYESqxZS3YJrdoCK_cFkey3oJnEhJ5Qc" libraries={libraries}>
            <Autocomplete
                onLoad={() => {}}
                onPlaceChanged={handlePlaceSelect}
              
              >
              <input type="text" className="form-control1" placeholder="Enter an address" required
              value ={location}
              onChange={handleLocationChange}
              onBlur={handleLocationChange} // Use onBlur event instead of onChange so when we click outside the box the value doesnt change
              />
            </Autocomplete>
          </LoadScript>
        </h6>
        {/* birthdate */}
        <h6 className="h6-user-profile">
          <span id="boot-icon" className="user-icons bi bi-calendar-day-fill"></span>
          <span style={{ color: '#b8141c' }}> birthdate:</span>
           <input
            type="date"
            className="form-control1"
            name="dateOfBirth"
            required
            id="birthDate"
            //value={birthDate ? formattedDate:''}
            value={birthDate}
            onChange={handleBirthDateChange}
          />
          
        </h6>
        {/* sex */}
        <h6 className="h6-user-profile">
          <span id="boot-icon" className="user-icons bi bi-gender-female "></span>
          <span id="boot-icon" className="user-icons bi bi-gender-male"></span>
          <span style={{ color: '#b8141c' }}> gender: </span>
          <input
            type="radio"
            className="form-check-input"
            id="m"
            name="gender"
            value="male"
            checked={gender === 'male'}
            onChange={handleGenderChange}
            required
          />
          <label className="form-check-label" htmlFor="m">Male</label>
          <input
            type="radio"
            className="form-check-input"
            id="f"
            name="gender"
            value="female"
            checked={gender === 'female'}
            onChange={handleGenderChange}
            required
          />
          <label className="form-check-label" htmlFor="f">Female</label>
        </h6>


        {/* language */}
        <h6 className="h6-user-profile"><span id="boot-icon" className="user-icons bi bi-pen"></span>
         <span style={{ color: '#b8141c' }}> language: </span>

           <select
            className="form-control1" 
            value={selectedLanguage} //in case id dindnt choose take the existing
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
           <option value="">Select Language</option>       
          {language
            .map(languageData => (
              <option key={languageData.language_code} value={languageData.language_code}>{languageData.language_name}</option>
            ))}
          </select>
          </h6>

        {/* education */}
        <h6 className="h6-user-profile"><span id="boot-icon" className="user-icons bi-mortarboard"></span>
        <span style={{ color: '#b8141c' }}> education: </span>
        <input type="text" className="form-control1" placeholder="Enter your education level" name="education"
          value={education}
          onChange={handleEducationChange} 
                  />
        </h6>
        {/* work */}
        <h6 className="h6-user-profile"><span id="boot-icon" className="user-icons bi-briefcase-fill"></span>
        <span style={{ color: '#b8141c' }}> work: </span>
        <input type="text" className="form-control1" placeholder="Enter your profession" name="work"
          value ={work}
          onChange={handleWorkChange}/>
        </h6>
        {/* religion */}
        <h6 className="h6-user-profile"><span id="boot-icon" className="user-icons fas fa-praying-hands"></span>
        <span style={{ color: '#b8141c' }}> religion: </span>
        <select
            className="form-control1" 
            value={selectedReligion} 
            onChange={(e) => setSelectedReligion(e.target.value)}
          >
           <option value="">Select Religion</option>       
          {religion
            
            .map(religionData => (
              <option key={religionData.religion_code} value={religionData.religion_code} >{religionData.religion_name}</option>
            ))}
          </select>
        </h6>
        {/* about */}
        <h6 className="h6-user-profile">
            <span style={{color: '#b8141c' }}> about: </span>
            <textarea className="form-control2" name="about" rows="6" placeholder="Write something about yourself"
            value={about}
            onChange={handleAboutChange}
            >
            </textarea>
        </h6>
        {/* button */}
        
        <button type="submit" className=" btn-primary btn-block">
              Submit
            </button></form>
      </div> 
    <div className="col-sm-4">
    </div>

  </div>
</div>


 </div>
)};

export default EditProfile;