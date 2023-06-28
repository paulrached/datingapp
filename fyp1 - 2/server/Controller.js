// The controller contains the business logic and handles the requests and responses. 
import bcrypt from'bcrypt' ;//bycript is used for password hashing
import con from './Model.js';
import multer from 'multer'; //multer is used to upload a file
import path from 'path'; //to get path for the file 
import { upload } from './Model.js';//import it from models
//const userModel = require('../models');///////////////////////
// import { findUserByEmail, updateUserPassword } from '../models/userModel';
// const nodemailer = require('nodemailer');
// const smtpTransport = require('nodemailer-smtp-transport');

export const login = (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM user_account WHERE username=?";
  const adminSql = "SELECT * FROM admin WHERE username=?";
  
  con.query(sql, [username], (err, userResult) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.json({ Status: "Error", Error: "Error in running query" });
    }
    if (userResult.length > 0) {
      const storedPassword = userResult[0].password;
      bcrypt.compare(password, storedPassword, (err, match) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.json({ Status: "Error", Error: "An error occurred during login" });
        }
        if (match) {
          const user_id = userResult[0].user_id;
          const suspend_date = userResult[0].suspend_date;

          if (suspend_date !== null) {
            return res.json({ Status: "Error", Error: "You got banned" });
          }

          return res.json({ Status: "Success", user_id: user_id, userType: "user" });
        } else {
          return res.json({ Status: "Error", Error: "Wrong username or password!" });
        }
      });
    } else {
      // Check if the username and password match in the admin table
      con.query(adminSql, [username], (err, adminResult) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          return res.json({ Status: "Error", Error: "Error in running query" });
        }
        if (adminResult.length > 0) {
          const storedPassword = adminResult[0].password;
          bcrypt.compare(password, storedPassword, (err, match) => {
            if (err) {
              console.error('Error comparing passwords:', err);
              return res.json({ Status: "Error", Error: "An error occurred during login" });
            }
            if (match) {
              const user_id = adminResult[0].user_id;
              const admin_id = adminResult[0].admin_id; // Fetch admin ID
              return res.json({ Status: "Success", user_id: user_id, userType: "admin", admin_id: admin_id }); // Send admin ID
            } else {
              return res.json({ Status: "Error", Error: "Wrong username or password!" });
            }
          });
        } else {
          return res.json({ Status: "Error", Error: "Wrong username or password!" });
        }
      });
    }
  });
};



export const signUp = (req, res) => {
  const { email, password } = req.body;

  // Check if the email already exists in the database
  const checkEmailExistsSql = "SELECT * FROM user_account WHERE email=?";
  con.query(checkEmailExistsSql, [email], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.json({ Status: "Error", Error: "An error occurred while checking email" });
    }
    if (result.length > 0) {
      return res.json({ Status: "Error", Error: "Email already in use!" });
    } else {
      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {//n the code above, the bcrypt.hash function is used to hash the password. It takes the password and a salt round value (10 in this case) as parameters. The higher the salt round value, the more secure but slower the hashing process
        if (err) {
          console.error('Error hashing password:', err);
          return res.json({ Status: "Error", Error: "An error occurred while signing up1" });
        }
        
        const insertSql = "INSERT INTO user_account (email, password) VALUES (?, ?)";
        const values = [email, hashedPassword];
        con.query(insertSql, values, (err, result) => {
          if (err) {
            console.error('Error executing SQL query:', err);
            return res.json({ Status: "Error", Error: "An error occurred while signing up2" });
          } else {
            return res.json({ Status: "Success" });
          }
        });
      });
    }
  });
};
export const getLanguage = (req, res) => {
  const sql = "SELECT * FROM language";
  con.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};
export const getReligion = (req, res) => {
  const sql = "SELECT * FROM religion";
  con.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};
export const getInterests = (req, res) => {
  const sql = "SELECT * FROM interests";
  con.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};
