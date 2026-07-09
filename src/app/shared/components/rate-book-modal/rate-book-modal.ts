import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button, Textarea } from '@ntv360/component-pantry';
import { Book, BookRatedEvent } from '../../../core/dto/book.interface';
import { Modal } from '../modal/modal';
import { StarRating } from '../star-rating/star-rating';

/**
 * "Rate Your Book" popup, triggered automatically whenever a card is dragged
 * into the Finished column. Rating/review can be saved now or skipped for later.
 */
@Component({
  selector: 'app-rate-book-modal',
  standalone: true,
  imports: [FormsModule, Modal, Textarea, Button, StarRating],
  templateUrl: './rate-book-modal.html',
  styleUrl: './rate-book-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateBookModal {
  // ================================
  // ===== Inputs/Outputs ========
  // ================================
  /** Whether the modal is shown. */
  readonly open = input.required<boolean>();
  /** The book being moved into Finished. */
  readonly book = input<Book | null>(null);

  /** Emitted with the chosen rating/review when the user saves. */
  readonly saved = output<BookRatedEvent>();
  /** Emitted when the user skips rating for now (card still moves to Finished). */
  readonly later = output<string>();

  // ================================
  // ===== Signals =================
  // ================================
  protected readonly rating = signal<number | null>(null);
  protected readonly review = signal('');

  // ================================
  // ===== Constructor ==============
  // ================================
  constructor() {
    effect(() => {
      if (this.open()) {
        this.rating.set(null);
        this.review.set('');
      }
    });
  }

  // ================================
  // ===== Custom Methods ========
  // ================================
  /**
   * @protected
   * @description Emits the rating/review for the book and lets the parent finalize the move.
   * @returns {void}
   */
  protected onSaveClick(): void {
    const book = this.book();
    if (!book) {
      return;
    }
    this.saved.emit({ id: book.id, rating: this.rating(), review: this.review() || null });
  }

  /**
   * @protected
   * @description Skips rating for now; the card still moves to Finished.
   * @returns {void}
   */
  protected onLaterClick(): void {
    const book = this.book();
    if (book) {
      this.later.emit(book.id);
    }
  }
}
