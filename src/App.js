import React from "react";
import "./App.css";

const todoList = [
  {
    id: 1,
    title: "Assignment",
    type: "Low",
    desc: "Assignment due next Tuesday",
    completed: false,
  },
  {
    id: 2,
    title: "Lab Sign Off",
    type: "Normal",
    desc: "Lab Sign Off for Database next Monday",
    completed: false,
  },
  {
    id: 3,
    title: "Test",
    type: "Urgent",
    desc: "Operating System Test this Friday",
    completed: false,
  },
  {
    id: 4,
    title: "INTP Blog",
    type: "Urgent",
    desc: "Write a blog post",
    completed: true,
  },
];

const types = ["Low", "Normal", "Urgent"];

class App extends React.Component {
  state = {
    todoList: todoList,
    types: types,
  };

  deleteItem = (id) => {
    this.setState({
      todoList: this.state.todoList.filter((item) => item.id !== id),
    });
  };

  addItem = (newTodo) => {
    const newTodoList = [newTodo, ...this.state.todoList];
    this.setState({
      todoList: newTodoList,
    });
  };

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

  render() {
    return (
      <div className="container justify-content-md">
        <header>
          <h2 className="text-center p-3 text-underline">
            <u>To Do List</u>
          </h2>
        </header>
        <Form types={types} addItem={this.addItem} />
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

function calcCompleteness(todoList) {
  let intialValue = 0;
  for (let i = 0; i < todoList.length; i++) {
    if (todoList[i].completed) intialValue++;
  }

  const completeness = Math.round((intialValue / todoList.length) * 100);

  return completeness;
}

export default App;
