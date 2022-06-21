import React from "react";
import "./App.css";
import { todoList, typeList } from "./data";

class App extends React.Component {
  state = {
    todoList: todoList,
    types: typeList,
  };

  // Delete a todo item
  deleteItem = (id) => {
    this.setState({
      todoList: this.state.todoList.filter((item) => item.id !== id),
    });
  };

  // Add a todo item
  addItem = (newTodo) => {
    const newTodoList = [newTodo, ...this.state.todoList];
    this.setState({
      todoList: newTodoList,
    });
  };

  // Mark a todo as completed
  completeTodo = (id) => {
    const todo = { ...this.state.todoList.filter((todo) => todo.id === id) }[0];
    const newTodo = { ...todo, completed: !todo.completed };
    const newTodoList = [
      ...this.state.todoList.filter((todo) => todo.id !== id),
      newTodo,
    ];
    this.setState({
      todoList: newTodoList,
    });
  };

  // Class component render. Render the UI.
  render() {
    // console.log(this);

    return (
      <div className="container justify-content-md">
        <header>
          <h2 className="text-center p-3 text-underline">
            <u>To Do List</u>
          </h2>
        </header>
        <Form types={this.state.types} addItem={this.addItem} />
        <Progress todoList={this.state.todoList} />
        {this.state.todoList.map((todo) => (
          <TodoItem
            {...todo}
            deleteItem={this.deleteItem}
            key={todo.id}
            completeTodo={this.completeTodo}
          />
        ))}
      </div>
    );
  }
}
// Form component
// @description: Form to add a todo
class Form extends React.Component {
  state = {
    formData: {
      title: "",
      desc: "",
      type: "Low",
    },
  };

  addItem = () => {
    const newTodo = {
      ...this.state.formData,
      id: new Date().getTime(),
    };

    const emptyForm = {
      title: "",
      desc: "",
      type: "Low",
    };

    this.props.addItem(newTodo);
    this.setState({
      ...this.state,
      formData: emptyForm,
    });
  };

  render() {
    return (
      <section className="p-3 mb-3">
        <div className="form-floating mb-1">
          <input
            type="text"
            id="title"
            value={this.state.formData.title}
            className="form-control"
            placeholder="title"
            onChange={(e) => {
              const newState = this.state;
              newState.formData.title = e.target.value;
              this.setState(newState);
            }}
          />
          <label htmlFor="title">Title</label>
        </div>
        <div className="form-floating mb-1">
          <input
            type="text"
            value={this.state.formData.desc}
            id="description"
            className="form-control"
            placeholder="title"
            onChange={(e) => {
              const newState = this.state;
              newState.formData.desc = e.target.value;
              this.setState(newState);
            }}
          />
          <label htmlFor="description">Description</label>
        </div>
        <select
          className="form-select form-select-lg mb-1"
          aria-label="select"
          value={this.state.formData.type}
          onChange={(e) => {
            const newState = this.state;
            newState.formData.type = e.target.value;
            this.setState(newState);
          }}
        >
          {/* <option>Choose the type of your item</option> */}
          {this.props.types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          className="form-control btn btn-outline-primary"
          onClick={() => {
            this.addItem();
          }}
        >
          Add
        </button>
      </section>
    );
  }
}

// Progress component
// @description: Display a progress bar indicating the percentage of completed todos / total todos
class Progress extends React.Component {
  render() {
    const completeness = calcCompleteness(this.props.todoList);

    return (
      <>
        <h3>Complete Percentage: </h3>
        <div className="progress mb-5">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            aria-valuenow={completeness}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: `${completeness}%` }}
          >
            {this.props.todoList.length > 0
              ? completeness + "%"
              : "Nothing Left To Do"}
          </div>
        </div>
      </>
    );
  }
}

// TodoItem component
// @description: One todo Item
class TodoItem extends React.Component {
  handleDelete = (id) => {
    return () => {
      this.props.deleteItem(id);
    };
  };

  render() {
    const { id, type, title, desc, completed } = this.props;

    return (
      <div className={`card mb-3 border-${mapTypeToColor(type)}`}>
        <div className={`card-header bg-${mapTypeToColor(type)}`}>
          <div className="d-flex justify-content-between">
            <div className="">{type}</div>
            <button className="btn btn-dark" onClick={this.handleDelete(id)}>
              X
            </button>
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-secondary">{desc}</p>
          <button
            className="btn btn-success"
            disabled={completed}
            onClick={() => this.props.completeTodo(id)}
          >
            {completed ? "Completed" : "Not Completed"}
          </button>
        </div>
      </div>
    );
  }
}

/******************************* Utility Functions  *********************************/
// Take in a type and return a string for Bootstrap color suffix
// @param type A string in the types
// @return a string
function mapTypeToColor(type) {
  switch (type) {
    case "Low":
      return "info";
    case "Urgent":
      return "danger";
    case "Normal":
      return "warning";
    default:
      return "";
  }
}

// Calculate the percentage of completed todos in the list
// @param todoList a list of todoItems, each todo item is an object with the property "completed"
// @return number between 0 - 100
function calcCompleteness(todoList) {
  let intialValue = 0;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].completed) intialValue++;
  }

  const completeness = Math.round((intialValue / todoList.length) * 100);

  return completeness;
}

export default App;
