# Razer Snake

Snake game for Razer Chroma keyboards.

## How to run

Start a development server with.

```bash
npm install
npm run dev
```

Then, you can access to <http://localhost:8080/>, which will be loaded automatically if file changes detected.

## Build

```bash
npm install
npm run build
```

Then, you get `./dist` directory. The file structure should be the following.

```
dist/
├── bundle.js
├── index.html
└── src
    └── index.d.ts
```

`bundle.js` includes an inline source map.
