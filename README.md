# API Operations Dashboard — Sprint 3

A responsive dashboard built with React and Vite to fetch, monitor, and process API data efficiently.

## Features

- API integration using Fetch API and async/await
- Error handling with retry functionality
- 5-second request timeout using AbortController
- Skeleton loading UI
- Data filtering, searching, and sorting
- Web Worker for large dataset processing
- Dashboard statistics and network status
- Responsive design and accessibility improvements

## Tech Stack
React, JavaScript, Vite, HTML, CSS, Web Workers, Netlify
## Getting Started
npm install
npm run dev

## Production Build
npm run build
npm run preview

## Quality Assurance
- Tested API loading, errors, retries, and timeouts
- Verified search, filtering, sorting, and large dataset processing
- Lint and production build checks completed
- Lighthouse scores: 100/100 in Performance, Accessibility, Best Practices, and SEO

## structure
api-operations-dashboard/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── ErrorState.jsx
│   │   └── SkeletonLoader.jsx
│   ├── services/
│   │   └── api.js
│   ├── workers/
│   │   └── dataWorker.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md

## Author
Ankit Kumar[PDIT-FTE-11472]
