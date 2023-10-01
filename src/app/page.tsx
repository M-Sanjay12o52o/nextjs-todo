'use client'

import React, { useState, ChangeEvent } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoText, setTodoText] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
  };

  const handleAddTodo = () => {
    if (todoText.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: todoText,
        completed: false
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTodoText('');
    }
  };

  const handleTodoClick = (event: React.MouseEvent, todoId: number) => {
    event.stopPropagation();
    // Create a new array by mapping over the existing todos
    const updatedTodos = todos.map(todo => {
      // If the current todo matches the given todoId, toggle its 'completed' status
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      } else {
        // If the todo doesn't match the given todoId, leave it unchanged
        return todo;
      }
    });
  
    // Update the todos state with the new array of todos
    setTodos(updatedTodos);
  };

  const handleDelete = (event: React.MouseEvent, todoId: number) => {
    event.stopPropagation();  // Stop event propagation to prevent triggering handleTodoClick
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    setTodos(updatedTodos);
  };  

  return (
    <div>
      <ul className="todos">
        {todos.map((todo) => (
          <li key={todo.id} onClick={(event) => handleTodoClick(event, todo.id)} className={todo.completed ? 'completed' : ''}>
            <input type="checkbox" checked={todo.completed} onClick={(event) => event.preventDefault()} />
            {todo.text}
            <button onClick={(event) => handleDelete(event, todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input type="text" value={todoText} onChange={handleChange} />
      <button onClick={handleAddTodo}>Submit</button>
    </div>
  );
};

export default Home;
