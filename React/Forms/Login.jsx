import React, { Component } from "react";
import { Link } from "react-router-dom";
import userService from "services/userService";
import Swal from "sweetalert2";
import { toast } from "../checkout/Code/node_modules/react-toastify";
import Button from "components/Button";
import {
  GoogleOutlined,
  GithubOutlined,
  FacebookOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";

import {
  InputGroup,
  Form,
  FormGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
} from "reactstrap";

class Login extends Component {
  state = {
    email: "",
    password: "",
    tenantId: "U012XP7DF1B",
    isLoggedIn: false,
  };

  handleUserChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  onLoginSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Login Success!",
      text: "You will be directed to the home page",
      timer: 3000,
      showConfirmButton: false,
    });

    this.props.setIsLoggedIn(true);
    setTimeout(() => {
      this.props.history.push("/home");
    }, 3000);
  };

  onLoginError = (error) => {
    console.log(error);
    toast.error(`Login failiure  ${error}`, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };


  submitClickhandler = (e) => {
    e.preventDefault();
    let data = this.state;
    userService.login(data).then(this.onLoginSuccess).catch(this.onLoginError);
    console.log(this.state);
  };

  render() {
    return (
      <div className="form-wrapper">
        <div className="form-group-container">
          <div className="form-container">
            <div className="form-header">
              <h4>Sign in with</h4>
            </div>
            <div className="form-button-group">
              <Button className="form-button" onClick={this.buttonClickHandler}>
                <GoogleOutlined id="google-icon" className="form-icon" />
                Google
              </Button>
              <Button className="form-button" onClick={this.buttonClickHandler}>
                <GithubOutlined id="github-icon" className="form-icon" />
                Github
              </Button>
              <Button className="form-button" onClick={this.buttonClickHandler}>
                <FacebookOutlined id="fb-icon" className="form-icon" />
                Facebook
              </Button>
            </div>
            <div>
              <h6 className="form-sub-header">or sign in with credentials</h6>
            </div>
            <Form name="basic" className="user-form-group">
              <FormGroup className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="form-icons-group">
                      <MailOutlined />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleUserChange}
                    className="form-control"
                    placeholder="Email"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup className="form-group">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="form-icons-group">
                      <LockOutlined />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleUserChange}
                    className="form-control"
                    placeholder="Password"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup className="form-group" style={{ display: "none" }}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="form-icons-group">
                      <MailOutlined />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="text"
                    name="tenantId"
                    value={this.state.tenantId}
                    onChange={this.handleUserChange}
                    className="form-control"
                    placeholder="Tenant ID"
                  />
                </InputGroup>
              </FormGroup>
              <div className="submit-button-container">
                <FormGroup>
                  <Button
                    className="form-button submit"
                    id="form-submit"
                    onClick={this.submitClickhandler}
                  >
                    Submit
                  </Button>
                </FormGroup>
              </div>
            </Form>
            <div className="form-link-container">
              <div className="form-link-group">
                <div>
                  <Link
                    className="links-global"
                    to="/"
                    onClick={this.testclick}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Link className="links-global" to="/signup">
                    Don't have an account?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
