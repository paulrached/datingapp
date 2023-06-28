
import 'bootstrap/dist/css/bootstrap.min.css';
import './CreateProfile.css';
import'./Login.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api/';
//import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const libraries = ["places"];
function CreateProfile(){
  const email = Cookies.get("email");

  const [username, setusername] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [education, setEducation] = useState("")
  const [work, setWork] = useState("")
  const [about, setAbout] = useState("")
  const [gender, setGender]= useState("")
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [religion, setReligion] = useState([]);
  const [selectedReligion, setSelectedReligion] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [picture, setPicture] = useState(null);
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  // const [interests, setInterests] = useState([]);
  // const [selectedInterest, setSelectedInterest] = useState('');
  const navigate = useNavigate();
  const checkUsernameAvailability = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/checkUsername?username=${username}`);
      setIsUsernameAvailable(response.data.isAvailable);
    } catch (error) {
      console.error('Error checking username availability:', error);
    }
  };
 useEffect(() => {
 fetchLanguage();
 fetchReligion();
 fetchInterests();
 checkUsernameAvailability();

}, [username]);
  // const handleUsernameChange = (e) => {
  //   setusername(e.target.value);
  // };
  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setusername(value);

    // Perform API call to check username availability
    checkUsernameAvailability();
  };
  const handleFirstNameChange = (e) => {
    setfirstName(e.target.value);
  };
  const handleLastNameChange =(e) => {
    setlastName(e.target.value);
  };
  const handleBirthDateChange =(e) =>{
    setBirthDate(e.target.value);
  }
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
    // Update the location state only when the input value changes
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
  // const handleInterestChange = (selectedOptions) => {
  //   setInterests(selectedOptions);
  // };
  const handleInterestChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedInterests(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the data to the server using Axios
    axios.post('http://localhost:8081/CreateProfile', {
  email: email, // Include the email in the request body
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
  interests: selectedInterests,
  about
})
      .then(response => {
        console.log(response.data);
        //navigate('/UploadFile');
        if(response.data.Status === 'Success'){
          navigate('/UploadFile');}else {
            setErrorMessage(response.data.Error); // Set the error message from the server response
          }
      })
      .catch(error => {
        console.error('Error:', error);
      setErrorMessage("An error occurred while signing up");
      });
    };
    //interests
    const fetchInterests = () => {
      axios.get('http://localhost:8081/interests')  //get the data from this link
        .then(response => {
          setInterests(response.data);
        })
        .catch(error => {
          console.error(error);
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
  return (
    <div className="CreateProfileWithBackground">
      <div className="p-3 centerElement" >
        <h1 ><strong>Boundless</strong></h1> 
        
      </div>
      <form  encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-sm-6">
            <div className="d-flex flex-column justify-content-center ">
              {/*user name*/}
              <div className="panel panel-primary">
                <div className="panel-body">
                  <h3 className="text-on-pannel text-primary"><strong className="text-uppercase"> username <span style={{ color: '#ff0000' }}>*</span></strong></h3>
                  <input type="text" className="form-control1" placeholder="Enter your username" name="username" required 
                  value={username}
                  onChange={handleUsernameChange}/>
                    <div className="availability-container">{isUsernameAvailable === true ? (
                      <p style={{ color: 'green' }}>Username is available</p>
                    ) : (
                      <p style={{ color: 'red' }}>Username is not available</p>
                    )}
                  </div>
                </div>
              </div>
               {/*first name*/}
              <div className="panel panel-primary">
                <div className="panel-body">
                  <h3 className="text-on-pannel text-primary">
                    <strong className="text-uppercase"> first name <span style={{ color: '#ff0000' }}>*</span></strong>
                  </h3>
                  <input type="text" className="form-control1" placeholder="Enter your first name" name="firstName" required 
                  value={firstName}
                  onChange={handleFirstNameChange}
                  />
                </div>
              </div>
              {/*last name*/}
              <div className="panel panel-primary">
                <div className="panel-body">
                  <h3 className="text-on-pannel text-primary">
                    <strong className="text-uppercase"> last name <span style={{ color: '#ff0000' }}>*</span></strong>
                  </h3>
                  <input type="text" className="form-control1" placeholder="Enter your last name" name="lastName" required
                    value ={lastName}
                    onChange={handleLastNameChange}
                  />
                </div>
              </div>
              {/*location>*/}
              <div className="panel panel-primary">
                <div className="panel-body">
                  <h3 className="text-on-pannel text-primary">
                    <strong className="text-uppercase">Location <span style={{ color: '#ff0000' }}>*</span></strong></h3>
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
                </div>
              </div>
              {/*birthdate*/}
              <div className="panel panel-primary">
                <div className="panel-body">
                  <h3 className="text-on-pannel text-primary">
                    <strong className="text-uppercase"> date of birth <span style={{ color: '#ff0000' }}>*</span></strong>
                  </h3>
                  <input type="date" className="form-control1" name="dateOfBirth" required
                  value={birthDate}
                  onChange={handleBirthDateChange}
                  />
                </div>
              </div>
              {/*gender*/}
              <div className="panel panel-primary">
                <div className="panel-body">
                  <h3 className="text-on-pannel text-primary">
                    <strong className="text-uppercase"> I am a <span style={{ color: '#ff0000' }}>*</span></strong>
                  </h3>
                  <div className="form-check">
                    <h4>
                      <input type="radio" className="form-check-input" id="m" name="gender" value="male" checked={gender === 'male'}
                        onChange={handleGenderChange}
                        required
                      />
                      <label className="form-check-label" htmlFor="m">Male</label>
                    </h4>
                    <h4>
                      <input type="radio" className="form-check-input" id="f" name="gender" value="female" checked={gender === 'female'}
                        onChange={handleGenderChange}
                        required
                      />
                      <label className="form-check-label" htmlFor="f">Female</label>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="d-flex flex-column justify-content-center">
               {/*education*/}
                <div className="panel panel-primary">
                <div className="panel-body">
                  <h3 className="text-on-pannel text-primary"><strong className="text-uppercase"> education </strong></h3>
                  <input type="text" className="form-control1" placeholder="Enter your education level" name="education"
                  value={education}
                  onChange={handleEducationChange} 
                  />
                </div>
                </div>
                {/*work*/}
                <div className="panel panel-primary">
                <div className="panel-body">
                  <h3 className="text-on-pannel text-primary"><strong className="text-uppercase"> work </strong></h3>
                  <input type="text" className="form-control1" placeholder="Enter your profession" name="work"
                  value ={work}
                  onChange={handleWorkChange}
                  />
                </div>
                </div>
                {/*language*/}
                 <div className="panel panel-primary">
                <div className="panel-body">
                  <div className="form-group1">
                    <h4>
                      <h3 className="text-on-pannel text-primary">
                        <label htmlFor="lang" className="text-uppercase"><strong>Native Language:</strong></label>
                      </h3>
                      <select className="form-control1" 
                      value={selectedLanguage} 
                      onChange={(e) => setSelectedLanguage(e.target.value)}>
                        <option value="">Select Language</option>
                        {language.map(Language => (
                          <option key={Language.id} value={Language.language_code}>{Language.language_name}</option>
                        ))}
                      </select>
                    </h4>
                  </div>
                </div>
                </div> 
                {/*religion*/}
                <div className="panel panel-primary">
                  <div className="panel-body">
                    <div className="form-group1">
                      <h4>
                        <h3 className="text-on-pannel text-primary">
                          <label htmlFor="religion" className="text-uppercase"><strong>Religion</strong></label>
                        </h3>
                        <select className="form-control1" 
                          value={selectedReligion} 
                          onChange={(e) => setSelectedReligion(e.target.value)}>
                          <option value="">Select Religion</option>
                          {religion.map(Religion => (
                          <option key={Religion.id} value={Religion.religion_code}>{Religion.religion_name}</option>
                          ))}
                        </select>       
                    </h4>
                  </div>
                </div>
                </div>
              {/*intrests*/}
              <div className="panel panel-primary">
                  <div className="panel-body">
                    <div className="form-group1">
                      <h4>
                        <h3 className="text-on-pannel text-primary">
                          <label htmlFor="intrests" className="text-uppercase"><strong>Intersts</strong></label>
                        </h3>
                        <select
                            className="form-control-intrests"
                            multiple
                            value={selectedInterests}
                            onChange={handleInterestChange}
                          >
                            <option value="">Select Interests</option>
                            {interests.map((interest) => (
                              <option key={interest.id} value={interest.interests_code}>{interest.interests_name}</option>
                            ))}
                          </select>
                        {/* <select value={selectedInterest} onChange={(e) => setSelectedInterest(e.target.value)}>
                              <option value="">Select Interest</option>
                              {interests.map(interest => (
                                <option key={interest.id} value={interest.interests_name}>{interest.interests_name}</option>
                                 ))} 
                            </select> */}
                        {/* <Select
                          className="form-control-intrests"
                          id="interests"
                          options={interests.map((interest) => ({
                            value: interest.value,
                            label: interest.label
                          }))}
                          isMulti
                          onChange={handleInterestChange}
                          value={selectedInterests}
                        /> */}
                    </h4>
                  </div>
                </div>
              </div>

              {/*about*/}
              <div className="panel panel-primary">
                <div className="panel-body">
                  <div className="form-group">
                  <h3 className="text-on-pannel text-primary">
                      <label htmlFor="about" className="text-uppercase"><strong>About</strong></label></h3>
                      <textarea className="form-control2" name="about" rows="6" placeholder="Write something about yourself"
                      value={about}
                      onChange={handleAboutChange}
                      //</div>onChange={e => setData({...data, about:e.target.value})}
                      >
                      </textarea>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-center panel panel-primary">
          <div className="panel-body ">
            {/* button */}
            <button type="submit" className=" btn-primary btn-block">
              Submit
            </button>
          </div>
        </div>
      </form>
            {/* footer */}
    <div className="footer">
      <p>
        Fields marked with <span style={{ color: '#ff0000' }}>*</span> are required.
      </p>
    </div>

      <div>

  </div>
</div>
  );
  }

export default CreateProfile;
