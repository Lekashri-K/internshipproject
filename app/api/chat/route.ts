// app/api/chat/route.ts
import { NextResponse } from 'next/server';

// This is a mock API key. In a real application, you would load this from process.env.
// For the Canvas environment, leave it empty as __initial_auth_token will be used internally.
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || ""; 

/**
 * Handles POST requests to /api/chat.
 * Simulates an AI response, streaming the output back to the client.
 */
export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    // --- Simulate LLM interaction ---
    // In a real application, you would call the Google Gemini API here.
    // Example using a placeholder for the actual API call:
    // const chatHistory = [{ role: "user", parts: [{ text: message }] }];
    // const payload = { contents: chatHistory };
    // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;
    // const geminiResponse = await fetch(apiUrl, {
    //    method: 'POST',
    //    headers: { 'Content-Type': 'application/json' },
    //    body: JSON.stringify(payload)
    // });
    // const geminiResult = await geminiResponse.json();
    // const aiResponseText = geminiResult.candidates[0].content.parts[0].text;

    // For this test, we'll use a hardcoded streamed response.
    const mockAiResponses = [
      "Hello there! ",
      "I am a large language model, ",
      "trained by Google. ",
      "How can I assist you today? ",
      "Feel free to ask me anything."
    ];

    let currentChunkIndex = 0;

    // Create a ReadableStream to stream the response back to the client
    const readableStream = new ReadableStream({
      async start(controller) {
        // Function to push chunks to the stream
        const pushNextChunk = () => {
          if (currentChunkIndex < mockAiResponses.length) {
            const chunk = mockAiResponses[currentChunkIndex];
            controller.enqueue(new TextEncoder().encode(chunk)); // Encode text to bytes
            currentChunkIndex++;
            setTimeout(pushNextChunk, 100); // Simulate typing delay
          } else {
            controller.close(); // Close the stream when all chunks are sent
          }
        };
        pushNextChunk(); // Start pushing chunks
      },
      cancel() {
        // Optional: Handle if the client cancels the stream
        console.log('Client cancelled stream.');
      },
    });

    // Return the stream as a response
    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8', // Or 'text/event-stream' for SSE
      },
    });

  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}