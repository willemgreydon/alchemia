#!/usr/bin/env node
// Bundles React + ReactDOM into a single IIFE that sets window.React and window.ReactDOM.
// React 19 dropped UMD builds, so we self-host via esbuild.
const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  stdin: {
    contents: `
import React from 'react';
import * as ReactDOMBase from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
window.React = React;
window.ReactDOM = { ...ReactDOMBase, ...ReactDOMClient };
`,
    resolveDir: path.resolve(__dirname, '..'),
  },
  bundle: true,
  format: 'iife',
  minify: true,
  outfile: path.resolve(__dirname, '../dist/react.bundle.min.js'),
  platform: 'browser',
  define: { 'process.env.NODE_ENV': '"production"' },
}).then(() => {
  console.log('Built dist/react.bundle.min.js (React 19.2.0 + ReactDOM)');
}).catch(e => {
  console.error(e);
  process.exit(1);
});
