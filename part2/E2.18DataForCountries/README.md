# Create Project Folder

Open a Developer PowerShell for VS as an administrator

cd D:\HelsinkiUniversityFullStack\part2\

npm create vite@latest

Project name:
E2.18DataForCountries

Package name:
e2-18dataforcountries

Select a framework:
React

Select a variant:
JavaScript

Use Vite 8 beta (Experimental)?:
No

Install with npm and start now?
No

# Install and run dev

cd (Folder name)
npm install
npm run dev

It will run vite http://localhost:5173/ press o to open the browser

# Install axios

npm install axios

# Git commands

git checkout part2
git status
git add .
git commit -m "New commit message"
git push

## 🌐 Fetch API - Important Note on Data Structure

If API returns single object → store as object or array with one item

If API returns array of objects → store as array directly (no extra wrapping)

## Full render flow summary

App loads
↓
useEffect fetches countries
↓
countries state updates
↓
App re-renders
↓
Filter receives nations
↓
renderContent decides what to display
↓
User clicks "Show"
↓
setSelectedCountry(country)
↓
App state updates
↓
React re-renders
↓
Country component appears
