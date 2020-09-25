import React, { Component } from "react";
import ToDoItem from "./ToDoItem";
import { v4 as uuid } from "uuid";
import "./ToDoList.css";

class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      name: "",
      filter: "all",
      message: "",
      error: "",
      isListening: false,
    };
    this.remove = this.remove.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.add = this.add.bind(this);
    this.handleMicInput = this.handleMicInput.bind(this);
    this.done = this.done.bind(this);
  }
  componentDidMount() {
    const initialItems = JSON.parse(window.localStorage.getItem("items"));
    this.setState({
      items: initialItems,
    });
  }

  // Removing a ToDoItem
  remove(id) {
    this.setState(
      {
        items: this.state.items.filter((item) => item.id !== id),
      },
      () => {
        let updatedItems = [...this.state.items];
        window.localStorage.setItem("items", JSON.stringify(updatedItems));
      }
    );
  }

  // Marking as completed
  done(id) {
    const items = this.state.items.map((item) => {
      if (item.id === id) {
        item.status = !item.status;
        return item;
      }
      return item;
    });
    this.setState({ items: items }, () => {
      let updatedItems = [...this.state.items];
      window.localStorage.setItem("items", JSON.stringify(updatedItems));
    });
  }
  // Adding a ToDoItem
  add() {
    const newItem = {
      id: uuid(),
      value: this.state.name,
      status: false,
    };

    if (this.state.items)
      this.setState(
        {
          items: [...this.state.items, newItem],
        },
        () => {
          let updatedItems = [...this.state.items];
          window.localStorage.setItem("items", JSON.stringify(updatedItems));
        }
      );
    else this.setState({ items: [newItem] });
  }

  //Handling Submit

  handleSubmit(e) {
    e.preventDefault();

    // Adding a to-do only if it is valid
    if (this.state.name) {
      this.add();
      this.setState({ error: "" });
    } else {
      this.setState({ error: "Please Enter Valid ToDo" });
    }
    //Resetting the input field
    this.setState({ name: "" });
  }
  //Filtering
  filter = () => {
    let list;
    switch (this.state.filter) {
      case "completed":
        list = this.state.items.filter((item) => item.status === true);
        break;
      case "incompleted":
        list = this.state.items.filter((item) => item.status === false);
        break;
      case "all":
        list = this.state.items;
        break;
      default:
        list = [];
    }

    return list;
  };

  //Handling change in the form

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  //Handling Micro Phone Input
  handleMicInput() {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const Recognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new Recognition();
      recognition.start();
      recognition.onstart = () => {
        console.log("Recognition Started");
        this.setState({
          message: "Started Listening....",
          error: "",
          isListening: true,
        });
      };
      recognition.onresult = (e) => {
        console.log("Result Event ", e);
        const result = e.results[0][0].transcript;
        this.setState(
          {
            name: result,
            isListening: false,
            message: "",
            error: "",
          },
          () => {
            document.getElementById("add").click();
            this.setState({ name: result });
          }
        );
      };
      recognition.onerror = (e) => {
        console.log("Error Event", e);
        this.setState({ message: "" }, () => {
          if (e.error === "no-speech")
            this.setState({ error: "No Speech Detected" });
          else this.setState({ error: "Something Went Wrong" });
        });
      };
      recognition.onend = (e) => {
        console.log("Recognition has Ended");
        this.setState({ message: "", isListening: false });
        if (!this.state.name)
          this.setState({
            error: "Something went Wrong , Try Again",
          });
        this.setState({ name: "" });
      };
    }
  }

  //Rendering

  render() {
    const filteredList = this.filter();
    const list = filteredList.map((item) => (
      <ToDoItem
        key={item.id}
        id={item.id}
        status={item.status}
        remove={this.remove}
        done={this.done}
        name={item.value}
      />
    ));

    return (
      <div className="ToDoList p-3">
        <form
          id="form"
          className="text-center row mx-auto d-flex justify-space-around align-items-center p-1"
          onSubmit={this.handleSubmit}
        >
          <h1 className="text-center my-5 my-lg-3 mx-auto title w-100">
            Interactive To-Do App
          </h1>
          {/* Messages */}
          {this.state.message && (
            <div className="messages row my-3 mx-auto">
              <div className="col alert alert-success mx-auto my-auto">
                <h6 className="my-auto">{this.state.message}</h6>
              </div>
            </div>
          )}
          {/* Errors */}
          {this.state.error && (
            <div className="errors row my-3 mx-auto">
              <div className="col alert alert-danger mx-auto my-auto">
                <h6 className="my-auto">{this.state.error}</h6>
              </div>
            </div>
          )}

          {!list.length && this.state.filter !== "all" && (
            <div className="errors row my-3 mx-auto">
              <div className="col alert alert-success mx-auto my-auto">
                <h6 className="my-auto">This List is Empty</h6>
              </div>
            </div>
          )}
          {/* End of Errors */}

          <div className="row w-100 d-flex align-items-center justify-content-between mx-auto">
            <div className="col-12 col-lg-9">
              <div className="row mx-auto">
                <button
                  id="mic"
                  onClick={this.handleMicInput}
                  type="button"
                  className={`btn btn-sm-primary col ${
                    this.state.isListening ? "listen" : ""
                  }`}
                >
                  <i className="fa fa-microphone"></i>
                </button>
                <input
                  name="name"
                  className="col-8 col-sm-9 col-lg-10 col-xl-10"
                  placeholder="Enter a ToDo"
                  onChange={this.handleChange}
                  id="name"
                  type="text"
                  value={this.state.name}
                />
                <button id="add" className="col col-lg btn btn-sm-primary">
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>

            <div className="col-lg mx-auto pl-0 select-container my-4">
              <select
                name="filter"
                className="ml-auto"
                onChange={this.handleChange}
                value={this.state.filter}
                id="filter"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="incompleted">Incompleted</option>
              </select>
            </div>
          </div>
        </form>
        {list}
      </div>
    );
  }
}

export default ToDoList;
