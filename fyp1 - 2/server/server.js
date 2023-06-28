import express from 'express';
import mysql from 'mysql'
import cors from 'cors' //Cross-Origin Resource Sharing, is a mechanism that allows web browsers to securely make cross-origin HTTP requests. In other words, it enables web applications running in one domain to access resources from another domain.
import cookieParser from 'cookie-parser'
import bcrypt from'bcrypt' //bycript is used for password hashing
import jwt from 'jsonwebtoken'//A JSON Web Token (JWT) is a compact, URL-safe means of representing claims between two parties. It is a token format commonly used for authentication and authorization in web applications and APIs.
import Routes from './Routes.js'; // Import the Routes module
import bodyParser from 'body-parser';
import path from 'path';

const app =express() //creat an app

// Add body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(cookieParser());
app.use(express.json());


app.use(express.static('public'));



// app.listen(8081, ()=>{
//     console.log("running");
// })
app.use('/', Routes); // Use the Routes module

app.listen(8081, () => {
  console.log('Server running on http://localhost:8081');
});