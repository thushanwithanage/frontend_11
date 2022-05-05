import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from "./App"
import Login from './components/login';
import Cats from './components/cats';
import SignUp from './components/signUp';
import ForgotPW from './components/forgotpw';
import User from './components/user';

ReactDOM.render(
  <BrowserRouter>
    <React.Fragment>

      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
       
        <Route exact path="/home" element={<Cats />}/>

        <Route exact path="/forgot" element={<ForgotPW />}/>

        <Route exact path="/user" element={<User />}/>
        
      </Routes>
    </React.Fragment>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();
