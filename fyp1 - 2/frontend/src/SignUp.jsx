import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import './Login.css';

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to store the error 
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform any necessary validation or data processing here

    // Send the data to the server using Axios
    axios.post('http://localhost:8081/SignUp', { email, password })
      .then(response => {
        console.log(response.data); // You can handle the response from the server here
        //navigate('/CreateProfile');
        if(response.data.Status === 'Success'){
          Cookies.set('email', email);
          
          navigate('/CreateProfile');}else {
            setErrorMessage(response.data.Error); // Set the error message from the server response
          }
      })
      .catch(error => {
        console.error('Error:', error);
      setErrorMessage("An error occurred while signing up");
      });
  };
  return (
    <div className="text-center loginPageWithBackground">
      <div className="containerLogin">
        <h1><strong>Boundless</strong></h1>
      {/*{errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display the error message */}
      <div className="text-danger">{errorMessage && errorMessage}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
          <label htmlFor="email"><font color="#b8141c">email:</font></label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email address"
            name="email"
            value={email}
            onChange={handleEmailChange}
          />
          </div>
          <div className="form-group">
          <label htmlFor="password"><font color="#b8141c">password:</font></label>
          <input
            type="password"
            className="form-control"
            placeholder="Create password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
          </div>
           <button type="submit" className="btn btn-danger"><strong>create new account</strong></button>
           <p>Click <Link to="/Login">here</Link> to return to login page</p>
        </form>
      </div>
      
    </div>
  );
}

export default SignUp;
