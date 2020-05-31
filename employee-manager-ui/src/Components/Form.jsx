import React, { Component } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Keycloak from "keycloak-js";
import { KeycloakProvider } from "@react-keycloak/web";

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      BASE_URI: "http://127.0.0.1:8000/api/searchEmployee",
      empnum: " ",
      data: [],
      loaded: false,
      selectedRadio: "",
      placeholder: "Loading",
      buttonClass: "inline btn m-2 btn-",
      toEdit: false,
      editable: "",
      FIRST_NAME: "",
      LAST_NAME: "",
      GENDER: "",
      BIRTH_DATE: "",
      HIRE_DATE: "",
      notified_firstname: false,
      notified_lastname: false,
      notified_gender: false,
      notified_birthdate: false,
      notified_hirdate: false,
      buttonCreate: true,
      buttonEdit: true,
      buttonUpdate: true,
      buttonDelete: true,
      keycloak: null,
      authenticated: false,
    };
  }

  Notify(message) {
    toast(message, {
      position: "top-right",
      autoClose: 2000,
      // autoClose: false,
    });
  }

  handleInputboxChange = (e) => {
    this.table.hidden = true;
    this.editTable.hidden = true;
    this.setState({
      buttonCreate: true,
      buttonEdit: true,
      buttonUpdate: true,
      buttonDelete: true,
    });
    // this.createButton.hidden = true;
    // this.editButton.hidden = true;
    // this.updateButton.hidden = true;
    // this.deleteButton.hidden = true;
    this.setState({
      selectedRadio: "",
      editable: "",
      toEdit: false,
      notified_firstname: false,
      notified_lastname: false,
      notified_gender: false,
      notified_birthdate: false,
      notified_hirdate: false,
    });
    if (e.target.value !== "") {
      if (e.target.value === "*" || !isNaN(e.target.value)) {
        this.searchButton.className = this.state.buttonClass + "primary";
        this.searchButton.disabled = false;
        this.setState({
          [e.target.name]: e.target.value,
        });
      }
    } else if (isNaN(e.target.value)) {
      this.searchButton.className = this.state.buttonClass + "info";
      this.searchButton.disabled = true;
    } else {
      this.searchButton.className = this.state.buttonClass + "info";
      this.searchButton.disabled = true;
    }
  };

  handleRadioButtonChange = (e) => {
    this.setState({
      toEdit: false,
      selectedRadio: e.target.value,
      editable: "",
      notified_firstname: false,
      notified_lastname: false,
      notified_gender: false,
      notified_birthdate: false,
      notified_hirdate: false,
    });
    this.setState({
      buttonEdit: false,
      buttonUpdate: true,
      buttonDelete: false,
    });
    // this.editButton.hidden = false;
    // this.updateButton.hidden = true;
    // this.deleteButton.hidden = false;
  };

  handleFirstNameChange(e) {
    this.setState({ notified_firstname: false, FIRST_NAME: e.target.value });
  }
  handleLastNameChange(e) {
    this.setState({ notified_lastname: false, LAST_NAME: e.target.value });
  }
  handleGenderChange(e) {
    this.setState({ notified_gender: false, GENDER: e.target.value });
  }
  handleBirthdateChange(e) {
    this.setState({ notified_birthdate: false, BIRTH_DATE: e.target.value });
  }
  handleHiredateChange(e) {
    this.setState({ notified_hirdate: false, HIRE_DATE: e.target.value });
  }

  allEditFieldsFilled() {
    let info = {
      emp_no: this.state.selectedRadio,
      first_name: this.state.FIRST_NAME,
      last_name: this.state.LAST_NAME,
      gender: this.state.GENDER,
      birth_date: this.state.BIRTH_DATE,
      hire_date: this.state.HIRE_DATE,
    };
    return JSON.stringify(info);
  }
  allCreateFieldsFilled() {
    let info = {
      emp_no: this.state.empnum,
      first_name: this.state.FIRST_NAME,
      last_name: this.state.LAST_NAME,
      gender: this.state.GENDER,
      birth_date: this.state.BIRTH_DATE,
      hire_date: this.state.HIRE_DATE,
    };
    return JSON.stringify(info);
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.callApi_searchEmployee();
  };

  getSelectedRow() {
    let row_Index = document.querySelector("input[name=radio-button]:checked");
    let columnElem = row_Index.parentElement;
    let rowEleme = columnElem.parentElement;
    return rowEleme;
  }

  onEdit = () => {
    this.setState({
      toEdit: true,
      editable: this.state.selectedRadio,
      buttonEdit: false,
      buttonUpdate: true,
      FIRST_NAME: "",
      LAST_NAME: "",
      GENDER: "",
      BIRTH_DATE: "",
      HIRE_DATE: "",
    });
    // this.Notify("Please update details for selected record");

    this.setState({
      buttonEdit: true,
      buttonUpdate: false,
    });
    // this.editButton.hidden = true;
    // this.updateButton.hidden = false;

    // this.getSelectedRow().removeAttribute("hidden");
  };

  onCreate() {
    let str = "";
    let reqList = [];
    if (this.state.FIRST_NAME === "") {
      reqList.push("First Name");
    }
    if (this.state.LAST_NAME === "") {
      reqList.push("Last Name");
    }
    if (this.state.GENDER === "") {
      reqList.push("Gender");
    }
    if (this.state.BIRTH_DATE === "") {
      reqList.push("Birth Date");
    }
    if (this.state.HIRE_DATE === "") {
      reqList.push("Hire Date");
    }
    if (reqList.length === 0) {
      let info = this.allCreateFieldsFilled();
      this.callApi_updateCreateDeleteRecord(
        `${this.state.BASE_URI}/create/info=${info}/`
      );
      this.setState({
        toEdit: false,
        buttonCreate: true,
      });
    } else {
      if (reqList.length > 1) {
        for (var count = 0; count < reqList.length; count++) {
          str += reqList[count] + ", ";
        }
        str += "are required.";
        str = str.replace(", are required.", " are required.");
        this.Notify(str);
      } else if (reqList.length === 1) {
        str = `${reqList[0]} is required.`;
        this.Notify(str);
      }
      reqList = [];
    }
  }

  onUpdate() {
    let str = "";
    let reqList = [];
    if (this.state.toEdit === true) {
      if (this.state.FIRST_NAME === "") {
        reqList.push("First Name");
      }
      if (this.state.LAST_NAME === "") {
        reqList.push("Last Name");
      }
      if (this.state.GENDER === "") {
        reqList.push("Gender");
      }
      if (this.state.BIRTH_DATE === "") {
        reqList.push("Birth Date");
      }
      if (this.state.HIRE_DATE === "") {
        reqList.push("Hire Date");
      }
      if (reqList.length === 0) {
        let info = this.allEditFieldsFilled();
        this.callApi_updateCreateDeleteRecord(
          `${this.state.BASE_URI}/update/info=${info}/`
        );
        this.setState({
          toEdit: false,
        });
      } else {
        if (reqList.length > 1) {
          for (var count = 0; count < reqList.length; count++) {
            str += reqList[count] + ", ";
          }
          str += "are required.";
          str = str.replace(", are required.", " are required.");
          this.Notify(str);
        } else if (reqList.length === 1) {
          str = `${reqList[0]} is required.`;
          this.Notify(str);
        }
        reqList = [];
      }
    }
  }

  onDelete() {
    this.callApi_updateCreateDeleteRecord(
      `${this.state.BASE_URI}/delete/emp_no=${this.state.selectedRadio}/`
    );
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  componentDidMount() {
    const keycloak = Keycloak("/keycloak.json");
    keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
      this.setState({ keycloak: keycloak, authenticated: authenticated });
    });
  }

  callApi_searchEmployee() {
    let url = "";
    if (this.state.empnum === "*") url = `${this.state.BASE_URI}/`;
    else if (!isNaN(this.state.empnum))
      url = `${this.state.BASE_URI}/emp_no=${this.state.empnum}/`;
    fetch(url)
      .then((response) => {
        if (response.status > 400) {
          return this.setState(() => {
            this.Notify("Something went wrong!");
            return { placeholder: "Something went wrong!" };
          });
        }
        // if (response["type"] === "cors") {
        return response.json();
        // }
      })
      .then((data) => {
        // if (data !== undefined) {
        if (this.isEmpty(data)) {
          this.setState({
            buttonCreate: false,
          });
          this.editTable.hidden = false;
          // this.createButton.hidden = false;
          this.Notify("Record is not available. Please create new record.");
        } else {
          this.table.hidden = false;
        }
        this.setState(() => {
          return {
            data,
            loaded: true,
          };
        });
        // }
      });
  }

  callApi_updateCreateDeleteRecord(url) {
    fetch(url)
      .then((response) => {
        if (response.status > 400) {
          return this.setState(() => {
            this.Notify("Something went wrong!");
            return { placeholder: "Something went wrong!" };
          });
        }
        // if (response["type"] === "cors") {
        return response.json();
        // }
      })
      .then((response) => {
        // if (data !== undefined) {
        if (!this.isEmpty(response)) {
          if (response["response"] === "201 Created") {
            this.editTable.hidden = true;
            this.Notify(
              `New record for Employee ID ${this.state.empnum} created successfully.`
            );
          } else if (response["response"] === "204 Deleted") {
            this.Notify(
              `Record for Employee ID ${this.state.selectedRadio} deleted successfully.`
            );
            this.setState({ empnum: "*" });
          } else if (response["response"] === "404 Not Found") {
            this.Notify(
              `Record for Employee ID ${this.state.selectedRadio} not found.`
            );
            this.setState({ empnum: "*" });
          } else if (response["response"] === "201 Updated") {
            this.Notify(
              `Record for Employee ID ${this.state.selectedRadio} updated successfully.`
            );
            this.setState({ empnum: this.state.selectedRadio });
          }
          this.setState({
            toEdit: false,
            selectedRadio: "",
            editable: "",
            buttonUpdate: true,
            buttonEdit: true,
            buttonDelete: true,
            // empnum: "*",
          });
          this.callApi_searchEmployee();
          this.searchTxtbx.value = "";
          this.setState({ empnum: " " });
        }
        // }
      });
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <form>
          <input
            className="textbox"
            name="empnum"
            size="27"
            ref={(searchTxtbx) => {
              this.searchTxtbx = searchTxtbx;
            }}
            onChange={(e) => this.handleInputboxChange(e)}
            placeholder="Enter employee number here"
            autoComplete="off"
          />
          <button
            type="submit"
            ref={(searchButton) => (this.searchButton = searchButton)}
            className={this.state.buttonClass + "info"}
            onClick={(e) => this.onSubmit(e)}
            disabled={this.state.empnum === " " ? true : false}
          >
            Search
          </button>
          <button
            type="button"
            ref={(createButton) => (this.createButton = createButton)}
            className={this.state.buttonClass + "info"}
            onClick={this.onCreate.bind(this)}
            // hidden
            hidden={this.state.buttonCreate === true ? true : false}
          >
            Create
          </button>
          <button
            type="button"
            ref={(editButton) => (this.editButton = editButton)}
            className={this.state.buttonClass + "info"}
            onClick={this.onEdit.bind(this)}
            // hidden
            hidden={this.state.buttonEdit === true ? true : false}
          >
            Edit
          </button>
          <button
            type="button"
            ref={(updateButton) => (this.updateButton = updateButton)}
            className={this.state.buttonClass + "info"}
            onClick={this.onUpdate.bind(this)}
            // hidden
            hidden={this.state.buttonUpdate === true ? true : false}
          >
            Update
          </button>
          <button
            type="button"
            ref={(deleteButton) => (this.deleteButton = deleteButton)}
            className={this.state.buttonClass + "danger"}
            onClick={this.onDelete.bind(this)}
            // hidden
            hidden={this.state.buttonDelete === true ? true : false}
          >
            Delete
          </button>
          <br />
        </form>
        <table
          ref={(editTable) => {
            this.editTable = editTable;
          }}
          className="table table-hover"
          id="editTable"
          hidden
        >
          <thead>
            <tr>
              <th className="col-cell-text" scope="col">
                ID
              </th>
              <th className="col-cell-text" scope="col">
                First Name
              </th>
              <th className="col-cell-text" scope="col">
                Last Name
              </th>
              <th className="col-cell-text" scope="col">
                Gender
              </th>
              <th className="col-cell-text" scope="col">
                Birth Date
              </th>
              <th className="col-cell-text" scope="col">
                Hire Date
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  value={this.state.empnum}
                  name="emp_no"
                  disabled
                />
              </td>
              <td>
                <input
                  type="text"
                  name="first_name"
                  onChange={(e) => this.handleFirstNameChange(e)}
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  name="last_name"
                  onChange={(e) => this.handleLastNameChange(e)}
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  name="gender"
                  onChange={(e) => this.handleGenderChange(e)}
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  name="birth_date"
                  onChange={(e) => this.handleBirthdateChange(e)}
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  name="hire_date"
                  onChange={(e) => this.handleHiredateChange(e)}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
        <table
          ref={(table) => {
            this.table = table;
          }}
          className="table table-hover"
          id="table"
          hidden
        >
          <thead>
            <tr>
              <th className="col-cell-text" scope="col">
                Select
              </th>
              <th className="col-cell-text" scope="col">
                ID
              </th>
              <th className="col-cell-text" scope="col">
                First Name
              </th>
              <th className="col-cell-text" scope="col">
                Last Name
              </th>
              <th className="col-cell-text" scope="col">
                Gender
              </th>
              <th className="col-cell-text" scope="col">
                Birth Date
              </th>
              <th className="col-cell-text" scope="col">
                Hire Date
              </th>
            </tr>
          </thead>
          <tbody id="employees-table-body">
            {this.state.data.map((response) => {
              return (
                <tr key={response.emp_no}>
                  <td>
                    <input
                      type="radio"
                      name="radio-button"
                      value={response.emp_no}
                      onChange={(e) => {
                        this.handleRadioButtonChange(e);
                      }}
                      checked={
                        this.state.selectedRadio === String(response.emp_no)
                      }
                    />
                  </td>
                  <th scope="row" className="col-cell-text">
                    {response.emp_no}
                  </th>
                  <td className="col-cell-text">
                    {response.first_name}
                    <p>
                      <input
                        type="text"
                        name="first_name"
                        onChange={(e) => this.handleFirstNameChange(e)}
                        hidden={
                          this.state.editable === String(response.emp_no)
                            ? false
                            : true
                        }
                        required
                      />
                    </p>
                  </td>
                  <td className="col-cell-text">
                    {response.last_name}
                    <p>
                      <input
                        type="text"
                        name="last_name"
                        onChange={(e) => this.handleLastNameChange(e)}
                        hidden={
                          this.state.editable === String(response.emp_no)
                            ? false
                            : true
                        }
                        required
                      />
                    </p>
                  </td>
                  <td className="col-cell-text">
                    {response.gender}
                    <p>
                      <input
                        type="text"
                        name="gender"
                        onChange={(e) => this.handleGenderChange(e)}
                        hidden={
                          this.state.editable === String(response.emp_no)
                            ? false
                            : true
                        }
                        required
                      />
                    </p>
                  </td>
                  <td className="col-cell-text">
                    {response.birth_date}
                    <p>
                      <input
                        type="text"
                        name="birth_date"
                        onChange={(e) => this.handleBirthdateChange(e)}
                        hidden={
                          this.state.editable === String(response.emp_no)
                            ? false
                            : true
                        }
                        required
                      />
                    </p>
                  </td>
                  <td className="col-cell-text">
                    {response.hire_date}
                    <p>
                      <input
                        type="text"
                        name="hire_date"
                        onChange={(e) => this.handleHiredateChange(e)}
                        hidden={
                          this.state.editable === String(response.emp_no)
                            ? false
                            : true
                        }
                        required
                      />
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}
