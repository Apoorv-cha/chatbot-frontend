import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./NotSignin.css";

const checkPasswordEmailUrl = "http://localhost:5000/api/users/login/";
const createUserUrl = "http://localhost:5000/api/users/register/";

function NotSignin() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [isErr, setisErr] = useState(false);

  const handleEmail = (e) => {
    // console.log("email is: ", Email);
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    // console.log("password is: ", Password);
    setPassword(e.target.value);
  };

  const checkEmail = () => {
    axios
      .post(checkPasswordEmailUrl, {
        email: Email,
        password: Password,
      })
      .then((res) => {
        // console.log("res is: ", res);
        Cookies.set("token", res.data.token);
        Cookies.set("userId", res.data._id);
        window.location.href = `${process.env.REACT_APP_FRONTEND_URL}`;
      })
      .catch((err) => {
        console.log("err is: ", err);
        setisErr(true);
      });
  };

  const createUser = () => {
    console.log("emaail passwoers", Email, Password);

    console.log();
    axios
      .post(createUserUrl, {
        name: "apoorv",
        email: Email,
        password: Password,
      })
      .then((res) => {
        // console.log("res is: ", res);
        Cookies.set("token", res.data.token);
        Cookies.set("userId", res.data._id);
        setisErr(false);
        window.location.href = `${process.env.REACT_APP_FRONTEND_URL}`;
      })
      .catch((err) => {
        console.log("err is: ", err);
        setisErr(true);
      });
  };

  return (
    <div className="wholeDiv">
      {isErr && <h4 className="errMsg">*Invalid Username or Password</h4>}
      <div className="">
        <h2>CHATBOT</h2>
      </div>
      <div className="outerDiv">
        <div className="loginSignUpDiv">
          <div className="emailDiv">
            <label htmlFor="email">Enter your email:</label>
            <br></br>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Please type your email"
              onChange={handleEmail}
              value={Email}
            ></input>
          </div>
          <div className="passwordDiv">
            <label htmlFor="pwd">Password:</label>
            <br></br>
            <input
              type="password"
              id="pwd"
              name="pwd"
              placeholder="Please type your password"
              onChange={handlePassword}
              value={Password}
            ></input>
          </div>
          <div className="notSiginInBtnDiv">
            <button
              className="btn login"
              onClick={() => {
                checkEmail();
              }}
            >
              Login
            </button>
            <button
              className="btn signUp"
              onClick={() => {
                createUser();
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotSignin;
