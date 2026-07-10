# Ready or Not 📚

A reading-tracker Kanban board built with Angular. Drag books through **To Read → In Progress → Finished**, or drop them into **Dropped** — with guided popups for rating, confirming, and restoring books along the way.

## Features

- **Four-column Kanban board** — To Read, In Progress, Finished, Dropped — each with its own accent color.
- **Drag & drop transitions** with rules enforced per the product spec (e.g. Finished and Dropped cards can't be dragged back out; disallowed moves show a toast).
- **Add / View / Edit Book modal** — a single modal that adapts its fields and editability based on the book's column and current mode.
- **Rate Your Book popup** — triggers automatically when a card is dragged into Finished; supports a non-sequential 1–5 star rating plus a review, with **Save** or **Later**.
- **Dropped Book modal** — read-only detail view for dropped books, with **Restore** and **permanent delete** actions.
- **Confirmation popups** for restore, drop, and delete actions.
- **Toast notifications** for validation errors and disallowed drag actions.
- Server-side rendering (SSR) via Angular's built-in `@angular/ssr`.

## Tech Stack

- **Angular 22** — standalone components, signals (`signal`/`computed`/`effect`), new `@if`/`@for` control flow, `OnPush` change detection throughout
- **TypeScript**
- **Tailwind CSS** (with BEM-style class names + `@apply` in component SCSS)
- **@ntv360/component-pantry** — internal shared UI kit (buttons, inputs, dropdown, textarea, toast)
- **Vitest** — unit testing
- **Express** — SSR server (`server.mjs`)

## Project Structure

```
src/app/
├── core/
│   ├── dto/            # Book, BookStatus, and event payload types
│   └── services/        # BookService (board state), ToastService
├── constants/            # Column metadata, drag-transition rules, star-rating & seed data
├── shared/
│   ├── components/       # Modal, Button, BookCard, KanbanColumn, StatusBadge, StarRating,
│   │                      # BookModal, RateBookModal, ConfirmStatusModal, DroppedBookModal
│   ├── pipes/             # us-date pipe
│   └── utils/             # date + book-status helpers
└── features/
    └── kanban-board/     # Top-level page: composes the columns + every modal
```

Reusable presentation (`Modal`, `Button`) is built on Angular content projection (`ng-content`) with named slots (`modal-corner`, default body, `modal-footer`); feature-specific modals (`BookModal`, `RateBookModal`, etc.) own their own state and project their content into the shared shell. 

## Getting Started

### Prerequisites
- Node.js 20.19+ or 22+ (Angular 22 requirement)
- npm
- Access token for the private `@ntv360` registry (see below)

### Install

This project pulls `@ntv360/component-pantry` from a private registry configured in `.npmrc`. Set an `NPM_TOKEN` environment variable with a valid token before installing:

```bash
export NPM_TOKEN=your-token-here   # or set it in your shell profile / CI secrets
npm install
```

### Development server

```bash
npm start
# or: ng serve
```

Navigate to `http://localhost:4200/`. The app reloads automatically on source changes.

### Build

```bash
npm run build
```

Outputs to `dist/my-app/` (both `browser/` and `server/` bundles, since SSR is enabled).

### Run the SSR server locally (after building)

```bash
npm run serve:ssr:my-app
```

### Unit tests

```bash
npm test
```

Runs the Vitest suite via `ng test`.

## Deployment

This app is deployed on [Vercel](https://vercel.com), connected to this GitHub repository. Pushing to `main` triggers a production deployment; pushing to any other branch or opening a PR produces a preview deployment. Vercel auto-detects the Angular SSR build output — no custom `vercel.json` is required as long as the project's Framework Preset is set to **Angular**.

> Remember to add `NPM_TOKEN` as an environment variable in the Vercel project settings as well, so installs succeed during the build.

## License

Private project — not currently licensed for external use.
