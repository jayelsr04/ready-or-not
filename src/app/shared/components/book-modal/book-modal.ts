import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button, Dropdown, DropdownOption, Input as NtvInput, Textarea } from '@ntv360/component-pantry';
import { Book, BookEditedEvent, BookEditInput, NewBookInput } from '../../../core/dto/book.interface';
import { BookStatus } from '../../../core/dto/book-status.type';
import { ToastService } from '../../../core/services/toast.service';
import { Modal, ModalAccent } from '../modal/modal';
import { StatusBadge } from '../status-badge/status-badge';
import { StarRating } from '../star-rating/star-rating';
import { getBookStatusMeta } from '../../utils/book-status.util';
import { BOOK_STATUS_DROPDOWN_OPTIONS } from '../../../constants/book-status.constant';

/** Which set of fields/actions the modal currently renders. */
export type BookModalMode = 'add' | 'view' | 'edit';

/**
 * Single modal covering the "Add New Book", "Book Details" (view), and
 * "Edit Book" popups for the to-read / in-progress / finished columns.
 * Dropped books use the separate DroppedBookModal instead.
 */
@Component({
  selector: 'app-book-modal',
  standalone: true,
  imports: [FormsModule, Modal, NtvInput, Textarea, Dropdown, Button, StatusBadge, StarRating],
  templateUrl: './book-modal.html',
  styleUrl: './book-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookModal {
  // ================================
  // ===== Injected Services ========
  // ================================
  private readonly toastService = inject(ToastService);

  // ================================
  // ===== Inputs/Outputs ========
  // ================================
  /** Whether the modal is shown. */
  readonly open = input.required<boolean>();
  /** The mode to reset to whenever the modal opens. */
  readonly initialMode = input<BookModalMode>('view');
  /** The book being viewed/edited. Ignored (may be null) in 'add' mode. */
  readonly book = input<Book | null>(null);
  /** Emitted when the modal should close without further action. */
  readonly closed = output<void>();
  /** Emitted with a validated payload when a new book is saved. */
  readonly added = output<NewBookInput>();
  /** Emitted with a validated patch when an existing book is saved. */
  readonly edited = output<BookEditedEvent>();
  /** Emitted when the user requests to permanently delete the book being viewed. */
  readonly deleteRequested = output<Book>();

  // ================================
  // ===== Signals & Computed ========
  // ================================
  /** Status dropdown options for 'add' mode. */
  protected readonly statusOptions: DropdownOption[] = [...BOOK_STATUS_DROPDOWN_OPTIONS];

  /** Current mode: 'add' | 'view' | 'edit'. */
  private readonly mode = signal<BookModalMode>('view');

  protected readonly title = signal('');
  protected readonly author = signal('');
  protected readonly dateStarted = signal<string | null>(null);
  protected readonly dateFinished = signal<string | null>(null);
  protected readonly status = signal<BookStatus | null>(null);
  protected readonly rating = signal<number | null>(null);
  protected readonly review = signal<string | null>(null);

  /** Effective status driving field visibility (chosen status while adding, book's status otherwise). */
  protected readonly effectiveStatus = computed<BookStatus>(
    () => (this.mode() === 'add' ? this.status() : this.book()?.status) ?? 'to-read',
  );

  protected readonly isAdd = computed(() => this.mode() === 'add');
  protected readonly isView = computed(() => this.mode() === 'view');
  protected readonly isReadonly = computed(() => this.isView());

  protected readonly showDateStarted = computed(() => this.isAdd() || this.effectiveStatus() !== 'to-read');
  protected readonly showDateFinished = computed(() => this.isAdd() || this.effectiveStatus() === 'finished');
  protected readonly showRatingReview = computed(() => !this.isAdd() && this.effectiveStatus() === 'finished');

  protected readonly modalAccent = computed<ModalAccent>(
    () => getBookStatusMeta(this.effectiveStatus()).accent,
  );
  protected readonly modalTitle = computed(() =>
    this.isAdd() ? 'Add New Book' : this.isView() ? 'Book Details' : 'Edit Book',
  );


  // ================================
  // ===== Constructor ==============
  // ================================
  constructor() {
    effect(() => {
      if (this.open()) {
        this.resetForm();
      }
    });
  }

  // ================================
  // ===== Custom Methods ========
  // ================================
  /**
   * @private
   * @description Re-seeds the form signals from the current book (or blank, for 'add') and mode.
   * @returns {void}
   */
  private resetForm(): void {
    this.mode.set(this.initialMode());
    const book = this.book();
    this.title.set(book?.title ?? '');
    this.author.set(book?.author ?? '');
    this.dateStarted.set(book?.dateStarted ?? null);
    this.dateFinished.set(book?.dateFinished ?? null);
    this.status.set(book?.status ?? 'to-read');
    this.rating.set(book?.rating ?? null);
    this.review.set(book?.review ?? null);
  }

  /**
   * @protected
   * @description Switches the modal from the read-only view into the editable form.
   * @returns {void}
   */
  protected onEditClick(): void {
    this.mode.set('edit');
  }

  /**
   * @protected
   * @description Requests deletion of the book currently being viewed.
   * @returns {void}
   */
  protected onDeleteClick(): void {
    const book = this.book();
    if (book) {
      this.deleteRequested.emit(book);
    }
  }

  /**
   * @protected
   * @description Applies a status dropdown selection to the 'add' form.
   * @param option - The selected dropdown option, or null if cleared.
   * @returns {void}
   */
  protected onStatusSelect(option: DropdownOption | null): void {
    this.status.set(option ? (option.value as BookStatus) : null);
  }

  /**
   * @protected
   * @description Updates the Date Started field, and while adding a new book,
   * auto-advances the status to "in-progress" once a start date is set.
   * @param value - The new date value, or null if cleared.
   * @returns {void}
   */
  protected onDateStartedChange(value: string | null): void {
    this.dateStarted.set(value);
    if (this.isAdd() && value) {
      this.status.set('in-progress');
    }
  }

  /**
   * @protected
   * @description Validates and emits the add/edit payload, per the required-field rule
   * (Title, Author and Status are always required).
   * @returns {void}
   */
  protected onSaveClick(): void {
    const title = this.title().trim();
    const author = this.author().trim();

    if (!title || !author || (this.isAdd() && !this.status())) {
      this.toastService.show('Title, Author, and Status are required.', 'error');
      return;
    }

    if (this.isAdd()) {
      this.added.emit({
        title,
        author,
        status: this.status()!,
        dateStarted: this.dateStarted(),
        dateFinished: this.dateFinished(),
      });
    } else {
      const book = this.book();
      if (!book) {
        return;
      }
      this.edited.emit({
        id: book.id,
        patch: {
          title,
          author,
          dateStarted: this.dateStarted(),
          dateFinished: this.dateFinished(),
          rating: this.rating(),
          review: this.review(),
        },
      });
    }

    this.closed.emit();
  }
}
