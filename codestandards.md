 Code Standards & Best Practices

### Chapter 1 — The Basics: Naming & Access Modifiers

**camelCase Always**
Use camelCase for all class members, variables, and properties.

```ts
✅ public selectedDealerId: string = ''
❌ public SelectedDealerId
❌ selected_dealer_id
```

**Access Modifiers**
- `protected` — used only inside the `.html` template
- `private` — used only within the `.ts` file
- `public` — accessed from outside the component (e.g., via `@ViewChild`)

**Return Types & JSDocs**
- *Always Declare Return Types* — Every function must have an explicit return type — `: void`, `: number`, or a typed interface like `: ApiUser`. This enforces strict type safety across the codebase.
- *Write JSDocs for Every Method* — Use `@description` and `@param` blocks so future developers (including yourself) understand what a function does and why it exists. `@returns` is optional if your TS return type is already set.

**Interfaces, Constants & Services**
- 🧩 **Interfaces Over Types** — Prefer `interface` for structuring payloads. Reserve `type` for complex unions or utility types only.
- 🔠 **ALL_CAPS Constants** — Layout constants go in a `constants/` folder (e.g., `table.constant.ts`). Export as `USERS_TABLE_LAYOUT` — never inline massive arrays in your component.
- 🔌 **Service Conventions** — Prefix private service members with `_`. Expose a public `asReadonly()` signal so components can read but never mutate directly.

**Import Grouping Order**
Grouped imports improve readability. Always follow this order:
1. **Angular Imports** — `@angular/core`, `@angular/common`, etc.
2. **Third-Party / Core Imports** — External libraries and `@core/services`
3. **Shared UI Components** — Reusable components from `shared/components`
4. **Local Imports** — Relative paths like `./constants` or `../utils`

### Chapter 2 — HTML & CSS

**Angular Control Flow & SVG Icons**
- *New Control Flow Only* — Use `@for` and `@if`. The old `*ngFor` and `*ngIf` are deprecated — do not use them.
- *SVG Sprite System* — Define raw SVGs in `public/icons/icon-sprite.svg` with a unique `id`. Reference them in templates via `<use href="assets/icons/icon-sprite.svg#icon-home">` — never inline full SVG code in components.

**BEM + Tailwind: Clean Templates**
Don't bloat HTML with 20 utility classes. Use BEM naming in templates and `@apply` in SCSS.

```html
<!-- my-component.html -->
<div class="card">
  <h2 class="card__title card__title--active">
    Hello World
  </h2>
</div>
```

```scss
/* my-component.scss */
.card {
  @apply bg-white shadow-md rounded-2xl p-6 border;

  &__title {
    @apply text-lg font-bold text-slate-700;

    &--active {
      @apply text-blue-600;
    }
  }
}
```

### Chapter 3 — Intermediate Concepts

**Member Ordering in Components**
Every component follows a strict ordering so any developer can read it predictably:
1. Injected Services
2. Inputs / Outputs
3. Signals & Computed
4. Constructor
5. Lifecycle Hooks
6. Custom Methods
7. API Calls (bottom, separated by a comment block)

**Architecture — DRY Code, Clean API Calls & Project Structure**

*Reusable Code (DRY)*
Extract repeated logic to `shared/utils`. Suffix interfaces with `.interface.ts`. Check `shared/pipes` and `shared/directives` before writing new ones.

*withLoading Pattern*
Use `withLoading(this.isLoading)` in your RxJS pipe — it auto-toggles the signal. Never call `.set(true)` / `.set(false)` manually. Map raw API responses inside a dedicated `mapDataToUi()` method to keep subscriptions clean.

*Where Things Live*
| Folder | Purpose |
|---|---|
| `app/core/services` | Services — singleton Injectable, `providedIn: 'root'` |
| `core/dto` | DTOs — exact API payload shapes |
| `features/` or `shared/components` | Components — page-level (`features/`) or reusable (`shared/components`) |

**Standard API Call Example**

```ts
/**
 * Fetches all media library contents based on the provided query parameters.
 * Toggles the loading state during the request and maps the response data to the UI.
 *
 * @param queryParams - The filtering, pagination, or sorting parameters for the fetch request.
 * @returns {void}
 */
private getAllContents(queryParams: QueryParams, append = false): void {
  // Cancel previous in-flight request before we trigger a new one
  this.getAllWithSearchSubscription?.unsubscribe();

  // Flag loading more contents if append is true
  if (append) {
    this.isLoadingMoreContents.set(true);
  }

  // Trigger search and store the subscription
  this.getAllWithSearchSubscription = forkJoin({
    contents: this.mediaLibraryService.getContents(queryParams),
  })
    .pipe(
      withLoading(this.isLoadingContents),
      catchError((error: unknown) => {
        Logger.error('MediaLibrary', 'error fetching contents', error);
        return EMPTY;
      }),
    )
    .subscribe(({ contents }) => {
      // Update pagination meta state
      this.paginationMeta.set(contents.meta.pagination);

      // Map data to UI (append for pagination, replace for search/filter)
      this.mapDataToUi(null, contents.data, append);

      // Unflag loading more contents
      this.isLoadingMoreContents.set(false);
    });
}
```

Key things to notice in this example:
- Proper access modifier (`private`)
- Proper JSDoc
- Proper usage of `withLoading`, and catching errors
- Clean and concise subscribe body using a `mapDataToUi` method

