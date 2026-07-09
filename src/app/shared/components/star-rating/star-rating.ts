import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { STAR_INDICES } from '../../../constants/star-rating.constant';

/**
 * Non-sequential 1-5 star rating control. Clicking any star directly fills all
 * stars up to that point (e.g. clicking the 4th star sets the rating to 4).
 */
@Component({
  selector: 'app-star-rating',
  standalone: true,
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRating {
  // ================================
  // ===== Inputs/Outputs ========
  // ================================
  /** Current rating value (0-5). */
  readonly rating = input<number | null>(0);
  /** When true, stars are display-only and cannot be changed. */
  readonly readonlyMode = input<boolean>(false);
  /** Visual size of the stars. */
  readonly size = input<'sm' | 'md'>('md');

  /** Emits the newly selected rating (1-5) when a star is clicked. */
  readonly ratingChange = output<number>();

  // ================================
  // ===== Signals & Computed ========
  // ================================
  /** The star index currently hovered, used for the fill preview. */
  private readonly hoverIndex = signal<number | null>(null);

  /** Static list of star slots to render. */
  protected readonly starIndices = STAR_INDICES;

  /** The rating value actually rendered as filled (hover preview takes precedence). */
  protected readonly displayRating = computed(() => this.hoverIndex() ?? this.rating() ?? 0);

  // ================================
  // ===== Custom Methods ========
  // ================================
  /**
   * @protected
   * @description Handles a star being clicked, emitting the clicked star's index as the new rating.
   * @param index - The 1-based index of the clicked star.
   * @returns {void}
   */
  protected onStarClick(index: number): void {
    if (this.readonlyMode()) {
      return;
    }
    this.ratingChange.emit(index === this.rating() ? 0 : index);
  }

  /**
   * @protected
   * @description Previews the fill state while hovering a star.
   * @param index - The 1-based index of the hovered star, or null on mouse leave.
   * @returns {void}
   */
  protected onStarHover(index: number | null): void {
    if (this.readonlyMode()) {
      return;
    }
    this.hoverIndex.set(index);
  }
}
