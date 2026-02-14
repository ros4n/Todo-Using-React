import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function TodoApp() {
  const { logout, user } = useAuth();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const API_URL = "http://127.0.0.1:8000/api/todos/";
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL, { credentials: "include" });
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description, completed: false }),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        fetchTodos(); // refresh the list
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // 3️⃣ TOGGLE COMPLETE
  const toggleComplete = async (todo) => {
    try {
      await fetch(`${API_URL}${todo.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed: !todo.completed }),
      });
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // 4️⃣ DELETE TODO
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-800">Django Tasks</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleAddTodo} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Detailed description..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-all transform hover:scale-[1.01]">
            Add New Task
          </button>
        </form>

        {/* List Section */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 py-10">Connecting to Django...</div>
          ) : (
            todos?.map((todo) => (
              <div
                key={todo.id}
                className={`p-4 rounded-xl border-2 flex justify-between items-start transition-all ${
                  todo.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
                }`}
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo)}
                      className="w-5 h-5 cursor-pointer accent-green-600"
                    />
                    <h3
                      className={`font-bold text-lg ${
                        todo.completed ? "line-through text-gray-400" : "text-gray-700"
                      }`}
                    >
                      {todo.title}
                    </h3>
                  </div>
                  <p className={`mt-1 text-sm ${todo.completed ? "text-gray-400" : "text-gray-500"}`}>
                    {todo.description}
                  </p>
                  <span className="text-[10px] text-gray-300 font-mono mt-2 block italic">
                    Added: {new Date(todo.created_at).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-colors"
                  title="Delete Task"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}

          {!loading && todos.length === 0 && (
            <p className="text-center text-gray-400 italic mt-10">No tasks found. Start by adding one above!</p>
          )}
        </div>
      </div>
    </div>
  );
}
