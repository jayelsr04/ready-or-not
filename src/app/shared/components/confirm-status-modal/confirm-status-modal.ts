import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Button } from '@ntv360/component-pantry';
import { Modal, ModalAccent } from '../modal/modal';
import { StatusBadge } from '../status-badge/status-badge';

/** Which confirmation flow this modal is presenting. */
export type ConfirmStatusVariant = 'restore' | 'drop' | 'delete';

/**
 * Shared confirmation popup for the two status changes that require an
 * explicit "are you sure?" step: restoring a Dropped book, and confirming a
 * drag-into-Dropped move.
 */
@Component({
  selector: 'app-confirm-status-modal',
  standalone: true,
  imports: [Modal, Button, StatusBadge],
  templateUrl: './confirm-status-modal.html',
  styleUrl: './confirm-status-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmStatusModal {
  // ================================
  // ===== Inputs/Outputs ========
  // ================================
  /** Whether the modal is shown. */
  readonly open = input.required<boolean>();
  /** Which confirmation flow to render. */
  readonly variant = input.required<ConfirmStatusVariant>();

  /** Emitted when the user confirms the action. */
  readonly confirmed = output<void>();
  /** Emitted when the user cancels. */
  readonly cancelled = output<void>();

  // ================================
  // ===== Computed =================
  // ================================
  protected readonly isRestore = computed(() => this.variant() === 'restore');
  protected readonly isDelete = computed(() => this.variant() === 'delete');
  protected readonly accent = computed<ModalAccent>(() => (this.isRestore() ? 'blue' : 'pink'));
}
