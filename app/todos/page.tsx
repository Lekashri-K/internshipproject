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
    } catch (error: unknown) { // Changed 'any' to 'unknown'
      let errorMessage = 'Failed to fetch todos. Please try again.';
      if (error instanceof Error) { // Type guard for 'Error' instance
        errorMessage = 'Failed to fetch todos: ' + error.message;
      }
      setTodoError(errorMessage);
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
    } catch (error: unknown) { // Changed 'any' to 'unknown'
      let errorMessage = 'Failed to add todo. Please try again.';
      if (error instanceof Error) { // Type guard for 'Error' instance
        errorMessage = 'Failed to add todo: ' + error.message;
      }
      setTodoError(errorMessage);
    } finally {
      // If needed, you might set loading state here too for add operations
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
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(to right bottom, #e8f5e9, #c8e6c9)', // Light green gradient
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '15px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        maxWidth: '550px',
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid #a5d6a7', // Subtle border
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px',
          fontSize: '2.5em',
          fontWeight: '700',
          letterSpacing: '-0.5px'
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
              padding: '14px 18px',
              border: '1px solid #c8e6c9',
              borderRadius: '8px',
              fontSize: '1.05em',
              minWidth: '200px',
              outline: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#4CAF50', e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.08), 0 0 0 3px rgba(76,175,80,0.25)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#c8e6c9', e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.08)')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTodo();
              }
            }}
          />
          <button
            onClick={handleAddTodo}
            style={{
              padding: '14px 25px',
              background: 'linear-gradient(to right, #4CAF50, #66BB6A)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.05em',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'linear-gradient(to right, #388E3C, #43A047)', e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'linear-gradient(to right, #4CAF50, #66BB6A)', e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)')}
          >
            Add Todo
          </button>
        </div>

        {todoError && (
          <p style={{
            color: '#dc3545',
            textAlign: 'center',
            marginBottom: '15px',
            fontSize: '0.9em',
            backgroundColor: '#ffe0e6',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #dc3545'
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
                    borderRadius: '10px',
                    padding: '15px',
                    marginBottom: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
                  onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)')}
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
                      accentColor: '#4CAF50'
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