//userprofile
export const getUserInfo = (req, res) => {
  const userId = req.query.userId; // Retrieve the userId from the request query parameters

  // Your SQL queries
  const sql = "SELECT * FROM user_account WHERE user_id = ?";
  const sql1 = "SELECT * FROM language WHERE language_code = (SELECT language_code FROM user_account WHERE user_id = ?)";
  const sql2 = "SELECT * FROM religion WHERE religion_code = (SELECT religion_code FROM user_account WHERE user_id = ?)";
  const sql3 = "SELECT * FROM user_photo WHERE user_id = ?";
  const sql4 = "select *  from tier where tier_name='plus'";
  const sql5 = "select *  from tier where tier_name='gold'";
  const sql6 = "select *  from tier where tier_name='platinum'";
  // Execute the first query
  con.query(sql, [userId], (err, userData) => {
    if (err) {
      return res.json(err);
    }

    // Execute the second query
    con.query(sql1,[userId], (err, languageData) => {
      if (err) {
        return res.json(err);
      }
      // Execute the third query
      con.query(sql2,[userId], (err, religionData) => {
        if (err) {
          return res.json(err);
        }
        // Execute the fourth query
        con.query(sql3, [userId], (err, photoData) => {
          if (err) {
            return res.json(err);
          }
          // Execute the fifth query
          con.query(sql4, (err, plusData) => {
            if (err) {
              return res.json(err);
            }
            // Execute the sixth query
            con.query(sql5, (err, goldData) => {
              if (err) {
                return res.json(err);
              }
              // Execute the seventh query
              con.query(sql6, (err, platinumData) => {
                if (err) {
                  return res.json(err);
                }
                 // Combine the data from all queries
                const combinedData = {
                  user: userData,
                  language: languageData,
                  religion: religionData,
                  photo: photoData,
                  plus:plusData,
                  gold:goldData,
                  platinum:platinumData,
                };

                // Send the combined data as the response
                res.json(combinedData);
              });
            });
          });
        });
      });
    });
  });
};

export const userBlockedinfo = (req, res) => {
  const userId = req.query.userId; // Retrieve the userId from the request query parameters

  // Your SQL queriesuser_id != ? AND user_id NOT IN (SELECT user_id FROM block WHERE blocked_user_id = ? ) AND user_id NOT IN (SELECT blocked_user_id FROM block WHERE user_id = ?);

  const sql = "SELECT * FROM user_account WHERE user_id IN (SELECT blocked_user_id FROM block WHERE user_id = ?) ";
  const sql1 = "SELECT * FROM language WHERE language_code = (SELECT language_code FROM user_account WHERE user_id = ?)";
  const sql2 = "SELECT * FROM religion WHERE religion_code = (SELECT religion_code FROM user_account WHERE user_id = ?)";
  const sql3 = "SELECT * FROM user_photo WHERE user_id IN (SELECT blocked_user_id FROM block WHERE user_id = ?)";

  // Execute the first query
  con.query(sql, [userId], (err, userData) => {
    if (err) {
      console.error(err);
      return res.json(err);
    }

    // Execute the second query
    con.query(sql1, [userId], (err, languageData) => {
      if (err) {
        console.error(err);
        return res.json(err);
      }
      // Execute the third query
      con.query(sql2, [userId], (err, religionData) => {
        if (err) {
          console.error(err);
          return res.json(err);
        }
        // Execute the fourth query
        con.query(sql3, [userId], (err, photoData) => {
          if (err) {
            console.error(err);
            return res.json(err);
          }
          // Combine the data from all queries
          const combinedData = {
            user: userData,
            language: languageData,
            religion: religionData,
            photo: photoData,
          };

          // Log the combined data
          console.log(combinedData);

          // Send the combined data as the response
          res.json(combinedData);
        });
      });
    });
  });
};
export const getallUserInfo = (req, res) => {
  const userId = req.query.userId; // Retrieve the userId from the request query parameters

  // Your SQL queriesuser_id != ? AND user_id NOT IN (SELECT user_id FROM block WHERE blocked_user_id = ? ) AND user_id NOT IN (SELECT blocked_user_id FROM block WHERE user_id = ?);

  const sql = "SELECT * FROM user_account WHERE user_id != ? AND user_id NOT IN (SELECT user_id FROM block WHERE blocked_user_id = ? ) AND user_id NOT IN (SELECT blocked_user_id FROM block WHERE user_id = ?)";
  const sql1 = "SELECT * FROM language WHERE language_code = (SELECT language_code FROM user_account WHERE user_id = ?)";
  const sql2 = "SELECT * FROM religion WHERE religion_code = (SELECT religion_code FROM user_account WHERE user_id = ?)";
  const sql3 = "SELECT * FROM user_photo WHERE user_id != ? AND user_id NOT IN (SELECT user_id FROM block WHERE blocked_user_id = ? ) AND user_id NOT IN (SELECT blocked_user_id FROM block WHERE user_id = ?)";

  // Execute the first query
  con.query(sql, [userId,userId,userId], (err, userData) => {
    if (err) {
      console.error(err);
      return res.json(err);
    }

    // Execute the second query
    con.query(sql1, [userId], (err, languageData) => {
      if (err) {
        console.error(err);
        return res.json(err);
      }
      // Execute the third query
      con.query(sql2, [userId], (err, religionData) => {
        if (err) {
          console.error(err);
          return res.json(err);
        }
        // Execute the fourth query
        con.query(sql3, [userId,userId,userId], (err, photoData) => {
          if (err) {
            console.error(err);
            return res.json(err);
          }
          // Combine the data from all queries
          const combinedData = {
            user: userData,
            language: languageData,
            religion: religionData,
            photo: photoData,
          };

          // Log the combined data
          console.log(combinedData);

          // Send the combined data as the response
          res.json(combinedData);
        });
      });
    });
  });
};

