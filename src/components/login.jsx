import React, { Component } from "react";
import axios from "axios";

import GoogleLogin from "react-google-login";

import { Alert } from "react-bootstrap";

import "../css/login.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
    token: "",
    showErrorAlert: false,
    alertHeading: "",
    alertData: "",
  };

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  goToRegisterView = (e) => {
    e.preventDefault();
    window.location.href = "/signup";
  };

  handleGoogleLogin = async (googleData) => {
    let token = {
      gtoken: googleData.tokenId,
    };
    if (navigator.onLine) {
      try {
        if (token !== null) {
          const { data } = await axios.post(
            process.env.REACT_APP_AUTH_URL + "googleLogin",
            token
          );
          sessionStorage.setItem("user", data.token);
          this.setState({ token: data.token });

          if (data.token !== null) {
            window.location.href = "/user";
          } else {
            this.setState({
              showErrorAlert: true,
              alertHeading: "Google Signin Error",
              alertData: "Google signin failed. Please try again",
            });
          }
        }
      } catch (error) {
        this.setState({
          showErrorAlert: true,
          alertHeading: "Google Signin Error",
          alertData: error.message + " : " + error.response.data,
        });
      }
    } else {
      this.setState({
        showErrorAlert: true,
        alertHeading: "Network Error",
        alertData: "Please check your internet connection",
      });
    }
  };

  handleGoogleFailure = (result) => {
    if (navigator.onLine) {
      this.setState({
        showErrorAlert: true,
        alertHeading: "Google Signin Error",
        alertData: "Failed to signin user with Google",
      });
    }
  };

  showErrorAlert() {
    return (
      <Alert
        variant="danger"
        onClose={() => this.setState({ showErrorAlert: false })}
        dismissible
      >
        <Alert.Heading>{this.state.alertHeading}</Alert.Heading>
        <p> {this.state.alertData}</p>
      </Alert>
    );
  }

  submitHandler = async (e) => {
    e.preventDefault();
    let user = {
      email: this.state.email,
      password: this.state.password,
    };
    if (navigator.onLine) {
      try {
        if (user) {
          const { data } = await axios.post(
            process.env.REACT_APP_AUTH_URL,
            user
          );
          sessionStorage.setItem("user", data.token);
          this.setState({ token: data.token });

          if (data.isAdmin) {
            window.location.href = "/home";
          } else {
            window.location.href = "/user";
          }
        } else {
          this.setState({
            showErrorAlert: true,
            alertHeading: "Failed to get values",
            alertData: "Failed to get values of the fields",
          });
        }
      } 
      
      catch (error) {
        this.setState({
          showErrorAlert: true,
          alertHeading: "Signin Error",
          alertData: error.message + " : " + error.response.data,
        });
      }
    } else {
      this.setState({
        showErrorAlert: true,
        alertHeading: "Network Error",
        alertData: "Please check your internet connection",
      });
    }
  };

  render() {
    const { email, password } = this.state;
    return (
      <div>
        {this.state.showErrorAlert ? this.showErrorAlert() : null}
        <div
          className="main_div"
        >
          <div style={{marginTop:'12%', marginLeft:'5%'}}>
            <h1 className="title">CattyLove</h1>
            <h5>CattyLove helps you adopt or purvey</h5>
            <h5>cats near you</h5>
          </div>
          <div className="form_div">
            <form onSubmit={this.submitHandler}>
              <div>
                <input
                  type="email"
                  name="email"
                  className="email_txt"
                  value={email}
                  onChange={this.changeHandler}
                  placeholder="Email"
                />{" "}
                <br />
                <input
                  type="password"
                  name="password"
                  className="pass_txt"
                  value={password}
                  onChange={this.changeHandler}
                  placeholder="Password"
                />{" "}
                <br />
              </div>
              <button type="submit" className="signin_btn2 btn btn-primary">
                Sign In
              </button>
            </form>

            <div className="forgot_pw_div">
              <a href="/forgot" ><i>Forgot password</i></a>
            </div>
            
            <div>

              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Log in with Google"
                onSuccess={this.handleGoogleLogin}
                onFailure={this.handleGoogleFailure}
                cookiePolicy={"single_host_origin"}
              ></GoogleLogin>
            </div>

            <div className="center_div">
              <hr className="line" />
            </div>

            <p className="sub_txt">New to CattyLove?</p>

            <form>
              <button
                type="submit"
                className="signup_btn2 btn btn-primary"
                onClick={this.goToRegisterView}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
