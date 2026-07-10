import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button, Input as NtvInput } from '@ntv360/component-pantry';
import { Book } from '../../../core/dto/book.interface';
import { Modal } from '../modal/modal';
import { StatusBadge } from '../status-badge/status-badge';

/**
 * Read-only detail popup for a Dropped book. Has no Edit button — the only
 * way out of Dropped is the Restore action, per the product spec.
 */
@Component({
  selector: 'app-dropped-book-modal',
  standalone: true,
  imports: [FormsModule, Modal, NtvInput, Button, StatusBadge],
  templateUrl: './dropped-book-modal.html',
  styleUrl: './dropped-book-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DroppedBookModal {
  // ================================
  // ===== Inputs/Outputs ========
  // ================================
  /** Whether the modal is shown. */
  readonly open = input.required<boolean>();
  /** The dropped book being viewed. */
  readonly book = input<Book | null>(null);

  /** Emitted when the modal should close without further action. */
  readonly closed = output<void>();
  /** Emitted with the book id when the user requests to restore it. */
  readonly restoreRequested = output<string>();
  /** Emitted with the book when the user requests to permanently delete it. */
  readonly deleteRequested = output<Book>();

  // ================================
  // ===== Custom Methods ========
  // ================================

  /**
   * @protected
   * @description Requests the restore confirmation flow for the current book.
   * @returns {void}
   */
  protected onRestoreClick(): void {
    const book = this.book();
    if (book) {
      this.restoreRequested.emit(book.id);
    }
  }

  /**
   * @protected
   * @description Requests permanent deletion of the dropped book currently being viewed.
   * @returns {void}
   */
  protected onDeleteClick(): void {
    const book = this.book();
    if (book) {
      this.deleteRequested.emit(book);
    }
  }
}
