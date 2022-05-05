import React, { Component } from "react";
import axios from "axios";
import Cat from "./cat";

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
    cid2: "",
    cname2: "",
    description2: "",
    gender2: "",
    search: "",
    profilepicture2: "",
    showAlert: false,
    showErrorAlert: false,
    alertHeading: "",
    alertData: "",
    token: "",
  };

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  setDelete = (catId) => {
    confirmAlert({
      title: "Confirmation Dialog",
      message: "Are you sure to delete the record?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.deleteCat(catId),
        },
        {
          label: "No",
        },
      ],
    });
  };

  handleDelete = () => {
    confirmAlert({
      title: "Confirmation Dialog",
      message: "Are you sure to delete the record?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.deleteCat(this.state.cid2),
        },
        {
          label: "No",
        },
      ],
    });
  };

  handleUpdate = () => {
    confirmAlert({
      title: "Confirmation Dialog",
      message: "Are you sure to update the record?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.updateCat(this.state.cid2),
        },
        {
          label: "No",
        },
      ],
    });
  };

  submitHandler = async (e) => {
    e.preventDefault();
    let cat = {
      profilepicture: this.state.profilepicture,
      cname: this.state.cname,
      description: this.state.description,
      gender: this.state.gender,
      likecount: 0,
    };

    if (navigator.onLine) {
      try {
        if (cat) {
          cat = await axios.post(process.env.REACT_APP_AD_URL, cat, {
            headers: {
              "x-jwt-token": sessionStorage.getItem("user"),
            },
          });

          if (cat.data._id != null) {
            cat.data.id = cat.data._id;
            let allCats = [...this.state.allCats];
            let index = allCats.length;
            allCats[index] = { ...cat.data };
            this.setState({
              allCats: allCats,
              cname: "",
              description: "",
              profilepicture: "",
              showAlert: true,
              alertHeading: "Record inserted",
              alertData:
                "The record has been successfully inserted to the database",
            });
          } else {
            this.setState({
              showErrorAlert: true,
              alertHeading: "Failed to insert record",
              alertData: "Failed to insert the record to the database",
            });
          }
        } else {
          this.setState({
            showErrorAlert: true,
            alertHeading: "Failed to get values",
            alertData: "Failed to get values of the fields",
          });
        }
      } catch (error) {
        this.setState({
          showErrorAlert: true,
          alertHeading: "Insert Error",
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

  handleSelect = (e) => {
    this.setState({ gender: e.target.value });
  };

  handleLogout = (e) => {
    sessionStorage.setItem("user", null);
    window.location.href = "/";
  };

  searchHandler = async (e) => {
    e.preventDefault();
    this.setState({
      cname2: "",
      description2: "",
      gender2: "",
      profilepicture2: "",
    });

    if (navigator.onLine) {
      try {
        let { data } = await axios.get(
          process.env.REACT_APP_AD_URL + "cat?cname=" + this.state.search,
          {
            headers: {
              "x-jwt-token": sessionStorage.getItem("user"),
            },
          }
        );
        if (data[0] != null) {
          this.setState({
            cid2: data[0]._id,
            cname2: data[0].cname,
            description2: data[0].description,
            gender2: data[0].gender,
            profilepicture2: data[0].profilepicture,
          });
        } else {
          this.setState({
            cid2: "",
            cname2: "No data avaiable",
            description2: "No data avaiable",
            gender2: "",
            profilepicture2: "",
          });
        }
      } catch (error) {
        this.setState({
          showErrorAlert: true,
          alertHeading: "Search Error",
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
    const {
      cname,
      description,
      profilepicture,
      cname2,
      gender2,
      description2,
      profilepicture2,
      search,
      token,
    } = this.state;
    return (
      <div>
        {token && (
          <div>
            {this.state.showAlert ? this.showSuccessAlert() : null}

            {this.state.showErrorAlert ? this.showErrorAlert() : null}

            <div className="" onClick={this.handleLogout}>
              <button type="submit" className="btn btn-primary logout_btn" onClick={this.handleLogout}>
                Logout
              </button>
            </div>

            <div className="main_div">
              <div className="sub_div">
                <h3 className="title">Insert Cat Details</h3>
                <form onSubmit={this.submitHandler}>
                  <div>
                    <input
                      type="text"
                      name="cname"
                      value={cname}
                      onChange={this.changeHandler}
                      placeholder="Name"
                      className="top_txt"
                    />
                    <br />
                    <input
                      type="text"
                      name="description"
                      value={description}
                      onChange={this.changeHandler}
                      placeholder="Description"
                      className="middle_txt"
                    />
                    <br />
                  </div>
                  <div>
                    <select
                      name="genderList"
                      onChange={this.handleSelect}
                      className="list"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    name="profilepicture"
                    value={profilepicture}
                    onChange={this.changeHandler}
                    placeholder="Picture link"
                    className="middle_txt"
                  />
                  <br />
                  <button
                    type="submit"
                    className="save_btn btn btn-primary"
                  >
                    Save
                  </button>
                </form>
              </div>

              <div className="sub_div">
                <h3 className="title">Search by Cat name</h3>
                <form onSubmit={this.searchHandler}>
                  <div>
                    <input
                      type="text"
                      name="search"
                      value={search}
                      onChange={this.changeHandler}
                      placeholder="Name"
                      className="search_txt"
                    />
                    <button
                      type="submit"
                      className="btn btn-secondary search_btn"
                    >
                      Search
                    </button>
                  </div>
                </form>

                <div style={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>
                  <div style={{margin: 'auto', marginTop:'2%', width: '60%'}}>
                    <input
                      type="text"
                      name="cname2"
                      onChange={this.changeHandler}
                      value={cname2}
                      placeholder="Name"
                      className="middle_txt"
                    />
                    <br />
                    <input
                      type="text"
                      name="description2"
                      onChange={this.changeHandler}
                      value={description2}
                      placeholder="Description"
                      className="middle_txt"
                    />{" "}
                    <br />
                    <input
                      readOnly
                      type="text"
                      name="gender2"
                      onChange={this.changeHandler}
                      value={gender2}
                      placeholder="Gender"
                      className="middle_txt"
                    />{" "}
                    <br />
                  </div>
                  <div style={{margin: 'auto', marginTop:'2%', width: '30%'}}>
                    {profilepicture2 && (
                      <img
                        src={profilepicture2}
                        className="card-img-top cat_picture"
                        alt="cat"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn btn-warning update_btn"
                    onClick={this.handleUpdate}
                  >
                    Update
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger delete_btn"
                    onClick={this.handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="container container_div">
              <div className="row row_div">
                {this.state.allCats.map((post) => (
                  <div key={post.id} className="col">
                    <Cat
                      key={post.id}
                      cat={post}
                      onDelete={() => this.setDelete(post.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  async deleteCat(catId) {
    if (navigator.onLine) {
      try {
        let result = await axios.delete(process.env.REACT_APP_AD_URL + catId, {
          headers: {
            "x-jwt-token": sessionStorage.getItem("user"),
          },
        });

        if (result.status === 200) {
          let updatedCatArray = this.state.allCats.filter(
            (cat) => cat.id !== catId
          );
          this.setState({
            allCats: updatedCatArray,
            showAlert: true,
            alertHeading: "Record deleted",
            alertData:
              "The record has been successfully deleted from the database",
            cid2: "",
            cname2: "",
            description2: "",
            gender2: "",
            search: "",
            profilepicture2: "",
          });
        } else {
          this.setState({
            showErrorAlert: true,
            alertHeading: "Failed to delete record",
            alertData:
              "Failed to delete the record from the database " + result.status,
          });
        }
      } catch (error) {
        this.setState({
          showErrorAlert: true,
          alertHeading: "Failed to delete record",
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

  async updateCat(catId) {
    let cat = {
      cname: this.state.cname2,
      description: this.state.description2,
    };

    if (navigator.onLine) {
      try {
        if (cat) {
          let result = await axios.put(
            process.env.REACT_APP_AD_URL + catId,
            cat,
            {
              headers: {
                "x-jwt-token": sessionStorage.getItem("user"),
              },
            }
          );

          if (result.status === 200) {
            let allCats = [...this.state.allCats];

            let rec = this.state.allCats.filter((cat) => cat.id === catId);

            let index = allCats.indexOf(rec[0]);
            result.data.id = result.data._id;
            allCats[index] = { ...result.data };

            this.setState({
              allCats: allCats,
              showAlert: true,
              alertHeading: "Record updated",
              alertData:
                "The record has been successfully updated from the database",
              cid2: "",
              cname2: "",
              description2: "",
              gender2: "",
              search: "",
              profilepicture2: "",
            });
          } else {
            this.setState({
              showErrorAlert: true,
              alertHeading: "Failed to update record",
              alertData:
                "Failed to update the record from the database " +
                result.status,
            });
          }
        } else {
          this.setState({
            showErrorAlert: true,
            alertHeading: "Failed to get values",
            alertData: "Failed to get values of the fields",
          });
        }
      } catch (error) {
        this.setState({
          showErrorAlert: true,
          alertHeading: "Failed to update record",
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

  async componentDidMount() {
    if (navigator.onLine) {
      try {
        let { data } = await axios.get(process.env.REACT_APP_AD_URL, {
          headers: {
            "x-jwt-token": sessionStorage.getItem("user"),
          },
        });
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