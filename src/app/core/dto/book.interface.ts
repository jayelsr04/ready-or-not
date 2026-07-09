import { BookStatus } from './book-status.type';

/**
 * A single book tracked on the reading Kanban board.
 * Dates are stored as ISO strings (yyyy-MM-dd) or null when not yet set.
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  dateStarted: string | null;
  dateFinished: string | null;
  dateDropped: string | null;
  rating: number | null;
  review: string | null;
}

/**
 * Payload accepted by the "Add New Book" form.
 */
export interface NewBookInput {
  title: string;
  author: string;
  status: BookStatus;
  dateStarted: string | null;
  dateFinished: string | null;
}

/**
 * Payload accepted when editing a book's shown fields.
 * Only the fields relevant to the book's current status should be supplied.
 */
export interface BookEditInput {
  title: string;
  author: string;
  dateStarted?: string | null;
  dateFinished?: string | null;
  rating?: number | null;
  review?: string | null;
}

/**
 * Emitted when an existing book's fields are saved from the Book Modal.
 */
export interface BookEditedEvent {
  id: string;
  patch: BookEditInput;
}

/**
 * Emitted when a rating/review is saved (or skipped) from the Rate Book Modal.
 */
export interface BookRatedEvent {
  id: string;
  rating: number | null;
  review: string | null;
}
