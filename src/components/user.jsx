import React, { Component } from "react";
import axios from "axios";
import UserCat from "./usercat";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Alert } from "react-bootstrap";

import "../css/cats.css";

class Cats extends Component {
  state = {
    allCats: [],
    filteredCats: [],
    cname: "",
    profilepicture: "",
    description: "",
    gender: "Male",
    showAlert: false,
    showErrorAlert: false,
    alertHeading: "",
    alertData: "",
    token: "",
  };

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

  render() {
    return (
      <div>
          <div>
            {this.state.showAlert ? this.showSuccessAlert() : null}

            {this.state.showErrorAlert ? this.showErrorAlert() : null}

            <div className="container container_div">
              <div className="row row_div">
                {this.state.allCats.map((post) => (
                  <div key={post.id} className="col">
                    <UserCat
                      key={post.id}
                      cat={post}
                      onLike={() => this.setLike(post)}
                      onDislike={() => this.setDislike(post)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    );
  }

  async setLike(cat) {
    try {
        console.log(cat);
      await axios.put(`http://localhost:9000/api/user/${cat.id}`, {
        likecount: cat.likecount + 1,
      });
      let allCats = [...this.state.allCats];
      let index = allCats.indexOf(cat);
      allCats[index] = { ...cat };
      allCats[index].likecount++;
      this.setState({ allCats: allCats });
    } 
    catch (err) {
      console.log(err);
    }
  }

  async setDislike(cat) {
    try {
        console.log(cat);
      await axios.put(`http://localhost:9000/api/user/${cat.id}`, {
        likecount: cat.likecount - 1,
      });
      let allCats = [...this.state.allCats];
      let index = allCats.indexOf(cat);
      allCats[index] = { ...cat };
      allCats[index].likecount--;
      this.setState({ allCats: allCats });
    } 
    catch (err) {
      console.log(err);
    }
  }

  async componentDidMount() {
    if (navigator.onLine) {
      try {
        let { data } = await axios.get("http://localhost:9000/api/user");
        let cats = data.map((cat) => {
          return {
            id: cat._id,
            profilepicture: cat.profilepicture,
            likecount: cat.likecount,
            cname: cat.cname,
            description: cat.description,
            gender: cat.gender,
          };
        });
        this.setState({ allCats: cats, token: sessionStorage.getItem("user") });
      } catch (error) {
        this.setState({
          showErrorAlert: true,
          alertHeading: "Failed to fetch records",
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
  }
}

export default Cats;