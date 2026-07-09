import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Border/accent color families used across the board's popups. */
export type ModalAccent = 'blue' | 'violet' | 'orange' | 'green' | 'pink';

/**
 * Reusable centered popup shell: a white card with a colored 2px border,
 * a bold centered title, and an optional close button.
 * Body content and footer buttons are projected in via ng-content.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  // ================================
  // ===== Inputs/Outputs ========
  // ================================
  /** Whether the modal is currently shown. */
  readonly open = input.required<boolean>();
  /** Title displayed in the modal header. */
  readonly titleText = input<string>('');
  /** Border/accent color family. */
  readonly accent = input<ModalAccent>('blue');
  /** Whether clicking the backdrop closes the modal. */
  readonly closeOnBackdrop = input<boolean>(true);
  /** Whether to render the top-right close (X) button. */
  readonly showCloseButton = input<boolean>(true);

  /** Emits when the modal should close (backdrop click or close button). */
  readonly closed = output<void>();

  // ================================
  // ===== Custom Method========
  // ================================

  /**
   * @protected
   * @description Closes the modal when the backdrop is clicked, if enabled.
   * @returns {void}
   */
  protected onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.closed.emit();
    }
  }
}
