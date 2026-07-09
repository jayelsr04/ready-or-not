import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/** Rounded outline call-to-action button, styled with the app's blue accent. */
@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  // ================================
  // ===== Inputs/Outputs ========
  // ================================
  /** Emits when the button is pressed. */
  readonly buttonClick = output<void>();

  // ================================
  // ===== Custom Method ============
  // ================================

  /**
   * @protected
   * @description Emits the buttonClick event when the button is pressed.
   * @returns {void}
   */
  protected onClick(): void {
    this.buttonClick.emit();
  }
}
