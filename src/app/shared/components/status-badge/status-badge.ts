import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { BookStatus } from '../../../core/dto/book-status.type';
import { getBookStatusMeta } from '../../utils/book-status.util';

/** Small colored pill labelling a book's current column. */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
  // ================================
  // ===== Inputs/Outputs ========
  // ================================
  /** The status to render a badge for. */
  readonly status = input.required<BookStatus>();

  // ================================
  // =====  Computed ================
  // ================================
  /** Metadata (label + colors) resolved for the current status. */
  protected readonly meta = computed(() => getBookStatusMeta(this.status()));
}
