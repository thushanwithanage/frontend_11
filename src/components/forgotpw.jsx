import React, { Component } from "react";
import axios from "axios";

import { Alert } from "react-bootstrap";

import "../css/forgotpw.css";

class ForgotPW extends Component {
  state = {
    email: "",
    password: "",
    usercode: "",
    orgcode: "",
    codeRequested: false,
    codeVerified: false,
    passUpdated: false,
    userId: "",
    showErrorAlert: false,
    showAlert: false,
    alertHeading: "",
    alertData: "",
  };

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  sendCode = async (e) => {
    e.preventDefault();
    let mail = {
      email: this.state.email,
    };

    if (navigator.onLine) {
      try {
        const { data } = await axios.post(
          process.env.REACT_APP_AUTH_URL + "forgotpw",
          mail
        );
        if (data.vcode !== null) {
          this.setState({
            orgcode: data.vcode,
            userId: data.userId,
            codeRequested: true,
          });
        } else {
          this.setState({
            showErrorAlert: true,
            alertHeading: "Error",
            alertData: "Failed to get a verification code",
          });
        }
      } catch (error) {
        this.setState({
          showErrorAlert: true,
          alertHeading: "Error",
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

  verifyCode = async (e) => {
    e.preventDefault();
    if (this.state.orgcode == this.state.usercode) {
      this.setState({ codeVerified: true });
    } else {
      this.setState({
        showErrorAlert: true,
        alertHeading: "Invalid Verification Code",
        alertData:
          "The entered verification code is incorrect. Please try again",
      });
    }
  };

  updatePassword = async (e) => {
    e.preventDefault();
    let user = {
      password: this.state.password,
    };

    if (navigator.onLine) {
      try {
        let result = await axios.put(
          process.env.REACT_APP_AUTH_URL + "reset/" + this.state.userId,
          user
        );

        if (result.status === 200) {
          this.setState({
            password: "",
            showAlert: true,
            alertHeading: "Password updated",
            alertData: "Password has been successfully updated. Please login to continue",
            passUpdated: true,
          });
        } else {
          this.setState({
            showErrorAlert: true,
            alertHeading: "Failed to update password",
            alertData:
              "Failed to update the password in the database " + result.status,
          });
        }
      } catch (error) {
        this.setState({
          showErrorAlert: true,
          alertHeading: "Failed to update password",
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

  showSuccessAlert() {
    return (
      <Alert
        variant="success"
        onClose={() => this.setState({ showAlert: false })}
        dismissible
      >
        <Alert.Heading>{this.state.alertHeading}</Alert.Heading>
        <p> {this.state.alertData}</p>
      </Alert>
    );
  }

  render() {
    const { email, password, usercode, codeRequested, codeVerified } =
      this.state;
    return (
      <div>
        {this.state.showAlert ? this.showSuccessAlert() : null}

        {this.state.showErrorAlert ? this.showErrorAlert() : null}        

        <div className="main_div">
          <div className="sub_div">
            {!codeRequested && !codeVerified && (
              <div>
                <div>
                  <h3 className="title">Find Your Account</h3>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    className="input_txt"
                    onChange={this.changeHandler}
                    placeholder="Email"
                  />{" "}
                  <br />
                </div>
                <button
                  type="submit"
                  className="submit_btn btn btn-primary"
                  onClick={this.sendCode}
                >
                  Send Reset Link
                </button>
              </div>
            )}

            {codeRequested && !codeVerified && (
              <div>
                <h4 className="title">Enter Password Reset Code</h4>
                <input
                  type="email"
                  name="usercode"
                  value={usercode}
                  className="input_txt"
                  onChange={this.changeHandler}
                  placeholder="Code"
                />{" "}
                <br />
                <button
                  type="submit"
                  className="submit_btn btn btn-primary"
                  onClick={this.verifyCode}
                >
                  Validate Code
                </button>
              </div>
            )}

            {codeRequested && codeVerified && (
              <div>
                <h4 className="title">Enter New Password</h4>
                <input
                  type="password"
                  name="password"
                  value={password}
                  className="input_txt"
                  onChange={this.changeHandler}
                  placeholder="New Password"
                />
                <br />
                <button
                  type="submit"
                  className="submit_btn btn btn-primary"
                  onClick={this.updatePassword}
                >
                  Update Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ForgotPW;