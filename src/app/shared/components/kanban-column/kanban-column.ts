import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Book } from '../../../core/dto/book.interface';
import { BookStatus } from '../../../core/dto/book-status.type';
import { BookCard } from '../book-card/book-card';
import { getBookStatusMeta } from '../../utils/book-status.util';

/**
 * A single Kanban column: header, colored gradient panel, and the book cards
 * currently in that status. Accepts drops of cards dragged from other columns.
 */
@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [BookCard, UpperCasePipe],
  templateUrl: './kanban-column.html',
  styleUrl: './kanban-column.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanColumn {
  // ================================
  // ===== Inputs/Outputs ========
  // ================================
  /** The status this column represents. */
  readonly status = input.required<BookStatus>();
  /** The books currently in this column. */
  readonly books = input<Book[]>([]);

  /** Emitted when a card in this column is clicked. */
  readonly cardClick = output<Book>();

  /** Emitted with the dragged book's id when it is dropped onto this column. */
  readonly bookDropped = output<string>();

  // ================================
  // ===== Signals & Computed ========
  // ================================
  /** Visual + copy metadata for this column. */
  protected readonly meta = computed(() => getBookStatusMeta(this.status()));

  /** True while a card is being dragged over this column, for hover styling. */
  protected readonly isDragOver = signal(false);

  // ================================
  // ===== Custom Methods ========
  // ================================
  /**
   * @protected
   * @description Marks the column as a drag target and allows the drop.
   * @param event - The native dragover event.
   * @returns {void}
   */
  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  /**
   * @protected
   * @description Clears the drag-target hover state.
   * @returns {void}
   */
  protected onDragLeave(): void {
    this.isDragOver.set(false);
  }

  /**
   * @protected
   * @description Reads the dragged book's id and emits it as dropped onto this column.
   * @param event - The native drop event.
   * @returns {void}
   */
  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const bookId = event.dataTransfer?.getData('text/plain');
    if (bookId) {
      this.bookDropped.emit(bookId);
    }
  }
}
