import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './CreateProfile.css';
import './Login.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function UserPayment(){
  const userId = Cookies.get('userID');
  
  const navigate = useNavigate();
  useEffect(() => {
    if (userId === undefined || userId === null) {
      navigate('/');
    }
  }, [userId, navigate]);

  
 
  const tiercode = Cookies.get('tiercode');
  const handleSubmit = (event) => {
    event.preventDefault();
    //const accountData = JSON.parse(sessionStorage.getItem('accountData'));
    axios.post('http://localhost:8081/UserPayment',{tiercode, userId})
            .then(response => {
              console.log(response.data);
              if(response.data.Status === 'Success'){
                navigate('/UserProfile');}else {
                }
            })
            .catch(error => {
              console.error('Error:', error);
            });
          };


  return (
    <form className="credit-card" onSubmit={handleSubmit}>
      <div className="form-header">
        <h4 className="title">Credit card detail</h4>
      </div>

      <div className="form-body">
        {/* Card Number */}
        <input type="text" className="card-number" placeholder="Card Number" />

        {/* Date Field */}
        <div className="date-field">
          <div className="month">
            <select name="Month">
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
              <option value="june">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
              <option value="december">December</option>
            </select>
          </div>
          <div className="year">
            <select name="Year">
              <option value="2016">2016</option>
              <option value="2017">2017</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>

        {/* Card Verification Field */}
        <div className="card-verification">
          <div className="cvv-input">
            <input type="text" placeholder="CVV" />
          </div>
          <div className="cvv-details">
            <p>3 or 4 digits usually found on the signature strip</p>
          </div>
        </div>

        {/* Buttons */}
        <button type="submit" className="proceed-btn" name="submit" >
          Proceed
        </button>
        <p>
          to return to the previous page click <a href="/userProfile">here</a>
        </p>
      </div>
      
    </form>
    
  );
};

export default UserPayment;
