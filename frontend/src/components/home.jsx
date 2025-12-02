import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const navigate = useNavigate();

  // Get JWT token from localStorage
  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // send token in headers
    },
  };

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/todo/fetch", axiosConfig);
        setTodos(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch todos");
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [token, navigate]);

  // Create new todo
  const todocreate = async () => {
    if (!newTodo) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/todo/create",
        { task: newTodo, completed: false, createdAt: new Date() },
        axiosConfig
      );

      setTodos([...todos, response.data]);
      setNewTodo("");
      setError(null);
    } catch (err) {
      setError("Failed to create todo");
      console.error(err.response?.data || err.message);
    }
  };

  // Toggle completed status
  const todoStatus = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;

    try {
      const response = await axios.put(
        `http://localhost:3000/todo/update/${id}`,
        { ...todo, completed: !todo.completed },
        axiosConfig
      );
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
    } catch (err) {
      setError("Error updating todo status: " + err.message);
      console.error(err.response?.data || err.message);
    }
  };

  // Delete todo
  const todoDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/todo/delete/${id}`, axiosConfig);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError("Error deleting todo: " + err.message);
      console.error(err.response?.data || err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Days remaining calculation
  const getDaysRemaining = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const deadline = new Date(createdDate);
    deadline.setDate(deadline.getDate() + 7);
    const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-purple-700 mb-2 drop-shadow-lg">
        My Todo App
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Remaining todos: <span className="font-semibold">{remainingTodos}</span>
      </p>

      {/* Input Section */}
      <div className="w-full max-w-xl p-6 bg-white rounded-xl shadow-lg flex items-center mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="flex-1 border rounded-lg p-3 mr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={todocreate}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
        >
          Add
        </button>
      </div>

      {/* Loading & Error */}
      {loading && <p className="text-gray-600 mb-4">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {todos.length === 0 && !loading && (
        <p className="text-gray-500 mb-4">No todos found</p>
      )}

      {/* Todos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className={`p-5 rounded-xl shadow-md flex justify-between items-center transition transform hover:scale-105 ${
              todo.completed ? "bg-gray-200" : "bg-white"
            }`}
          >
            <div>
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "18px",
                }}
                onClick={() => todoStatus(todo._id)}
              >
                {todo.task}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Days remaining: {getDaysRemaining(todo.createdAt)}
              </p>
            </div>
            <button
              onClick={() => todoDelete(todo._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-10">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;
