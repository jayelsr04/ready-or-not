import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Book } from '../../../core/dto/book.interface';
import { UsDatePipe } from '../../pipes/us-date.pipe';
import { StarRating } from '../star-rating/star-rating';
import { getBookStatusMeta } from '../../utils/book-status.util';

/**
 * A single draggable, clickable book card rendered inside a Kanban column.
 * The fields shown (and which date) depend on the book's current status.
 */
@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [UsDatePipe, StarRating],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCard {
  // ================================
  // ===== Inputs/Outputs ========
  // ================================
  /** The book to render. */
  readonly book = input.required<Book>();

  /** Emitted when the card is clicked (and no drag just occurred). */
  readonly cardClick = output<Book>();

  // ================================
  // ===== Signals & Computed ========
  // ================================
  /** Visual metadata (colors) for the card's current status. */
  protected readonly meta = computed(() => getBookStatusMeta(this.book().status));

  /** The single secondary date shown on the card face, if any, for the current status. */
  protected readonly displayDate = computed<string | null>(() => {
    const book = this.book();
    switch (book.status) {
      case 'in-progress':
        return book.dateStarted;
      case 'finished':
        return book.dateFinished;
      case 'dropped':
        return book.dateDropped;
      default:
        return null;
    }
  });

  /** True while this card is being dragged; used to suppress the trailing click. */
  private justDragged = false;

  // ================================
  // ===== Custom Methods ========
  // ================================
  /**
   * @protected
   * @description Stashes the dragged book's id on the DataTransfer payload and notifies the parent.
   * @param event - The native dragstart event.
   * @returns {void}
   */
  protected onDragStart(event: DragEvent): void {
    this.justDragged = true;
    event.dataTransfer?.setData('text/plain', this.book().id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  /**
   * @protected
   * @description Resets the drag guard after a drag gesture ends.
   * @returns {void}
   */
  protected onDragEnd(): void {
    // Swallow the click that browsers fire right after a drag release.
    setTimeout(() => (this.justDragged = false), 0);
  }

  /**
   * @protected
   * @description Opens the card's detail view, unless a drag just completed.
   * @returns {void}
   */
  protected onClick(): void {
    if (this.justDragged) {
      return;
    }
    this.cardClick.emit(this.book());
  }
}
