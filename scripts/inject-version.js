#!/usr/bin/env node
// Appends ?v=GIT_HASH to all dist/ asset references in Alchemia.html so
// that a new deploy busts browser caches without renaming files.
const fs = require('fs');
const { execSync } = require('child_process');

const hash = execSync('git rev-parse --short HEAD').toString().trim();
const htmlPath = 'Alchemia.html';
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace(/((?:href|src)="dist\/[^"?]+)(?:\?v=[^"]+)?(")/g, `$1?v=${hash}$2`);

fs.writeFileSync(htmlPath, html);
console.log(`Versioned dist/ assets with ?v=${hash}`);
