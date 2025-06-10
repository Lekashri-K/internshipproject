// packages/integrations/notion/notesync/notesync.schema.ts
import { z } from 'zod';

// Schema for the input parameters of the 'list-notes' function.
export const ListNotesInputSchema = z.object({
  // 'maxResults' is an optional number, defaulting to 10 if not provided.
  // It must be at least 1 if present.
  maxResults: z.number().int().positive().optional().default(10),
  // 'query' is an optional string for searching notes.
  query: z.string().optional(),
});

// Type derived from the input schema for TypeScript inference.
export type ListNotesInput = z.infer<typeof ListNotesInputSchema>;

// Schema for a single Note object.
export const NoteSchema = z.object({
  id: z.string().uuid(), // Unique identifier for the note, expected to be a UUID.
  title: z.string().min(1), // Note title, must be a non-empty string.
  content: z.string().optional(), // Optional content of the note.
  createdAt: z.string().datetime(), // ISO 8601 formatted datetime string for creation time.
  updatedAt: z.string().datetime().optional(), // Optional ISO 8601 formatted datetime string for last update time.
  tags: z.array(z.string()).optional(), // Optional array of strings for tags.
});

// Type derived from the Note schema.
export type Note = z.infer<typeof NoteSchema>;

// Schema for the response of the 'list-notes' function.
export const ListNotesResponseSchema = z.object({
  notes: z.array(NoteSchema), // An array of Note objects.
  totalCount: z.number().int().nonnegative(), // Total number of notes found (might be more than maxResults).
});

// Type derived from the response schema.
export type ListNotesResponse = z.infer<typeof ListNotesResponseSchema>;