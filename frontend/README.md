# Butter – Real‑Time Spotify Clone (Frontend)

Built by Hament Kumar

Butter is a modern, real‑time music streaming UI with chat — inspired by Spotify. It features a responsive player, albums, presence/activity, and 1‑to‑1 messaging powered by Socket.IO, with Clerk authentication.

## Features
- **Music Player**
  - Play/Pause, previous/next
  - Seek bar and duration display
  - Volume control
  - Auto‑play next track
- **Albums & Tracks**
  - Album detail page with track list
  - Play entire album or a single track
- **Real‑Time Chat**
  - 1‑to‑1 messaging with persistence
  - Online users and activity updates
- **Presence & Activity**
  - Online/offline list
  - Live activity (e.g., Playing …, Idle)
- **Auth (Clerk)**
  - Sign in/out, user avatars, IDs available to the app
- **Admin Dashboard**
  - Protected area for admins
- **Branding and Theme**
  - Primary color token controls progress bar and volume slider
  - Buttons and indicators themed to brand

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS + Radix UI (shadcn‑style components)
- Zustand for client state
- Socket.IO client for realtime
- Clerk for authentication

## Project Structure (Frontend)
- `src/components` – UI components (Topbar, sliders, etc.)
- `src/layout` – Layout and player controls
- `src/pages` – Screens: home, album, chat
- `src/stores` – Zustand stores: auth, chat, music, player
- `src/types` – Shared TypeScript types
- `src/lib` – Axios instance, utilities

## Environment Setup
Create a `.env` file in `frontend` (use your values):
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE=http://localhost:5000
```

Backend needs its own `.env` (MongoDB URI, Clerk secret, etc.).

## Running Locally
Open two terminals:

1) Backend
```
cd backend
npm install
npm run dev
```

2) Frontend
```
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000 (or the port Vite shows).

## How Realtime Works
- On login, the client emits `user_connected` with the user’s ID.
- Presence/activity updates are broadcast to listeners.
- For chat, the sender emits `send_message { senderId, receiverId, content }`.
- Backend stores the message and emits `receive_message` only to the target user.

Socket events (frontend store handlers):
- `users_online`, `activities`, `user_connected`, `user_disconnected`
- `receive_message`, `message_sent`, `activity_updated`

## Color Customization
- Progress bar and volume slider use Tailwind `bg-primary`.
- Update `--primary` in `src/index.css` to change theme color.
- Play buttons use `#FEE400` by default in UI files:
  - `src/pages/home/components/PlayButton.tsx`
  - `src/pages/album/AlbumPage.tsx`

## Troubleshooting
- Vite Fast Refresh warning about “export compatibility”: a full page reload will resolve it during HMR.
- If Tailwind directives show as unknown in the editor, install Tailwind CSS IntelliSense; builds are unaffected.
- If sockets don’t connect, confirm backend runs at `http://localhost:5000` and CORS is allowed.

## License
This project is provided for learning and portfolio purposes.
If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
