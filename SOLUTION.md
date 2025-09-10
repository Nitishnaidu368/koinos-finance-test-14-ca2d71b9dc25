# SOLUTION.md

## Approach

### Backend
- **Async I/O:** All file operations in `items.js` use async/await to avoid blocking the event loop.
- **Stats Caching:** `/api/stats` caches results in memory and only recalculates when the data file changes, improving performance.
- **Pagination & Search:** `/api/items` supports `page`, `pageSize`, and `q` query params for efficient server-side pagination and search.
- **Testing:** Jest and Supertest cover happy and error paths for items routes.

### Frontend
- **Memory Leak Fix:** Uses `AbortController` to cancel fetches if the component unmounts, preventing setState on unmounted components.
- **Pagination & Search:** UI allows searching and paginating items, syncing with backend.
- **Virtualization:** `react-window` virtualizes the item list for smooth performance with large datasets.
- **UI/UX:** Accessible forms, ARIA labels, and a skeleton loader for loading state.

## Trade-offs
- **In-memory cache** for stats is simple and fast, but not distributed. For multi-instance deployments, a shared cache (e.g., Redis) would be better.
- **Pagination** is offset-based for simplicity. For very large datasets, cursor-based pagination may be more efficient.
- **Virtualization** is only on the current page, not across all data, but this is sufficient for most use cases.
- **Tests** focus on core routes; more coverage (e.g., validation, edge cases) could be added for production.

## How to Run
- Follow the README for setup.
- Run `npm test` in both `backend` and `frontend` to verify tests pass.

---
If you have questions, feel free to ask!
