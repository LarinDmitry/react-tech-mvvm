# react-tech-mvvm

Small books app: list of books, All / Private switch, add form and a sticky header with your books counter.
React 19 + MobX, MVVM-ish layers, logic tested without rendering.

**Demo:** https://larindmitry.github.io/react-tech-mvvm/ (accept the API certificate first, see below)

## Getting started

Needs Node 20.19+ or 22.12+.

```bash
npm install
npm run dev     # http://localhost:5173
```

Before `npm run dev`, copy `.env.example` to `.env.local` and set `VITE_API_BASE`, the books API URL including the user, e.g. `https://<api-host>/v1/books/<user>`. Without it the app stops on start with an error in the console.

The API uses a self-signed certificate. If the list says "Could not load books", open the API URL in the browser once and accept the certificate.

## Deploy

Every push and pull request runs lint, tests with coverage and build. Pushes to `main` are then deployed to GitHub Pages (`.github/workflows/deploy.yml`).
The API URL is taken from the `VITE_API_BASE` repository secret. Pages source has to be set to "GitHub Actions" in the repo settings.

## Scripts

| Command             | What it does                 |
| ------------------- | ---------------------------- |
| `npm run dev`       | dev server                   |
| `npm test`          | run all tests once (Vitest)  |
| `npx vitest`        | tests in watch mode          |
| `npm run coverage`  | tests + coverage, 90% min    |
| `npm run typecheck` | TypeScript, strict           |
| `npm run lint`      | ESLint                       |
| `npm run format`    | Prettier                     |
| `npm run build`     | typecheck + production build |

## How it's built

```
View ──actions──▶ Controller ──▶ Repository ──▶ HttpGateway ──▶ API
View ◀────VM───── Controller ◀── Repository ◀── HttpGateway
```

- **HttpGateway** – thin wrapper over `fetch`. Base URL comes from env, `fetch` can be swapped in tests.
- **BooksRepository** – the only place that knows the endpoints. Maps DTOs to `Book`, keeps `allBooks` / `privateBooks` and their request state in MobX. Every component reads books from here, so there's one source of truth.
- **Controllers** – plain TS factories (`createXxxController`), no React inside. They expose ready-to-render values and actions, so tests just call methods and check values.
- **`useXxx` hooks** – only connect a controller to its view via `useController` (creates it once, calls `init` on mount and `dispose` on unmount).
- **Views** – `observer` function components that render the VM. No conditions or handlers with logic in TSX, ESLint fails on ternaries, `&&`, comparisons and `if` in `*.view.tsx` and `shared/ui`. The only thing `shared/ui` is allowed to do is unwrap DOM events (`event.target.value`, `preventDefault`).

No classes anywhere, just factories + `makeAutoObservable`. Dependencies are wired in `app/container.ts` and passed down through React context.

A few decisions:

- Books live in one shared store, so the header counter and the list never disagree.
- Switching between All and Private refetches that list, so it is always fresh and there is no cache to invalidate. The old list stays on screen (dimmed) until the new one arrives.
- After adding a book both lists are refetched instead of appending the book locally, since the API doesn't return the created book.

## Structure

```
src/
  app/                 entry point, App, DI container
  shared/
    gateway/           HttpGateway
    hooks/             useController
    store/             request state (loading / ready / error)
    ui/                dumb components: SegmentedControl, TextField, Form
  features/
    books/
      list/            books list with All / Private switch
      add/             add book form
    header/            sticky header with the counter
  test/                fake gateway, book fixtures, render helper
```

Each component with logic has `X.controller.ts`, `useX.ts`, `X.view.tsx`, `X.module.css` and `X.controller.test.ts`.

## Tests

Most tests are for controllers and the repository. They run in Node against a fake gateway, no DOM needed.
View tests use Testing Library + jsdom: the add flow end to end, shared ui components, and Profiler checks that components don't re-render for nothing.

In dev, React StrictMode mounts components twice, so you'll see some requests twice in the network tab. That's dev-only.
