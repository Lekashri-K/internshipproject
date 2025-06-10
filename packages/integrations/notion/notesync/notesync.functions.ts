// packages/integrations/notion/notesync/notesync.functions.ts
import {
  ListNotesInput,
  ListNotesResponse,
  ListNotesInputSchema,
  Note, // Import Note type for mocking
} from './notesync.schema';

/**
 * Mock data for demonstration purposes. In a real integration, this would come from an external API.
 */
const mockNotes: Note[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    title: 'Meeting Notes for Project X',
    content: 'Discussed Q3 strategy and action items.',
    createdAt: '2023-01-15T10:00:00Z',
    tags: ['meeting', 'project-x'],
  },
  {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    title: 'Brainstorming Session: New Feature Ideas',
    content: 'Came up with several innovative concepts for v2.',
    createdAt: '2023-02-01T14:30:00Z',
    updatedAt: '2023-02-01T15:00:00Z',
    tags: ['brainstorm', 'features'],
  },
  {
    id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef23',
    title: 'Onboarding Checklist - New Hire',
    content: 'Remember to set up their dev environment and introduce them to the team.',
    createdAt: '2023-03-10T09:00:00Z',
    tags: ['onboarding', 'hr'],
  },
  {
    id: 'd4e5f6a7-b8c9-0123-4567-890abcdef345',
    title: 'Weekly Sync Up',
    content: 'Reviewed progress and resolved blockers. Next steps defined.',
    createdAt: '2023-04-05T11:00:00Z',
    tags: ['sync', 'status'],
  },
];

/**
 * Mocks the 'list-notes' API function for the Notion Notesync service.
 * This function simulates fetching a list of notes based on query parameters.
 *
 * @param {ListNotesInput} input - The input parameters for listing notes, validated by ListNotesInputSchema.
 * @returns {Promise<ListNotesResponse>} A promise that resolves to a mocked list of notes.
 */
export async function listNotes(input: ListNotesInput): Promise<ListNotesResponse> {
  // Validate input using the Zod schema.
  // This ensures the incoming data conforms to the expected structure.
  const validatedInput = ListNotesInputSchema.parse(input);
  const { maxResults, query } = validatedInput;

  // Simulate an asynchronous API call (e.g., network latency).
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredNotes = mockNotes;

  // Apply query filtering if a query string is provided.
  if (query) {
    const lowerCaseQuery = query.toLowerCase();
    filteredNotes = mockNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerCaseQuery) ||
        note.content?.toLowerCase().includes(lowerCaseQuery) ||
        note.tags?.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
    );
  }

  // Apply maxResults limit.
  const slicedNotes = filteredNotes.slice(0, maxResults);

  // Return a mocked response conforming to ListNotesResponseSchema.
  return {
    notes: slicedNotes,
    totalCount: filteredNotes.length, // Total count before applying maxResults limit
  };
}