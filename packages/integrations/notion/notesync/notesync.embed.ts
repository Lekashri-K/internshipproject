// packages/integrations/notion/notesync/notesync.embed.ts
import { Note } from './notesync.schema';

/**
 * This function is an optional component that could be used to 'embed' or
 * transform Notion notes data into a common internal data structure within
 * the larger system.
 *
 * For this mock, it simply passes the note through, but in a real scenario,
 * it would map Notion-specific fields to generic 'Note' fields used by your app.
 *
 * @param {Note} notionNote - The note object retrieved from Notion.
 * @returns {Note} The transformed note object.
 */
export function embedNote(notionNote: Note): Note {
  // In a real application, you might transform fields here, e.g.:
  // return {
  //   id: notionNote.id,
  //   title: notionNote.properties.Name.title[0].plain_text,
  //   content: notionNote.properties.Content.rich_text[0].plain_text,
  //   // ... more complex mapping
  // };
  return { ...notionNote }; // For now, just return the note as is
}