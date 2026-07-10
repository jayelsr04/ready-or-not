import { Injectable, computed, signal } from '@angular/core';
import { Book, BookEditInput, NewBookInput } from '../dto/book.interface';
import { BookStatus } from '../dto/book-status.type';
import { todayIso } from '../../shared/utils/date.util';
import { SEED_BOOKS } from '../../constants/seed-books.constant';


/**
 * @description Generates a reasonably unique id for a new book.
 * @returns {string} A new id.
 */
function generateBookId(): string {
  return `book-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

/**
 * Owns the reading Kanban board's book collection and every state transition
 * described in the product spec (adding, editing, drag transitions, restore).
 */
@Injectable({ providedIn: 'root' })
export class BookService {
  // ================================
  // ===== Signals & Computed ========
  // ================================
  private readonly _books = signal<Book[]>([...SEED_BOOKS]);


  /** Books grouped by their current column. */
  readonly booksByStatus = computed<Record<BookStatus, Book[]>>(() => {
    const grouped: Record<BookStatus, Book[]> = {
      'to-read': [],
      'in-progress': [],
      finished: [],
      dropped: [],
    };
    for (const book of this._books()) {
      grouped[book.status].push(book);
    }
    return grouped;
  });

  // ================================
  // ===== Custom Methods ==========
  // ================================
  /**
   * @description Looks up a single book by id.
   * @param id - The book id to find.
   * @returns {Book | undefined} The matching book, if any.
   */
  getBook(id: string): Book | undefined {
    return this._books().find((book) => book.id === id);
  }

  /**
   * @description Adds a new book to the board in the chosen status column.
   * @param input - The validated form payload from the "Add New Book" modal.
   * @returns {void}
   */
  addBook(input: NewBookInput): void {
    const book: Book = {
      id: generateBookId(),
      title: input.title,
      author: input.author,
      status: input.status,
      dateStarted: input.status === 'in-progress' ? (input.dateStarted ?? todayIso()) : input.dateStarted,
      dateFinished: input.dateFinished,
      dateDropped: null,
      rating: null,
      review: null,
    };
    this._books.update((books) => [...books, book]);
  }

  /**
   * @description Updates the fields shown for a book's current status (Title/Author always,
   * plus Date Started / Date Finished / Rating / Review where applicable).
   * @param id - The book id to update.
   * @param patch - The fields to overwrite.
   * @returns {void}
   */
  editBook(id: string, patch: BookEditInput): void {
    this.patch(id, patch);
  }

  /**
   * @description Applies the "To Read -> In Progress" transition: sets the start date to today.
   * @param id - The book id being moved.
   * @returns {void}
   */
  moveToInProgress(id: string): void {
    this.patch(id, { status: 'in-progress', dateStarted: todayIso() });
  }

  /**
   * @description Applies the "In Progress -> To Read" transition: resets both dates.
   * @param id - The book id being moved.
   * @returns {void}
   */
  resetToToRead(id: string): void {
    this.patch(id, { status: 'to-read', dateStarted: null, dateFinished: null });
  }

  /**
   * @description Moves a book into Finished. Called after the "Rate Your Book" popup is
   * saved or skipped; existing dates are left untouched if not supplied.
   * @param id - The book id being moved.
   * @param rating - The 1-5 rating, or null if skipped.
   * @param review - The review text, or null if skipped.
   * @returns {void}
   */
  moveToFinished(id: string, rating: number | null, review: string | null): void {
    this.patch(id, { status: 'finished', rating, review, dateFinished: todayIso() });
  }

  /**
   * @description Applies the "-> Dropped" transition after the drop confirmation is accepted.
   * @param id - The book id being dropped.
   * @returns {void}
   */
  dropBook(id: string): void {
    this.patch(id, { status: 'dropped', dateDropped: todayIso() });
  }

  /**
   * @description Permanently removes a book from the board.
   * @param id - The book id to delete.
   * @returns {void}
   */
  deleteBook(id: string): void {
    this._books.update((books) => books.filter((book) => book.id !== id));
  }

  /**
   * @description Restores a dropped book back to In Progress after the restore confirmation.
   * @param id - The book id being restored.
   * @returns {void}
   */
  restoreBook(id: string): void {
    this.patch(id, { status: 'in-progress', dateDropped: null });
  }

  /**
   * @private
   * @description Merges a partial update into the book with the given id.
   * @param id - The book id to update.
   * @param patch - The fields to overwrite.
   * @returns {void}
   */
  private patch(id: string, patch: Partial<Book>): void {
    this._books.update((books) =>
      books.map((book) => (book.id === id ? { ...book, ...patch } : book)),
    );
  }
}
