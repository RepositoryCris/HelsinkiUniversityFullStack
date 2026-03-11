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

## Typo in commit message? Fix it or Forgot to add a file? Add it and amend

git commit --amend

What it does: Fixes your most recent commit instead of creating a new one.

Common uses:
git add forgotten-file.js
git commit --amend
git commit --amend -m "Fixed: Actually correct message"

## git push --force-with-lease origin part2

What it does: Force-pushes your changes BUT checks first if someone else changed the remote branch.

Simple explanation: "I know I'm overwriting the remote branch, but only do it if nobody else has pushed changes since I last pulled."

Why use it instead of git push -f:

git push -f = "Overwrite remote NO MATTER WHAT" (dangerous)

git push --force-with-lease = "Overwrite remote ONLY if I'm not deleting anyone else's work" (safer)

What happened in your case:

Before: Remote had [A] - [B] - [C]
Local had [A] - [B] - [C'] (C' is amended version)

After --force-with-lease: Remote now has [A] - [B] - [C']
Think of it like this:

Regular push: "Add my new stuff on top"

Force-with-lease: "Replace the last part with my version, but only if nobody touched it"

### Switch to main branch

git checkout main

### Make sure main is up to date

git pull origin main

### Merge part2 into main

git merge part2

### Push main to remote

git push origin main

### Switch back to part2 branch

git checkout part2

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

## Get the weather API

You will use:

👉 https://openweathermap.org

Steps:

Create an account

Generate an API key

Wait a few minutes until it activates

## Store the API key correctly (IMPORTANT)

Do not write the key directly in your code.

Instead use an environment variable.

Create a .env file in the root of your project:

VITE_WEATHER_KEY=your_api_key_here

Then in your code you can access it like:

import.meta.env.VITE_WEATHER_KEY

⚠️ Important:

It must start with VITE\_

Restart npm run dev after creating it.

### resume

create a file in the root called .env

Inside it: VITE_WEATHER_KEY="the key pf your account"

Then just run normally: npm run dev

USE THE KEY
const apiKey = import.meta.env.VITE_WEATHER_KEY
console.log(apiKey)

in the .gitignore file add .env for not having it in public
