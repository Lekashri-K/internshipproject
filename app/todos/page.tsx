// app/todos/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [loadingTodos, setLoadingTodos] = useState<boolean>(true);
  const [todoError, setTodoError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoadingTodos(true);
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fetchedTodos: Todo[] = await response.json();
      setTodos(fetchedTodos);
    } catch (err: any) {
      setTodoError('Failed to fetch todos: ' + err.message);
    } finally {
      setLoadingTodos(false);
    }
  };

  const handleAddTodo = async () => {
    if (newTodoTitle.trim() === '') {
      setTodoError('Please enter a title for the new to-do.');
      return;
    }
    setTodoError(null);

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodoTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const addedTodo: Todo = await response.json();
      setTodos((prevTodos) => [...prevTodos, addedTodo]);
      setNewTodoTitle('');
    } catch (err: any) {
      setTodoError('Failed to add todo: ' + err.message);
    }
  };

  const handleToggleCompleted = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f7f6',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px',
          fontSize: '2.5em'
        }}>
          My To-Do List
        </h1>

        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Add a new todo..."
            style={{
              flexGrow: 1,
              padding: '12px 15px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '1em',
              minWidth: '200px'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTodo();
              }
            }}
          />
          <button
            onClick={handleAddTodo}
            style={{
              padding: '12px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
          >
            Add Todo
          </button>
        </div>

        {todoError && (
          <p style={{
            color: '#dc3545',
            textAlign: 'center',
            marginBottom: '15px',
            fontSize: '0.9em'
          }}>{todoError}</p>
        )}

        {loadingTodos ? (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1em', padding: '20px 0' }}>
            Loading todos...
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {todos.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', fontSize: '1.1em', padding: '20px 0' }}>
                No todos yet! Add one above.
              </p>
            ) : (
              todos.map((todo) => (
                <li
                  key={todo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #eee',
                    borderRadius: '5px',
                    padding: '15px',
                    marginBottom: '10px',
                    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)')}
                  onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  onClick={() => handleToggleCompleted(todo.id)}
                >
                  <span
                    style={{
                      fontSize: '1.1em',
                      color: todo.completed ? '#888' : '#333',
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      flexGrow: 1,
                      wordBreak: 'break-word',
                      marginRight: '10px'
                    }}
                  >
                    {todo.title}
                  </span>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleCompleted(todo.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#007bff'
                    }}
                  />
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoApp;