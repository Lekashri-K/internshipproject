// app/api/todos/route.ts
import { NextResponse } from 'next/server';

// Define the TypeScript interface for a To-Do item.
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// In-memory array to store to-do items.
// In a production application, this would be replaced with a database.
const todos: Todo[] = [
  { id: 1, title: 'Learn Next.js App Router', completed: false },
  { id: 2, title: 'Implement GET API route', completed: true },
  { id: 3, title: 'Add a POST method to accept new items', completed: false },
];

/**
 * Handles GET requests to /api/todos.
 * Returns a list of all to-do items.
 */
export async function GET() {
  // Simulate a network delay for demonstration purposes
  await new Promise(resolve => setTimeout(resolve, 300));
  return NextResponse.json(todos);
}

/**
 * Handles POST requests to /api/todos.
 * Accepts a new to-do item and adds it to the in-memory list.
 */
export async function POST(request: Request) {
  // Simulate a network delay for demonstration purposes
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const { title } = await request.json();

    // Validate the incoming title
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string.' },
        { status: 400 } // Bad Request
      );
    }

    // Generate a unique ID for the new todo item
    const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    const newTodo: Todo = {
      id: newId,
      title: title.trim(),
      completed: false, // New items are always incomplete by default
    };

    todos.push(newTodo); // Add the new todo to our in-memory array

    // Return the newly created todo with a 201 Created status
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Error processing POST request:', error);
    // Generic error for malformed requests
    return NextResponse.json(
      { error: 'Invalid request body or internal server error.' },
      { status: 400 }
    );
  }
}