# Juice Jacking Quiz App

React/Vite kiosk quiz for a 9:16 portrait display. The target installation is a 2160x3840 screen with the browser running fullscreen.

## Running The Code

Install dependencies:

```bash
npm i
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Open `http://localhost:5173/` for the interactive quiz.

Open `http://localhost:5173/storyboard` or `http://localhost:5173/?mode=storyboard` for the static portrait storyboard/print mode.

## Video Setup

Place kiosk videos in the Vite public folder at the project root:

```text
public/videos/1.mov
public/videos/2.mov
public/videos/3.mov
public/videos/4.mov
public/videos/5.mov
```

Do not place runtime videos under `src/public/videos`; Vite serves files from root `public` at `/`, so the app loads `/videos/1.mov` through `/videos/5.mov`.

The app expects one video before each matching question. If a video is missing or cannot be decoded, the video screen shows `Video konnte nicht geladen werden.` and a large `Weiter` button.

`.mov` support depends on the browser and codec. If the kiosk browser cannot play the files reliably, export matching `.mp4` versions and update the video source mapping in `src/app/components/VideoPlaceholder.tsx`.

## Storyboard Export

The storyboard is optimized for 9:16 portrait. To export it as a PDF, open the storyboard URL in the browser, choose Print, enable background graphics, choose a portrait page size, and save as PDF.