export const getmatchUserInfo = (req, res) => {
  const userId = req.query.userId; // Retrieve the userId from the request query parameters

  // Your SQL queries
  const sql = "SELECT * FROM user_account WHERE user_id IN (SELECT user_id_1 FROM `match` WHERE user_id_2 = ? UNION SELECT user_id_2 FROM `match` WHERE user_id_1 = ?)";
  const sql1 = "SELECT * FROM language WHERE language_code = (SELECT language_code FROM user_account WHERE user_id = ?)";
  const sql2 = "SELECT * FROM religion WHERE religion_code = (SELECT religion_code FROM user_account WHERE user_id = ?)";
  const sql3 = "SELECT * FROM user_photo WHERE user_id IN (SELECT user_id_1 FROM `match` WHERE user_id_2 = ? UNION SELECT user_id_2 FROM `match` WHERE user_id_1 = ?)";

  // Execute the first query
  con.query(sql, [userId, userId], (err, userData) => {
    if (err) {
      console.error(err);
      return res.json(err);
    }

    // Execute the second query
    con.query(sql1, [userId], (err, languageData) => {
      if (err) {
        console.error(err);
        return res.json(err);
      }
      // Execute the third query
      con.query(sql2, [userId], (err, religionData) => {
        if (err) {
          console.error(err);
          return res.json(err);
        }
        // Execute the fourth query
        con.query(sql3, [userId, userId], (err, photoData) => {
          if (err) {
            console.error(err);
            return res.json(err);
          }
          // Combine the data from all queries
          const combinedData = {
            user: userData,
            language: languageData,
            religion: religionData,
            photo: photoData,
          };

          // Log the combined data
          

          // Send the combined data as the response
          res.json(combinedData);
        });
      });
    });
  });
};
//encounters
export const getRandUserInfo = (req, res) => {
  const userId = req.query.userId; // Retrieve the userId from the request query parameters

  // Your SQL queries
  const countSql = "SELECT COUNT(*) AS totalUsers FROM user_account";
  const minMaxSql = "SELECT MIN(user_id) AS minId, MAX(user_id) AS maxId FROM user_account";
  const randomUserSql = "SELECT * FROM user_account WHERE user_id <> ? AND user_id NOT IN (SELECT liked_user_id FROM `like` WHERE user_id = ?) AND user_id BETWEEN ? AND ? ORDER BY RAND() LIMIT 1 ";
  const languageSql = "SELECT * FROM language WHERE language_code = (SELECT language_code FROM user_account WHERE user_id = ?)";
  const religionSql = "SELECT * FROM religion WHERE religion_code = (SELECT religion_code FROM user_account WHERE user_id = ?)";
  const photoSql = "SELECT * FROM user_photo WHERE user_id = ?";

  // Execute the count query to get the total number of users
  con.query(countSql, (err, countResult) => {
    if (err) {
      return res.json(err);
    }
    
    const totalUsers = countResult[0].totalUsers;

    // Execute the min-max query to get the minimum and maximum user_ids
    con.query(minMaxSql, (err, minMaxResult) => {
      if (err) {
        return res.json(err);
      }

      const minId = minMaxResult[0].minId;
      const maxId = minMaxResult[0].maxId;

      // Generate a random user_id within the range (excluding the provided userId)
      const randomUserId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
      if (randomUserId === userId) {
        // If the randomUserId is equal to the provided userId, increment it by 1
        randomUserId++;
      }

      // Execute the random user query
      con.query(randomUserSql, [userId, userId, minId, maxId], (err, randomUserData) => {
        if (err) {
          return res.json(err);
        }

        const randomUserId = randomUserData[0].user_id; // Get the random user_id from the query result

        // Execute the language query using the randomUserId
        con.query(languageSql, [randomUserId], (err, languageData) => {
          if (err) {
            return res.json(err);
          }

          // Execute the religion query using the randomUserId
          con.query(religionSql, [randomUserId], (err, religionData) => {
            if (err) {
              return res.json(err);
            }

            // Execute the photo query using the randomUserId
            con.query(photoSql, [randomUserId], (err, photoData) => {
              if (err) {
                return res.json(err);
              }

              // Combine the data from all queries
              const combinedData = {
                user: randomUserData,
                language: languageData,
                religion: religionData,
                photo: photoData,
              };

              // Send the combined data as the response
              res.json(combinedData);
            });
          });
        });
      });
    });
  });
};
export const saveLike = (req, res) => {
  const { userId, likedUserId } = req.body;

  // Insert userId and likedUserId into the like table
  const insertLikeSql = "INSERT INTO `like` (user_id, liked_user_id) VALUES (?, ?)";
  const insertLikeValues = [userId, likedUserId];

  con.query(insertLikeSql, insertLikeValues, (err, insertResult) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.json({ Status: "Error", Error: "An error occurred while saving the like" });
    }

    // Decrease the value of number_likes by 1
    const updateLikesSql = "UPDATE user_account SET number_likes = number_likes - 1 WHERE user_id = ?";
    const updateValues = [userId];

    con.query(updateLikesSql, updateValues, (err, updateResult) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.json({ Status: "Error", Error: "An error occurred while updating the number of likes" });
      }

      // Check if a like exists between userId and likedUserId
      const checkLikeSql = "SELECT * FROM `like` WHERE user_id = ? AND liked_user_id = ?";
      const checkLikeValues = [likedUserId, userId];

      con.query(checkLikeSql, checkLikeValues, (err, likeResult) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          return res.json({ Status: "Error", Error: "An error occurred while checking for a like" });
        }

        // If a like exists, insert into the match table
        if (likeResult.length > 0) {
          const insertMatchSql = "INSERT INTO `match` (user_id_1, user_id_2, match_date) VALUES (?, ?, NOW())";
          const insertMatchValues = [userId, likedUserId];

          con.query(insertMatchSql, insertMatchValues, (err, insertMatchResult) => {
            if (err) {
              console.error('Error executing SQL query:', err);
              return res.json({ Status: "Error", Error: "An error occurred while inserting the match" });
            }

            return res.json({ Status: "Success" });
          });
        } else {
          return res.json({ Status: "Success" });
        }
      });
    });
  });
};
export const saveNbchat = (req, res) => {
  const { userId } = req.body;

  // Decrease the value of number_chats by 1
  const updateChatsSql = "UPDATE user_account SET number_chats = number_chats - 1 WHERE user_id = ?";
  const updateValues = [userId];

  con.query(updateChatsSql, updateValues, (err, updateResult) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.json({ Status: "Error", Error: "An error occurred while updating the number of chats" });
    }

    return res.json({ Status: "Success" });
  });
};
export const payment = (req, res) => {
  const { tiercode, userId } = req.body;

  const selectQuery = "SELECT * FROM tier WHERE tier_code = ?";
  const updateQuery = "UPDATE user_account SET tier_code = ?, number_likes = ?, number_chats = ? WHERE user_ID = ?";
  const insertQuery = "INSERT INTO payment (payment_date, amount, user_id) VALUES (CURRENT_DATE(), ?, ?)";

  con.query(selectQuery, [tiercode], (err, selectResult) => {
    if (err) {
      console.error("Error executing select query:", err);
      return res.status(500).json({ error: "An error occurred while executing the select query." });
    }

    // Assuming the select query returns a single row
    const { tier_code, number_likes, number_chats,tier_cost } = selectResult[0];

    con.query(updateQuery, [tier_code, number_likes, number_chats, userId], (err) => {
      if (err) {
        console.error("Error updating user_account:", err);
        return res.status(500).json({ error: "An error occurred while updating user_account." });
      }
      con.query(insertQuery, [tier_cost, userId], (err) => {
        if (err) {
          console.error("Error inserting payment:", err);
          return res.status(500).json({ error: "An error occurred while inserting payment." });
        }

        return res.json({ Status: "Success" });;
      });
    });
  });
};
export const editUserInfo = (req, res) => {
  const { userId, firstName, lastName, location, education, birthDate, gender, work, about, language, religion } = req.body;

  console.log('Received request to edit user info');
  console.log('userId:', userId);
  console.log('firstName:', firstName);
  console.log('lastName:', lastName);
  console.log('location:', location);
  console.log('education:', education);
  console.log('birthDate:', birthDate);
  console.log('gender:', gender);
  console.log('work:', work);
  console.log('about:', about);
  console.log('language:', language);
  console.log('religion:', religion);
  

  // Update the user account information in the database where username matches
  const updateQuery = "UPDATE user_account SET first_name = ?, last_name = ?, city = ?, birth_date = ?, gender = ?, work = ?, education = ?, about = ?, language_code = ?, religion_code = ? WHERE user_id = ?";
  con.query(updateQuery, [firstName, lastName, location, birthDate, gender, work, education, about, language || null, religion || null, userId], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.json({ Status: "Error", Error: "An error occurred while updating data" });
    }
    console.log('User info updated successfully');
    return res.json({ Status: "Success" });
  });
};


