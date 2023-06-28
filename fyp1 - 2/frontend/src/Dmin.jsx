import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Dmin() {
  // Cookie
  const navigate = useNavigate();
  const userId = Cookies.get("adminid");
  useEffect(() => {
    if (userId === undefined || userId === null) {
      navigate("/"); // Redirect to the login page if userId is not present
    }
  }, [userId, navigate]);

  const [users, setUsers] = useState([]);
  const [users1, setUsers1] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUser1, setSelectedUser1] = useState('');
  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [language, setLanguage] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [religion, setReligion] = useState([]);
  const [selectedReligion, setSelectedReligion] = useState('');
  const [newReligion, setNewReligion] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchUsers1();
    fetchInterests();
    fetchLanguage();
    fetchReligion();
  }, []);

  // Fetch not banned users
  const fetchUsers = () => {
    axios.get('http://localhost:8081/ausers')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Fetch banned users
  const fetchUsers1 = () => {
    axios.get('http://localhost:8081/ausers1')
      .then(response => {
        setUsers1(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Ban user
  const deleteUser = (name) => {
    axios.delete(`http://localhost:8081/ausers/${name}`)
      .then(response => { 
        console.log(response.data);
        fetchUsers(); // Refresh the user list
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Unban user
  const undeleteUser = (name) => {
    axios.post(`http://localhost:8081/undeleteUser/${name}`)
      .then(response => {
        console.log(response.data);
        fetchUsers(); // Refresh the user list
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Interests
  const fetchInterests = () => {
    axios.get('http://localhost:8081/ainterests')
      .then(response => {
        setInterests(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deleteInterest = (name) => {
    axios.delete(`http://localhost:8081/ainterests/${name}`)
      .then(response => {
        console.log(response.data);
        fetchInterests(); // Refresh the interest list
      })
      .catch(error => {
        console.error(error);
      });
  };

  const addInterest = () => {
    axios.post('http://localhost:8081/ainterests', { interests_name: newInterest })
      .then(response => {
        console.log(response.data);
        setNewInterest(''); // Clear the input field
        fetchInterests(); // Refresh the interest list
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Language
  const fetchLanguage = () => {
    axios.get('http://localhost:8081/aLanguage')
      .then(response => {
        setLanguage(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deleteLanguage = (name) => {
    axios.delete(`http://localhost:8081/aLanguage/${name}`)
      .then(response => {
        console.log(response.data);
        fetchLanguage(); // Refresh the interest list
      })
      .catch(error => {
        console.error(error);
      });
  };

  const addLanguage = () => {
    axios.post('http://localhost:8081/aLanguage', { language_name: newLanguage })
      .then(response => {
        console.log(response.data);
        setNewLanguage(''); // Clear the input field
        fetchLanguage(); // Refresh the interest list
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Religion
  const fetchReligion = () => {
    axios.get('http://localhost:8081/aReligion')
      .then(response => {
        setReligion(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deleteReligion = (name) => {
    axios.delete(`http://localhost:8081/aReligion/${name}`)
      .then(response => {
        console.log(response.data);
        fetchReligion(); // Refresh the interest list
      })
      .catch(error => {
        console.error(error);
      });
  };

  const addReligion = () => {
    axios.post('http://localhost:8081/aReligion', { religion_name: newReligion })
      .then(response => {
        console.log(response.data);
        setNewReligion(''); // Clear the input field
        fetchReligion(); // Refresh the interest list
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
  <div>
    <h6>admin ID: {userId}</h6>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
  <a className="nav-link" href="/">
    <span className="bi bi-door-open" style={{ fontSize: '5rem', color: 'rgb(200, 0, 0)' }}></span>
    <span className="ml-2">Logout</span>
  </a>
</div>

    <div className="container mt-5">
      <div className="row">
        <div className="col">
          <h100>ban user</h100>
          <div className="form-group">
            <select className="form-control" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.first_name}>{user.first_name}</option>
              ))}
            </select>
          </div>
          <a href="/Dmin">
          <button className="btn btn-danger" onClick={() => deleteUser(selectedUser)}>Ban</button></a>
        </div>
        <div className="col">
          <h101>unban user</h101>
          <div className="form-group">
            <select className="form-control" value={selectedUser1} onChange={(e) => setSelectedUser1(e.target.value)}>
              <option value="">Select User</option>
              {users1.map(user => (
                <option key={user.id} value={user.first_name}>{user.first_name}</option>
              ))}
            </select>
          </div>
          <a href="/Dmin">
          <button className="btn btn-success" onClick={() => undeleteUser(selectedUser1)}>Unban</button></a>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col">
          <h100>interest</h100>
          <div className="form-group">
            <select className="form-control" value={selectedInterest} onChange={(e) => setSelectedInterest(e.target.value)}>
              <option value="">Select Interest</option>
              {interests.map(interest => (
                <option key={interest.id} value={interest.interests_name}>{interest.interests_name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-danger" onClick={() => deleteInterest(selectedInterest)}>Delete Interest</button>
        </div>
        <div className="col">
          <h101>Add Interest</h101>
          <div className="form-group">
            <input className="form-control" type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} />
          </div>
          <button className="btn btn-success" onClick={addInterest}>Add Interest</button>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col">
          <h100>languages</h100>
          <div className="form-group">
            <select className="form-control" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
              <option value="">Select Language</option>
              {language.map(Language => (
                <option key={Language.id} value={Language.language_name}>{Language.language_name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-danger" onClick={() => deleteLanguage(selectedLanguage)}>Delete Language</button>
        </div>
        <div className="col">
          <h101>Add Language</h101>
          <div className="form-group">
            <input className="form-control" type="text" value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} />
          </div>
          <button className="btn btn-success" onClick={addLanguage}>Add Language</button>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col">
          <h100>religions</h100>
          <div className="form-group">
            <select className="form-control" value={selectedReligion} onChange={(e) => setSelectedReligion(e.target.value)}>
              <option value="">Select Religion</option>
              {religion.map(Religion => (
                <option key={Religion.id} value={Religion.religion_name}>{Religion.religion_name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-danger" onClick={() => deleteReligion(selectedReligion)}>Delete Religion</button>
        </div>
        <div className="col">
          <h101>Add Religion</h101>
          <div className="form-group">
            <input className="form-control" type="text" value={newReligion} onChange={(e) => setNewReligion(e.target.value)} />
          </div>
          <button className="btn btn-success" onClick={addReligion}>Add Religion</button>
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

export default Dmin;
