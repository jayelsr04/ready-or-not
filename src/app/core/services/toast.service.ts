import { Injectable, computed, signal } from '@angular/core';
import type { ToastVariant } from '@ntv360/component-pantry';

interface ToastState {
  message: string;
  variant: ToastVariant;
}

/**
 * Drives the single app-wide `<ntv-toast>` instance rendered in the Kanban board.
 * Components call `show()` to surface validation errors or blocked actions.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  // ================================
  // ===== Signals & Computed ========
  // ================================
  private readonly _toast = signal<ToastState | null>(null);

  /** Current toast to render, or null when none is active. */
  readonly toast = this._toast.asReadonly();

  // ================================
  // ===== Custom Methods ========
  // ================================
  /**
   * @description Shows a toast message, replacing any toast currently displayed.
   * @param message - The text to show the user.
   * @param variant - The visual style of the toast. Defaults to 'error'.
   * @returns {void}
   */
  show(message: string, variant: ToastVariant = 'error'): void {
    this._toast.set({ message, variant });
  }

  /**
   * @description Clears the currently visible toast.
   * @returns {void}
   */
  dismiss(): void {
    this._toast.set(null);
  }
}
