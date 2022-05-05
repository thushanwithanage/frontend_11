import React, { Component } from "react";
import axios from "axios";

import { Alert } from 'react-bootstrap';
import "../css/signup.css";

class SignUp extends Component {

  state = {
            uname: '',
            mobile: '',
            email : '',
            password: '',
            gender: 'Male',
            token: '',
            showErrorAlert: false,
            alertHeading: '',
            alertData: ''
    };

    showErrorAlert()
  {
    return(
      <Alert variant="danger" onClose={() => this.setState({ showErrorAlert: false })} dismissible><Alert.Heading>{this.state.alertHeading}</Alert.Heading>
       <p> {this.state.alertData}
      </p></Alert>
    )
  }

    goToLoginView = (e) => {
      e.preventDefault();
      window.location.href='/';
    }

  changeHandler = e => {
    this.setState( {[e.target.name] : e.target.value} )
  }

  handleSelect = (e) => {
    this.setState({ gender: e.target.value });
  };

  submitHandler = async (e) => {
    e.preventDefault();
    let user = {
        uname : this.state.uname,
        mobile: this.state.mobile,
        email : this.state.email,
        password: this.state.password,
        gender: this.state.gender
    }

    if(navigator.onLine)
    {
      try
      {
        if(user)
        {
          const {data} = await axios.post(process.env.REACT_APP_AUTH_URL + "signup", user);
          sessionStorage.setItem("user", data.token);
          this.setState({ token: data.token });

          if (data.isAdmin) 
          {
            window.location.href='/home';
          }
          else
          {
            window.location.href='/user'
          }
        }
        else
        {
          this.setState({ showErrorAlert: true, alertHeading:'Failed to get values', alertData:'Failed to get values of the fields'});
        }
      }
      catch(error)
      {
        this.setState({ showErrorAlert: true, alertHeading: "Signup Error", alertData: error.message + " : " + error.response.data });
      }
    }
    else
    {
      this.setState({ showErrorAlert: true, alertHeading: "Network Error", alertData: "Please check your internet connection" });
    }    
  }

  render()
  {
      const {uname, mobile, email, password} = this.state
      return (
        <div>

            {     
                this.state.showErrorAlert ? this.showErrorAlert() : null
            } 

          <div className="main_div">
          <div style={{marginTop:'12%', marginLeft:'5%'}}>
          <h1 className="title">CattyLove</h1>
          <h5>CattyLove helps you adopt or purvey</h5>
          <h5>cats near you</h5>
            </div>
	<div style={{margin: 'auto', marginTop:'4%', width: '30%', textAlign:'center', border:'1px solid silver', borderRadius:'10px',boxShadow: '5px 5px 5px lightgrey'}}>
        <form onSubmit={this.submitHandler}>
            <div>
            <input type="text" name="uname" value={uname} onChange={this.changeHandler} placeholder="Name" style={{ marginTop: '25px', marginBottom: '5px', width: '85%', height:'50px', border:'1px solid silver',borderRadius: '5px', paddingLeft:'20px'}}/> <br/>
            <input type="text" name="mobile" value={mobile} onChange={this.changeHandler} placeholder="Mobile" style={{ marginTop: '5px', marginBottom: '5px', width: '85%', height:'50px', border:'1px solid silver',borderRadius: '5px', paddingLeft:'20px'}}/> <br/>
            </div>
            <div >
                <select name="genderList" onChange={this.handleSelect} style={{ marginTop: '5px', marginBottom: '5px', width: '85%', height:'50px', border:'1px solid silver',borderRadius: '5px', paddingLeft:'20px'}}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                </select>
            </div>
            <div>
            <input type="email" name="email" value={email} onChange={this.changeHandler} placeholder="Email" style={{ marginTop: '5px', marginBottom: '5px', width: '85%', height:'50px', border:'1px solid silver',borderRadius: '5px', paddingLeft:'20px'}}/> <br/>
            <input type="password" name="password" value={password} onChange={this.changeHandler} placeholder="Password" style={{ marginTop: '5px', marginBottom: '5px', width: '85%', height:'50px', border:'1px solid silver',borderRadius: '5px', paddingLeft:'20px'}}/> <br/>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '15px', marginBottom: '10px', width:'85%', height:'50px',borderRadius: '10px', border:'1px solid silver', backgroundColor:'blueviolet' }}>Sign Up</button>
            </form>

            <div style={{align:'center'}}>
            <hr style={{width:'95%', marginLeft:'2.5%'}}/>
        </div>
        
        <p style={{ marginTop: '5px'}}>Already a member?</p>

        <form>
          <button type="submit" className="btn btn-primary" onClick={this.goToLoginView} style={{ marginBottom: '20px', width:'65%', height:'50px',borderRadius: '10px' }}>Sign In</button>
        </form>
    </div>
	</div>

</div>
      )
  }
}

export default SignUp;
