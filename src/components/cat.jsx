import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';

class Cat extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div className="card" style={{ width: "12rem", borderRadius:'10px' }}>
          <img src={this.props.cat.profilepicture} className="card-img-top" height={200} alt="cat"/>
          <div className="card-body">
            <h5 className="card-title" style={{ color: "blueviolet", textAlign:'center' }}>{this.props.cat.cname}</h5>
            <h5 className="card-title">{this.props.cat.description}</h5>
              Likes {this.props.cat.likecount} <br/>
            <button style={{ marginTop: "10px" }} className="btn btn-danger" 
            onClick={ this.props.onDelete }>
              Delete
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Cat;
