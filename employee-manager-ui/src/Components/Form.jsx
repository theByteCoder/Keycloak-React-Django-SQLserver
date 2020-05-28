import React, { Component } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empnum: " ",
      data: [],
      loaded: false,
      selectedRadio: "",
      placeholder: "Loading",
      buttonClass: "inline btn m-2 btn-",
      editable: "",
    };
  }

  Notify(message) {
    toast(message, {
      position: "top-right",
      autoClose: 5000,
      // autoClose: false,
    });
  }

  handleInputboxChange = (e) => {
    this.table.hidden = true;
    this.editTable.hidden = true;
    this.createButton.hidden = true;
    this.editButton.hidden = true;
    this.updateButton.hidden = true;
    this.deleteButton.hidden = true;
    this.setState({ selectedRadio: "", editable: "" });
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
    this.setState({ selectedRadio: e.target.value, editable: "" });
    this.editButton.hidden = false;
    this.updateButton.hidden = true;
    this.deleteButton.hidden = false;
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.callApi();
  };

  getSelectedRow() {
    let row_Index = document.querySelector("input[name=radio-button]:checked");
    let columnElem = row_Index.parentElement;
    let rowEleme = columnElem.parentElement;
    return rowEleme;
  }

  onEdit = () => {
    this.setState({ editable: this.state.selectedRadio });
    this.Notify("Please update details for selected record");
    this.editButton.hidden = true;
    this.updateButton.hidden = false;
    // this.getSelectedRow().removeAttribute("hidden");
  };

  onUpdate = () => {};

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  componentDidMount() {}

  callApi() {
    let url = "";
    if (this.state.empnum === "*")
      url = "http://127.0.0.1:8000/api/searchEmployee/";
    else if (!isNaN(this.state.empnum))
      url = `http://127.0.0.1:8000/api/searchEmployee/emp_no=${this.state.empnum}/`;
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
          this.editTable.hidden = false;
          this.createButton.hidden = false;
          this.Notify("Record(s) not available. Please create new record.");
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
            hidden
          >
            Create
          </button>
          <button
            type="button"
            ref={(editButton) => (this.editButton = editButton)}
            className={this.state.buttonClass + "info"}
            onClick={this.onEdit.bind(this)}
            hidden
          >
            Edit
          </button>
          <button
            type="button"
            ref={(updateButton) => (this.updateButton = updateButton)}
            className={this.state.buttonClass + "info"}
            onClick={this.onUpdate()}
            hidden
          >
            Update
          </button>
          <button
            type="button"
            ref={(deleteButton) => (this.deleteButton = deleteButton)}
            className={this.state.buttonClass + "danger"}
            hidden
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
                  name="first_name"
                  disabled
                />
              </td>
              <td>
                <input type="text" name="first_name" required />
              </td>
              <td>
                <input type="text" name="last_name" required />
              </td>
              <td>
                <input type="text" name="gender" required />
              </td>
              <td>
                <input type="text" name="birth_date" required />
              </td>
              <td>
                <input type="text" name="hire_date" required />
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
                        ref={(inputDetails) => {
                          this.inputDetails = inputDetails;
                        }}
                        type="text"
                        name="last_name"
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
