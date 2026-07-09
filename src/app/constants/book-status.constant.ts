import { BookStatus } from '../core/dto/book-status.type';
import { DropdownOption } from '@ntv360/component-pantry';
import { ModalAccent } from '../shared/components/modal/modal';

/**
 * Visual + copy metadata for a single status column.
 */
export interface BookStatusMeta {
  status: BookStatus;
  label: string;
  cardBg: string;
  columnFrom: string;
  columnTo: string;
  dateColor: string;
  badgeBg: string;
  accent: ModalAccent;
}

/**
 * Ordered left-to-right column definitions rendered on the Kanban board.
 */
export const BOOK_STATUS_COLUMNS: readonly BookStatusMeta[] = [
  {
    status: 'to-read',
    label: 'To Read',
    cardBg: 'bg-[#f9f1f7]',
    columnFrom: 'from-[#ecd3e4]',
    columnTo: 'to-[#e4c2da]',
    dateColor: 'text-[#9ba0ac]',
    badgeBg: 'bg-[#dbd7ef]',
    accent: 'violet',
  },
  {
    status: 'in-progress',
    label: 'In Progress',
    cardBg: 'bg-[#fff2db]',
    columnFrom: 'from-[#ffe4b3]',
    columnTo: 'to-[#ffd485]',
    dateColor: 'text-[#9ba0ac]',
    badgeBg: 'bg-[#ffdba3]',
    accent: 'orange',
  },
  {
    status: 'finished',
    label: 'Finished',
    cardBg: 'bg-[#f1fdf0]',
    columnFrom: 'from-[#e3fae1]',
    columnTo: 'to-[#c3f4bf]',
    dateColor: 'text-[#31b828]',
    badgeBg: 'bg-[#c3f4bf]',
    accent: 'green',
  },
  {
    status: 'dropped',
    label: 'Dropped',
    cardBg: 'bg-[#fdf1f1]',
    columnFrom: 'from-[#fbe1e1]',
    columnTo: 'to-[#f9d0d0]',
    dateColor: 'text-[#ff0000]',
    badgeBg: 'bg-[#f7c6c6]',
    accent: 'pink',
  },
];

/**
 * Dropdown options for choosing a status in the "Add New Book" form.
 */
export const BOOK_STATUS_DROPDOWN_OPTIONS: readonly DropdownOption[] = BOOK_STATUS_COLUMNS.map(
  (column) => ({ label: column.label, value: column.status }),
);
