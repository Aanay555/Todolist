'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, CheckCircle, Circle } from 'lucide-react';



interface Todo {
  id: string;
  text: string;
  completed: boolean;
  timestamp: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch (error) {
        console.error('Failed to parse todos:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      text: input.trim(),
      completed: false,
      timestamp: new Date().toLocaleString(),
    };

    setTodos((prev) => [...prev, newTodo]);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-500 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-t-2xl p-6 shadow-xl">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Task Manager
          </h1>

          <form onSubmit={handleSubmit} className="relative mb-6">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new task..."
              className="w-full px-4 py-3 pl-5 pr-16 rounded-xl border-2 border-purple-200 focus:outline-none focus:border-purple-500 transition-colors bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <Plus size={20} />
            </button>
          </form>

          {/* Filter Buttons */}
          <div className="flex justify-center gap-2 mb-6">
            {['all', 'active', 'completed'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as typeof filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Todo List Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-b-2xl shadow-xl">
          <div className="divide-y divide-gray-100">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group ${
                  todo.completed ? 'bg-green-50/50' : ''
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="text-purple-500 hover:text-purple-600 transition-colors"
                  >
                    {todo.completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        todo.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-700'
                      }`}
                    >
                      {todo.text}
                    </p>
                    <p className="text-sm text-gray-400">{todo.timestamp}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="p-2 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTodos.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <p className="text-lg">No tasks found</p>
              <p className="text-sm">
                {filter === 'all'
                  ? 'Add a new task to get started!'
                  : `No ${filter} tasks`}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
            <p>{todos.length} total tasks</p>
            {todos.some((todo) => todo.completed) && (
              <button
                onClick={clearCompleted}
                className="text-purple-500 hover:text-purple-600 transition-colors"
              >
                Clear completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}