export const EditPicture = (req, res) => {
  // Process the file upload
  upload(req, res, function (err) {
    if (err) {
      console.error('Error:', err);
      // Handle error and send a response
      return res.status(500).json({ error: 'An error occurred while uploading the file' });
    }

    // Access the uploaded file using req.file
    if (!req.file) {
      // If no file was uploaded
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the file path from req.file
    const filePath = req.file.path;
    console.log('File path:', filePath);

    // Retrieve the user_id based on the provided email
    const { userId } = req.body;
    console.log('User ID:', userId);

    const deleteQuery = 'DELETE FROM user_photo WHERE user_id = ?';
    con.query(deleteQuery, [userId], (err, result) => {
      if (err) {
        console.error('Error:', err);
        console.log('An error occurred while deleting the previous user photo');
        return res.status(500).json({ error: 'An error occurred while deleting the previous user photo' });
      }

      console.log('Previous user photo deleted');

      const insertQuery = 'INSERT INTO user_photo (user_id, details) VALUES (?, ?)';
      con.query(insertQuery, [userId, filePath], (err, result) => {
        if (err) {
          console.error('Error:', err);
          console.log('An error occurred while inserting the file path into the database');
          return res.status(500).json({ error: 'An error occurred while inserting the file path into the database' });
        }

        console.log('File uploaded and inserted into the database');

        // Send a success response
        return res.status(200).json({ message: 'File uploaded and inserted into the database' });
      });
    });
  });
};



export const UploadFile = (req, res) => {
  // Process the file upload
  upload(req, res, function (err) {
    if (err) {
      console.error('Error:', err);
      // Handle error and send a response
      return res.status(500).json({ error: 'An error occurred while uploading the file' });
    }

    // Access the uploaded file using req.file
    if (!req.file) {
      // If no file was uploaded
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get the file path from req.file
    const filePath = req.file.path;

    // Retrieve the user_id based on the provided email
    const { email } = req.body;
    const getUserIdQuery = 'SELECT user_id FROM user_account WHERE email = ?';
    con.query(getUserIdQuery, [email], (err, result) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'An error occurred while retrieving the user_id' });
      }

      if (result.length === 0) {
        // If no user was found with the provided email
        return res.status(400).json({ error: 'No user found with the provided email' });
      }

      const userId = result[0].user_id;

      // Perform any necessary operations with the file
      // For example, you can save the file path to a database or process the image
      const insertQuery = 'INSERT INTO user_photo (user_id, details) VALUES (?, ?)';
      con.query(insertQuery, [userId, filePath], (err, result) => {
        if (err) {
          console.error('Error:', err);
          return res.status(500).json({ error: 'An error occurred while inserting the file path into the database' });
        }

        // Send a success response
        return res.status(200).json({ message: 'File uploaded and inserted into the database' });
      });
    });
  });
};

