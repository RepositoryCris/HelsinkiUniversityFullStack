Step 1 — Install required packages

Inside your project folder run:

npm install axios
npm install json-server --save-dev

Axios → used by the React app to fetch data

json-server → fake backend used during development

Step 2 — Create db.json

Create a file in the root of the project (same level as package.json).

Project structure:

phonebook
 ├ src
 ├ db.json
 ├ package.json

Content of db.json:

{
  "persons":[
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": "1"
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": "2"
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": "3"
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": "4"
    }
  ]
}
Step 3 — Add server script (recommended)

Edit package.json.

Add this inside "scripts":

"server": "json-server -p3001 db.json"

Now you can run the backend easily.

Step 4 — Start the backend

Run:

npm run server

You should see something like:

Resources
http://localhost:3001/persons

Open this in the browser:

http://localhost:3001/persons

If it shows the JSON list → server works correctly.

Step 5 — Import axios and useEffect

Open App.jsx.

Change the import:

import { useState, useEffect } from 'react'
import axios from 'axios'
Step 6 — Remove hardcoded persons

Replace this:

const [persons, setPersons] = useState([
  { name: 'Arto Hellas', number: '040-123456', id: 1 },
  { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
  { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
  { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
])

with:

const [persons, setPersons] = useState([])
Step 7 — Fetch data using useEffect

Add this inside App:

useEffect(() => {
  axios
    .get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
}, [])
Step 8 — What this code does
React Effect Hook

useEffect runs when the component loads.

}, [])

The empty array means:

Run only once when the component mounts.

Axios Request
axios.get('http://localhost:3001/persons')

This sends an HTTP GET request to the backend server.

Response
response.data

Contains the data from db.json.

Example:

[
 { name: "Arto Hellas", number: "040-123456", id: "1" },
 ...
]

This is stored in state using:

setPersons(response.data)
Step 9 — Run the application

Terminal 1:

npm run server

Terminal 2:

npm run dev

Now your React app loads the phonebook data from json-server using Axios.

Expected Result

When the page loads:

React renders the component

useEffect runs

Axios fetches /persons

State updates

Phonebook list appears