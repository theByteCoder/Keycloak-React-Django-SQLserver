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
      placeholder: "Loading",
      searchButtonClass: "inline btn m-2 btn-",
    };
  }

  handleChange = (e) => {
    this.table.hidden = true;
    if (e.target.value !== "") {
      if (e.target.value === "*" || !isNaN(e.target.value)) {
        this.button.className = this.state.searchButtonClass + "primary";
        this.button.disabled = false;
        this.setState({
          [e.target.name]: e.target.value,
        });
      }
    } else if (isNaN(e.target.value)) {
      this.button.className = this.state.searchButtonClass + "info";
      this.button.disabled = true;
    } else {
      this.button.className = this.state.searchButtonClass + "info";
      this.button.disabled = true;
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const form = {
      empnum: this.state.empnum,
    };
    if (form.empnum === "*") {
      this.componentDidMount("http://127.0.0.1:8000/api/searchEmployee/");
    } else if (!isNaN(form.empnum)) {
      this.componentDidMount(
        `http://127.0.0.1:8000/api/searchEmployee/emp_no=${form.empnum}/`
      );
    }
  };

  componentDidMount(url) {
    fetch(url)
      .then((response) => {
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data !== {}) {
          this.table.hidden = false;
        }
        this.setState(() => {
          return {
            data,
            loaded: true,
          };
        });
      });
  }

  render() {
    return (
      <React.Fragment>
        <form>
          <input
            className="textbox"
            name="empnum"
            size="27"
            ref={(searchTxtbx) => {
              this.searchTxtbx = searchTxtbx;
            }}
            onChange={(e) => this.handleChange(e)}
            placeholder="Enter employee number here"
            autoComplete="off"
          />
          <button
            ref={(button) => (this.button = button)}
            className={this.state.searchButtonClass + "info"}
            onClick={(e) => this.onSubmit(e)}
            disabled={this.state.empnum === " " ? "true" : ""}
          >
            Search
          </button>
          <br />
        </form>
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
                emp_no
              </th>
              <th className="col-cell-text" scope="col">
                first_name
              </th>
              <th className="col-cell-text" scope="col">
                last_name
              </th>
              <th className="col-cell-text" scope="col">
                gender
              </th>
              <th className="col-cell-text" scope="col">
                birth_date
              </th>
              <th className="col-cell-text" scope="col">
                hire_date
              </th>
            </tr>
          </thead>
          {this.state.data.map((response, i) => {
            return (
              <tbody id="employees-table-body" key={i}>
                <tr id={response.emp_no}>
                  <td>
                    <input type="radio" name="radio-button" id="radio-button" />
                  </td>
                  <th scope="row" className="col-cell-text">
                    {response.emp_no}
                  </th>
                  <td className="col-cell-text">
                    {response.first_name}
                    <p>
                      <input type="text" name="first_name" hidden required />
                    </p>
                  </td>
                  <td className="col-cell-text">
                    {response.last_name}
                    <p>
                      <input type="text" name="last_name" hidden required />
                    </p>
                  </td>
                  <td className="col-cell-text">
                    {response.gender}
                    <p>
                      <input type="text" name="gender" hidden required />
                    </p>
                  </td>
                  <td className="col-cell-text">
                    {response.birth_date}
                    <p>
                      <input type="text" name="birth_date" hidden required />
                    </p>
                  </td>
                  <td className="col-cell-text">
                    {response.hire_date}
                    <p>
                      <input type="text" name="hire_date" hidden required />
                    </p>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </React.Fragment>
    );
  }
}