export const checkUsernameAvailability = (req, res) => {
  console.log(req.query);
  const { username } = req.query;
  const sql = "SELECT * FROM user_account WHERE username=?";
  con.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.json({ Status: "Error", Error: "An error occurred while checking username" });
    }
    if (result.length > 0) {
      return res.json({ isAvailable: false });
    } else {
      return res.json({ isAvailable: true });
    }
  });
};
export const fetchInfo = (req, res) => {
  const { email, username, firstName, lastName, location, education, birthDate, gender, language, religion, work, about, interests } = req.body;

  // Check if the username already exists in the database
  const checkUsernameQuery = "SELECT COUNT(*) AS count FROM user_account WHERE username = ?";
  con.query(checkUsernameQuery, [username], (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.json({ Status: "Error", Error: "An error occurred while fetching" });
    }

    const usernameExists = result[0].count > 0;

    if (usernameExists) {
      return res.json({ Status: "Error", Error: "The username already exists. Please choose a different username." });
    }

    // Update the user account information in the database where email matches
    const updateQuery = "UPDATE user_account SET number_chats=(SELECT number_chats FROM tier WHERE tier_name='default'),number_likes=(SELECT number_likes FROM tier WHERE tier_name='default'), username = ?, first_name = ?, last_name = ?, city = ?, birth_date = ?, gender = ?, work = ?, language_code = ?, religion_code = ?, education = ?, about = ? WHERE email = ?";
    con.query(updateQuery, [username, firstName, lastName, location, birthDate, gender, work, language || null, religion || null, education, about, email], (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.json({ Status: "Error", Error: "An error occurred while updating data" });
      }
      return res.json({ Status: "Success" });
    });
  });
};




