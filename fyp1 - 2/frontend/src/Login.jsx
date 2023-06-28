import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import axios from 'axios'; //import an api so we can comunicate with the backend
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";//nizar
function Login() {
 //delete cookie
 Cookies.remove("userID");//nizar
 Cookies.remove("adminid");
  
   /* hook in React to create a state variable called 'values' and a function to update its value called 'setValues'*/
   const [values, setValues] = useState({
    username:'',
    password:''
  })
  const navigate = useNavigate()

  const[error, setError] = useState('')

  //a handleSubmit function that is called when a form submission event occurs it uses Axios to send a POST request to an empty URL. The response is logged to the console in case of success, and any errors are caught and logged as well.
  const handleSubmit = (event) => {
    event.preventDefault();
  
    axios.post('http://localhost:8081/Login', values)
      .then(res => {
        if (res.data.Status === 'Success') {
        
          const userType = res.data.userType;
  
          if (userType === 'admin') {
            const adminid = res.data.admin_id;
            Cookies.set('adminid', adminid, { sameSite: 'strict' });
            navigate('/Dmin');
          } else {
            const userId = res.data.user_id;
            Cookies.set('userID', userId, { sameSite: 'strict' });
            navigate('/UserProfile');
            
          }
        } else {
          setError(res.data.Error);
        }
      })
      .catch(err => console.log(err));
  };
  
  return (
    <div className="text-center loginPageWithBackground">
      <div className="containerLogin ">
        <h1><strong>Boundless</strong></h1>
        <h4>Enter your credentials</h4>
        <div className='text-danger'>
        {/*Render any error message here if needed*/}
        {error && error}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username"><font color="#b8141c">Username:</font></label>
            <input type="text" onChange={e => setValues({...values, username:e.target.value})} className="form-control" name="username" placeholder="Enter username" />
         </div>

          <div className="form-group">
            <label htmlFor="password"><font color="#b8141c">Password:</font></label>
            <input type="password" onChange={e => setValues({...values,password:e.target.value})} className="form-control" placeholder="Enter password" name="password" />
          </div>

          <button type="submit" className="btn btn-danger">Login</button>
          <p>Click <Link to="/SignUp">here</Link> to create a new account</p>
        </form>
      </div>
      
    </div>
  );
}

export default Login;
