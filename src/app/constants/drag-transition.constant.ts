import { BookStatus } from '../core/dto/book-status.type';

/**
 * Side effect a drag-and-drop move between two columns should trigger,
 * as defined by the Drag Transitions table in the product spec.
 */
export type DragTransitionEffect =
  | 'START_DATE'
  | 'RATE_BOOK'
  | 'CONFIRM_DROP'
  | 'CONFIRM_RESTORE'
  | 'RESET_TO_TO_READ'
  | 'NOT_ALLOWED';

/**
 * Lookup of every allowed `from -> to` column move and the effect it triggers.
 * Any pair missing from this table is treated as NOT_ALLOWED.
 */
export const DRAG_TRANSITIONS: Readonly<
  Record<BookStatus, Partial<Record<BookStatus, DragTransitionEffect>>>
> = {
  'to-read': {
    'in-progress': 'START_DATE',
    finished: 'RATE_BOOK',
    dropped: 'CONFIRM_DROP',
  },
  'in-progress': {
    'to-read': 'RESET_TO_TO_READ',
    finished: 'RATE_BOOK',
    dropped: 'CONFIRM_DROP',
  },
  finished: {},
  dropped: {
    'in-progress': 'CONFIRM_RESTORE',
  },
};

/**
 * Resolves the effect for a proposed drag move.
 *
 * @description Looks up the DRAG_TRANSITIONS table for the given column pair.
 * @param from - The column the card was dragged out of.
 * @param to - The column the card was dropped into.
 * @returns {DragTransitionEffect} The effect to apply, or NOT_ALLOWED if the move is disallowed.
 */
export function resolveDragTransition(from: BookStatus, to: BookStatus): DragTransitionEffect {
  if (from === to) {
    return 'NOT_ALLOWED';
  }
  return DRAG_TRANSITIONS[from][to] ?? 'NOT_ALLOWED';
}
