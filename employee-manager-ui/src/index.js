import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css";
import NavBar from "./Components/NavBar";
import Body from "./Components/Body";
import Form from "./Components/Form";

ReactDOM.render(
  <React.StrictMode>
    <div className="container">
      <NavBar />
      <Body />
      <Form />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
