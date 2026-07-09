import { BookStatus } from '../../core/dto/book-status.type';
import { BookStatusMeta, BOOK_STATUS_COLUMNS } from '../../constants/book-status.constant';

/**
 * Looks up the display metadata for a given book status.
 * @param status - The status to find metadata for.
 * @returns {BookStatusMeta} The matching column metadata.
 */
export function getBookStatusMeta(status: BookStatus): BookStatusMeta {
  return BOOK_STATUS_COLUMNS.find((column) => column.status === status)!;
}
