# Reading Kanban Board — Spec

## Book Fields (Add New Book)
- Title *(required)*
- Author *(required)*
- Date Started – Date Finished
- Status *(dropdown, required)*

## Sections
1. To Read
2. In Progress
3. Finished
4. Dropped

---

## Card Behavior
- Small cards are **clickable** and **draggable**.
- Background/placeholder cards behind them are **not** interactive.

---

## Drag Transitions

| From | To | Result |
|---|---|---|
| To Read | In Progress | Start Date = date it was dragged |
| To Read | Finished | Allowed (user forgot to move it to In Progress first). Triggers **Rate Your Book** popup. Date Started / Date Finished are left blank if not provided. |
| To Read | Dropped | Allowed (user forgot to move it to In Progress first). Triggers **Dropped confirmation** card. |
| In Progress | To Read | Resets Start Date and Finished Date (in case user wants to re-read from scratch). Card reverts to To Read view (title + author only). |
| In Progress | Finished | Triggers **Rate Your Book** popup. |
| In Progress | Dropped | Triggers **Dropped confirmation** card. |
| Finished | To Read | ❌ Not allowed |
| Finished | In Progress | ❌ Not allowed |
| Finished | Dropped | ❌ Not allowed |
| Dropped | Anywhere (drag) | ❌ Not allowed. The only way out of Dropped is the **Restore** button (see below). |

**Not allowed actions:** show a small popup informing the user the action isn't permitted.

---

## Rate Your Book Popup
- Triggers automatically **any time a card is dragged into Finished** (from To Read or In Progress).
- Lets the user set a **1–5 star rating** and write a short review.
- **Star rating is non-sequential** — clicking any star directly fills all stars up to that point (e.g., clicking the 4th star = 4/5 rating). Stars are outlined by default and fill based on the star clicked.
- Two buttons: **Save** or **Later** (skip for now — card still moves to Finished either way; rating/review can be added afterward).

---

## Card Click → Detail View

| Section | Fields Shown | Editable? |
|---|---|---|
| **To Read** | Title, Author | Yes — Edit button, can only edit fields shown (Title, Author) |
| **In Progress** | Title, Author, Date Started | Yes — Edit button, can only edit fields shown (Title, Author, Date Started) |
| **Finished** | Title, Author, Date Started, Date Finished, Rating, Review | Yes — Edit button, can only edit fields shown |
| **Dropped** | Title, Author, Date Started, Date Dropped | Read-only, no Edit button. Has a **Restore** button instead. |

---

## Restore Flow (Dropped → In Progress)
1. User clicks **Restore** button on a Dropped card's detail view.
2. Shows a **confirmation card** ("Are you sure you want to restore this book?").
3. On confirm, card moves to **In Progress**.

---

## Required Field Validation
- **Book Title**, **Author**, and **Status** are required at all times — both when **adding** a new book and when **editing** an existing card.
- If left blank on submit, show a **toast** (imported from the component pantry) notifying the user the field is required.