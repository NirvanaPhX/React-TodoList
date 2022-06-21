import React, { useState } from "react";
import { todoList, typeList } from "./data";

export const AppFunction = () => {
  const [todos, setTodos] = useState(todoList);
  const [types, setTypes] = useState(typeList);

  // Delete a todo item
  const deleteItem = (id) => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  // Add a todo item
  const addItem = (newTodo) => {
    setTodos([newTodo, ...todoList]);
  };

  // Mark a todo as completed
  const completeTodo = (id) => {
    const todo = { ...todos.filter((todo) => todo.id === id) }[0];
    const newTodo = { ...todo, completed: !todo.completed };
    const newTodoList = [...todos.filter((todo) => todo.id !== id), newTodo];
    setTodos(newTodoList);
  };

  return (
    <div className="container justify-content-md">
      <header>
        <h2 className="text-center p-3 text-underline">
          <u>To Do List</u>
        </h2>
      </header>
      <Form types={types} addItem={addItem} />
      <Progress todoList={todos} />
      {todos.map((todo) => (
        <TodoItem
          {...todo}
          deleteItem={deleteItem}
          key={todo.id}
          completeTodo={completeTodo}
        />
      ))}
    </div>
  );
};

const Form = (props) => {
  const initialState = {
    id: "",
    title: "",
    desc: "",
    type: "Low",
  };

  const [formData, setFormData] = useState(initialState);

  const addItem = () => {
    const newTodo = {
      ...formData,
      id: new Date().getTime(),
    };

    props.addItem(newTodo);
    setFormData(initialState);
  };

  return (
    <section className="p-3 mb-3">
      <div className="form-floating mb-1">
        <input
          type="text"
          id="title"
          value={formData.title}
          className="form-control"
          placeholder="title"
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
          }}
        />
        <label htmlFor="title">Title</label>
      </div>
      <div className="form-floating mb-1">
        <input
          type="text"
          value={formData.desc}
          id="description"
          className="form-control"
          placeholder="title"
          onChange={(e) => {
            setFormData({ ...formData, desc: e.target.value });
          }}
        />
        <label htmlFor="description">Description</label>
      </div>
      <select
        className="form-select form-select-lg mb-1"
        aria-label="select"
        value={formData.type}
        onChange={(e) => {
          setFormData({ ...formData, type: e.target.value });
        }}
      >
        {/* <option>Choose the type of your item</option> */}
        {props.types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <button
        className="form-control btn btn-outline-primary"
        onClick={() => {
          addItem();
        }}
      >
        Add
      </button>
    </section>
  );
};

const Progress = (props) => {
  const completeness = calcCompleteness(props.todoList);

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
          {props.todoList.length > 0
            ? completeness + "%"
            : "Nothing Left To Do"}
        </div>
      </div>
    </>
  );
};

const TodoItem = ({
  id,
  type,
  title,
  desc,
  completed,
  deleteItem,
  completeTodo,
}) => {
  return (
    <div className={`card mb-3 border-${mapTypeToColor(type)}`}>
      <div className={`card-header bg-${mapTypeToColor(type)}`}>
        <div className="d-flex justify-content-between">
          <div className="">{type}</div>
          <button
            className="btn btn-dark"
            onClick={() => {
              deleteItem(id);
            }}
          >
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
          onClick={() => completeTodo(id)}
        >
          {completed ? "Completed" : "Not Completed"}
        </button>
      </div>
    </div>
  );
};
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
