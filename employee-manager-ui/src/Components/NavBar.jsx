import React, { Component } from "react";

export default class NavBar extends Component {
  state = {
    welcomeMessage: "Welcome to Employee support",
  };

  render() {
    return (
      <React.Fragment>
        <nav className="navbar bg-transparent navbar-inner navbar-expand-lg navbar-light bg-light static-top mb-5 shadow">
          <div className="container">
            <a className="navbar-brand" href="http://localhost:3000/">
              <h1>{this.state.welcomeMessage}</h1>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                  <a
                    className="nav-link"
                    href="http://127.0.0.1:8000/api/googleSearch/"
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item active">
                  <a
                    className="nav-link"
                    href="http://127.0.0.1:8000/api/googleSearch/"
                  >
                    contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}
