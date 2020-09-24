import React, { Component } from "react";
import "./ToDoItem.css";
//import gsap from "gsap";

class ToDoItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className={`ToDoItem row my-4 mx-auto ${
          this.props.status ? "done" : ""
        }`}
      >
        <h5 className="d-flex justify-content-start align-items-center h-100 col-7 col-lg-10 text-truncate">
          {this.props.name}
        </h5>

        <button
          className="tick btn btn-sm-primary col"
          onClick={() => this.props.done(this.props.id)}
        >
          <i className="fa fa-check"></i>
        </button>
        <button
          className="trash btn btn-sm-primary col"
          onClick={() => this.props.remove(this.props.id)}
        >
          <i className="fa fa-trash"></i>
        </button>
      </div>
    );
  }
}

export default ToDoItem;