//admin page/////////////////
export const agetUsers = (req, res) => {
  const sql = "SELECT * FROM user_account WHERE suspend_date IS NULL";

  con.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};
export const agetUsers1 = (req, res) => {
  const sql = "SELECT * FROM user_account WHERE suspend_date IS NOT NULL";
  con.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};
// ban user
export const adeleteUser = (req, res) => {
  const name = req.params.name;
  const deleteUserSql = "UPDATE user_account SET suspend_date = CURRENT_DATE WHERE first_name = ?";
  con.query(deleteUserSql, [name], (err, result) => {
    if (err) return res.json(err);
  });
};
//unban user
export const undeleteUser = (req, res) => {
  const name = req.params.name;

  // Delete user
  const deleteUserSql = "UPDATE user_account SET suspend_date = NULL WHERE first_name = ?";
  con.query(deleteUserSql, [name], (err, result) => {
    if (err) return res.json(err);
  });
  
};

export const agetInterests = (req, res) => {
  const sql = "SELECT * FROM interests";
  con.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};
export const acreateInterest = (req, res) => {
  const { interests_name } = req.body;
  const sql = "INSERT INTO interests (interests_name) VALUES (?)";
  con.query(sql, [interests_name], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
};
export const adeleteInterest = (req, res) => {
  const name = req.params.name;
  const sql = "DELETE FROM interests WHERE interests_name = ?";
  con.query(sql, [name], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
};
export const agetLanguage = (req, res) => {
  const sql = "SELECT * FROM language";
  con.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};
export const acreateLanguage = (req, res) => {
  const { language_name } = req.body;
  const sql = "INSERT INTO language (language_name) VALUES (?)";
  con.query(sql, [language_name], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
};
export const adeleteLanguage = (req, res) => {
  const name = req.params.name;
  const sql = "DELETE FROM language WHERE language_name = ?";
  con.query(sql, [name], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
};
export const agetReligion = (req, res) => {
  const sql = "SELECT * FROM religion";
  con.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};
export const acreateReligion = (req, res) => {
  const { religion_name } = req.body;
  const sql = "INSERT INTO religion (religion_name) VALUES (?)";
  con.query(sql, [religion_name], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
};
export const adeleteReligion = (req, res) => {
  const name = req.params.name;
  const sql = "DELETE FROM religion WHERE religion_name = ?";
  con.query(sql, [name], (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
};
//////admin////////////
export const deleteProfile = (req, res) => {
  const userId = req.query.userId;

  const deleteLikeSql = "DELETE FROM `like` WHERE user_id = ? OR liked_user_id = ?";
  const deleteUserAccountSql = "DELETE FROM user_account WHERE user_id = ?";
  const deleteUserPhotoSql = "DELETE FROM user_photo WHERE user_id = ?";
  const deleteMatchSql = "DELETE FROM `match` WHERE user_id_1 = ? OR user_id_2 = ?";

  console.log("Deleting likes...");
  // Execute the first query to delete likes
  con.query(deleteLikeSql, [userId, userId], (err) => {
    if (err) {
      console.error("Error deleting likes:", err);
      return res.json(err);
    }
    console.log("Likes deleted successfully.");

    console.log("Deleting user account...");
    // Execute the second query to delete the user account
    con.query(deleteUserAccountSql, [userId], (err) => {
      if (err) {
        console.error("Error deleting user account:", err);
        return res.json(err);
      }
      console.log("User account deleted successfully.");

      console.log("Deleting user photos...");
      // Execute the third query to delete user photos
      con.query(deleteUserPhotoSql, [userId], (err) => {
        if (err) {
          console.error("Error deleting user photos:", err);
          return res.json(err);
        }
        console.log("User photos deleted successfully.");

        console.log("Deleting user matches...");
        // Execute the fourth query to delete user matches
        con.query(deleteMatchSql, [userId, userId], (err) => {
          if (err) {
            console.error("Error deleting user matches:", err);
            return res.json(err);
          }
          console.log("User matches deleted successfully.");

          res.json({ message: 'Profile deleted successfully' });
        });
      });
    });
  });
};

export const unMatch = (req, res) => {
  const idtosend = req.body.idtosend;
  const userid1 = req.body.userid1;

  const deleteLikeSql = "DELETE FROM `like` WHERE (user_id = ? AND liked_user_id = ?) OR (user_id = ? AND liked_user_id = ?)";
  const deleteMatchSql = "DELETE FROM `match` WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?);";
    console.log("Deleting likes...");
  // Execute the query to delete the likes
  con.query(deleteLikeSql, [userid1, idtosend, idtosend, userid1], (err, result) => {
    if (err) {
      console.error("Error deleting likes:", err);
      return res.json(err);
    }
    console.log(`${result.affectedRows} like(s) deleted successfully.`);

    console.log("Deleting user matches...");
    // Execute the query to delete the user matches
    con.query(deleteMatchSql, [userid1, idtosend, idtosend, userid1], (err, result) => {
      if (err) {
        console.error("Error deleting user matches:", err);
        return res.json(err);
      }
      console.log(`${result.affectedRows} user match(es) deleted successfully.`);

      res.json({ message: 'Profile deleted successfully' });
    });
  });
};
export const Block = (req, res) => {
  const idtosend = req.body.idtosend;
  const userid1 = req.body.userid1;

  const deleteLikeSql = "INSERT INTO block (user_id, blocked_user_id) VALUES (?, ?)";
    console.log("blocking...");
  // Execute the query to delete the likes
  con.query(deleteLikeSql, [idtosend, userid1], (err, result) => {
    if (err) {
      console.error("Error blocking:", err);
      return res.json(err);
    }
    console.log(`${result.affectedRows} block successful.`);
  });
};
export const unBlock = (req, res) => {
  const idtosend = req.body.idtosend;
  const userid1 = req.body.userid1;

  const deleteLikeSql = "DELETE FROM block WHERE user_id=? AND blocked_user_id=?";
    console.log("blocking...");
  // Execute the query to delete the likes
  con.query(deleteLikeSql, [idtosend, userid1], (err, result) => {
    if (err) {
      console.error("Error blocking:", err);
      return res.json(err);
    }
    console.log(`${result.affectedRows} block successful.`);
  });
};


