import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Toast } from '@ntv360/component-pantry';
import { Book, BookEditedEvent, BookRatedEvent, NewBookInput } from '../../core/dto/book.interface';
import { BookStatus } from '../../core/dto/book-status.type';
import { BookService } from '../../core/services/book.service';
import { ToastService } from '../../core/services/toast.service';
import { Button } from '../../shared/components/button/button';
import { KanbanColumn } from '../../shared/components/kanban-column/kanban-column';
import { BookModal, BookModalMode } from '../../shared/components/book-modal/book-modal';
import { DroppedBookModal } from '../../shared/components/dropped-book-modal/dropped-book-modal';
import { RateBookModal } from '../../shared/components/rate-book-modal/rate-book-modal';
import {
  ConfirmStatusModal,
  ConfirmStatusVariant,
} from '../../shared/components/confirm-status-modal/confirm-status-modal';
import { resolveDragTransition } from '../../constants/drag-transition.constant';
import { BOOK_STATUS_COLUMNS } from '../../constants/book-status.constant';

/** Page: the full reading Kanban board with its columns and every popup. */
@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    KanbanColumn,
    BookModal,
    DroppedBookModal,
    RateBookModal,
    ConfirmStatusModal,
    Button,
    Toast,
  ],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoard {
  // ================================
  // ===== Injected Services ========
  // ================================
  private readonly bookService = inject(BookService);
  protected readonly toastService = inject(ToastService);

  // ================================
  // ===== Signals & Computed ========
  // ================================
  /** Column definitions rendered left-to-right. */
  protected readonly columns = BOOK_STATUS_COLUMNS;
  /** Books grouped by column. */
  protected readonly booksByStatus = this.bookService.booksByStatus;

  protected readonly bookModalOpen = signal(false);
  protected readonly bookModalMode = signal<BookModalMode>('add');
  protected readonly selectedBook = signal<Book | null>(null);

  protected readonly droppedModalOpen = signal(false);
  protected readonly droppedModalBook = signal<Book | null>(null);

  protected readonly rateModalOpen = signal(false);
  protected readonly rateModalBook = signal<Book | null>(null);

  protected readonly confirmModalOpen = signal(false);
  protected readonly confirmVariant = signal<ConfirmStatusVariant>('drop');
  private confirmTargetId: string | null = null;

  // ================================
  // ===== Custom Methods ===========
  // ================================
  /**
   * @protected
   * @description Opens the "Add New Book" popup.
   * @returns {void}
   */
  protected onAddBookClick(): void {
    this.selectedBook.set(null);
    this.bookModalMode.set('add');
    this.bookModalOpen.set(true);
  }

  /**
   * @protected
   * @description Opens the appropriate detail popup for a clicked card.
   * @param book - The book whose card was clicked.
   * @returns {void}
   */
  protected onCardClick(book: Book): void {
    if (book.status === 'dropped') {
      this.droppedModalBook.set(book);
      this.droppedModalOpen.set(true);
      return;
    }
    this.selectedBook.set(book);
    this.bookModalMode.set('view');
    this.bookModalOpen.set(true);
  }

  /**
   * @protected
   * @description Opens the delete confirmation for a book, requested either from the
   * book details modal's delete icon or the dropped book modal's delete icon.
   * @param book - The book to delete.
   * @returns {void}
   */
  protected onDeleteClick(book: Book): void {
    this.bookModalOpen.set(false);
    this.droppedModalOpen.set(false);
    this.confirmVariant.set('delete');
    this.confirmTargetId = book.id;
    this.confirmModalOpen.set(true);
  }


  /**
   * @protected
   * @description Persists a new book from the "Add New Book" form.
   * @param input - The validated form payload.
   * @returns {void}
   */
  protected onBookAdded(input: NewBookInput): void {
    this.bookService.addBook(input);
  }

  /**
   * @protected
   * @description Persists an edit to an existing book's shown fields.
   * @param event - The book id and validated patch.
   * @returns {void}
   */
  protected onBookEdited(event: BookEditedEvent): void {
    this.bookService.editBook(event.id, event.patch);
  }


  /**
   * @protected
   * @description Opens the restore confirmation for a Dropped book.
   * @param bookId - The book id to restore.
   * @returns {void}
   */
  protected onRestoreRequested(bookId: string): void {
    this.droppedModalOpen.set(false);
    this.confirmVariant.set('restore');
    this.confirmTargetId = bookId;
    this.confirmModalOpen.set(true);
  }

  /**
   * @protected
   * @description Applies the confirmed restore or drop action.
   * @returns {void}
   */
  protected onConfirmConfirmed(): void {
    if (!this.confirmTargetId) {
      return;
    }
    if (this.confirmVariant() === 'restore') {
      this.bookService.restoreBook(this.confirmTargetId);
    } else if (this.confirmVariant() === 'delete') {
    this.bookService.deleteBook(this.confirmTargetId);
    } else {
      this.bookService.dropBook(this.confirmTargetId);
    }
    this.confirmTargetId = null;
    this.confirmModalOpen.set(false);
  }

  /**
   * @protected
   * @description Cancels the pending restore/drop confirmation.
   * @returns {void}
   */
  protected onConfirmCancelled(): void {
    this.confirmTargetId = null;
    this.confirmModalOpen.set(false);
  }

  /**
   * @protected
   * @description Persists a rating/review and moves the book into Finished.
   * @param event - The book id, rating, and review to save.
   * @returns {void}
   */
  protected onRateSaved(event: BookRatedEvent): void {
    this.bookService.moveToFinished(event.id, event.rating, event.review);
    this.rateModalOpen.set(false);
  }


  /**
   * @protected
   * @description Skips rating and moves the book into Finished anyway.
   * @param bookId - The book id being moved.
   * @returns {void}
   */
  protected onRateLater(bookId: string): void {
    this.bookService.moveToFinished(bookId, null, null);
    this.rateModalOpen.set(false);
  }

  /**
   * @protected
   * @description Resolves and applies the effect of dropping a card onto a column,
   * per the Drag Transitions table in the product spec.
   * @param targetStatus - The column the card was dropped onto.
   * @param bookId - The id of the dragged book.
   * @returns {void}
   */
  protected onBookDropped(targetStatus: BookStatus, bookId: string): void {
    const book = this.bookService.getBook(bookId);
    if (!book) {
      return;
    }

    const effect = resolveDragTransition(book.status, targetStatus);

    switch (effect) {
      case 'START_DATE':
        this.bookService.moveToInProgress(bookId);
        break;
      case 'RESET_TO_TO_READ':
        this.bookService.resetToToRead(bookId);
        break;
      case 'RATE_BOOK':
        this.rateModalBook.set(book);
        this.rateModalOpen.set(true);
        break;
      case 'CONFIRM_DROP':
        this.confirmVariant.set('drop');
        this.confirmTargetId = bookId;
        this.confirmModalOpen.set(true);
        break;
      case 'CONFIRM_RESTORE':
        this.confirmVariant.set('restore');
        this.confirmTargetId = bookId;
        this.confirmModalOpen.set(true);
        break;
      case 'NOT_ALLOWED':
        this.toastService.show("That move isn't allowed.", 'warning');
        break;
    }
  }
}
