# Create folder

1. mkdir part3
2. mkdir E3.1PhonebookBackend

# Git

1. Go to E3.1PhonebookBackend/
2. git checkout -b part3

# Node

1. npm init

- Answer the questions

2. package name e3.1phonebookbackend
3. version: (1.0.0)
4. description: Phonebook backend
5. entry point: index.js
6. test command: ✓ Press enter (to set up testing)
7. git repository: ✓ Press enter (you can leave blank for now, or add it later)
8. keywords: ✓ Press enter (or add something like "express, phonebook, backend")
9. author: your name if you want
10. license: (ISC) ✓ Press Enter to accept default

Is this OK? (yes)
✓ Type "yes" and press Enter

## This creates package.json file

```JavaScript

/*package.json*/
{
  "name": "e3.1phonebookbackend",
  "version": "1.0.0",
  "description": "Phonebook backend",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "\"express",
    "phonebook",
    "backend\""
  ],
  "author": "Critian Mamani Aguirre",
  "license": "ISC"
}
```

The file defines, for instance, that the entry point of the application is the index.js file.

# Create index.js

1. touch index.js

## Add 'Hello World' index.js

```JavaScript
const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

### Working with the index.js as a script

Let's make a small change to the scripts object by adding a new script command.

```JavaScript
{
// ...
"scripts": {
  "start": "node index.js",  /*<--add this line*/
  "test": "echo \"Error: no test specified\" && exit 1"
},
// ...
}
```

### Run as a script

We can run the program directly with Node from the command line:

```JavaScript
node index.js
```

Or we can run it as an npm script:

```JavaScript
npm start
```

The start npm script works because we defined it in the package.json file:

```JavaScript
{
  // ...
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

Even though the execution of the project works when it is started by calling **node index.js** from the command line, it's customary for npm projects to execute such tasks as npm scripts.

Once the application is running, the following message is printed in the console:

```JavaScript
Server running on port 3001
```

# Open in the browser

By visiting the address http://localhost:3001:
The server works the same way regardless of the latter part of the URL.
Also the address http://localhost:3001/foo/bar will display the same content.

NB If port 3001 is already in use by some other application, then starting the server will result in the following error message:

```JavaScript
➜  hello npm start

> hello@1.0.0 start /Users/mluukkai/opetus/_2019fullstack-code/part3/hello
> node index.js

Server running on port 3001
events.js:167
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE :::3001
    at Server.setupListenHandle [as _listen2] (net.js:1330:14)
    at listenInCluster (net.js:1378:12)
```

You have two options. Either shut down the application using port 3001 (the JSON Server in the last part of the material was using port 3001), or use a different port for this application.

# Offer raw data in JSON format to the frontend

Change the server to return a hardcoded list of notes in the JSON format:

```JavaScript
const http = require('http')

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

The **application/json value** in the **Content-Type header** informs the receiver that _the data is in the JSON format_.

The notes array gets transformed into JSON formatted string with the **JSON.stringify(notes)** method.
This is necessary because the **response.end()** method **expects a string** or a buffer **to send as the response body**.

# Express

- Implementing the server code directly with Node's built-in http web server is possible.
- However, it is cumbersome, especially once the application grows in size.

Many libraries have been developed to ease server-side development with Node, by offering a more pleasing interface to work with the built-in http module.
By far the most popular library intended for this purpose is _Express_.

```JavaScript
 npm install express
```

- It installs node_modules
  These are the dependencies of the Express library and the dependencies of all of its dependencies, and so forth.
  These are called the transitive dependencies of our project.

- The dependency is also added to our package.json file:

```JavaScript
  "dependencies": {
    "express": "^5.2.1"
  }
```

We can update the dependencies of the project with the command:

```JavaScript
npm update
```

Likewise, if we start working on the project on another computer, we can install all up-to-date dependencies of the project defined in package.json by running this next command in the project's root directory:

```JavaScript
npm install
```

# Web and Express

Make the following changes:

At the beginning of the code, we're importing express

```JavaScript
const express = require('express')
const app = express()

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

To get the new version of our application into use, first we have to restart it.

There are two routes to the application. The first one defines an event handler that is used to handle HTTP GET requests made to the application's / root:

- See Hello World!: http://localhost:3001
- See notes: http://localhost:3001/api/notes

## Response

The request is responded to with the json method of the response object. Calling the method will send the notes array that was passed to it as a JSON formatted string. **Express automatically sets the Content-Type** header with the appropriate value of **application/json**.

Take a quick look at the data sent in JSON format.

In the earlier version using Node, we _had to transform the data into the JSON formatted string with the JSON.stringify_ method:

```JavaScript
response.end(JSON.stringify(notes))
```

With **Express**, _this is no longer required_, because **this transformation happens automatically**.

It's worth noting that JSON is a data format.
However, it's often represented as a string and is not the same as a JavaScript object, like the value assigned to notes.

# Automatic Change Tracking

If we change the application's code, we first need to stop the application from the console (ctrl + c) and then restart it for the changes to take effect.

You can make the server track our changes by starting it with the --watch option:

```JavaScript
node --watch index.js
```

Now, changes to the application's code will cause the server to restart automatically.
Note that although the server restarts automatically, you _still need to refresh the browser_.

Let's define a custom npm script in the package.json file to start the development server:

```JavaScript
{
// ..
"scripts": {
"start": "node index.js",
"dev": "node --watch index.js",     /*<--add this line*/
"test": "echo \"Error: no test specified\" && exit 1"
},
// ..
}
```

We can now start the server in development mode with the command

```JavaScript
npm run dev
```

Unlike when running the _start_ or _test_ scripts, the command must include **_run_**.

# Git

If you use **_git status_** notice that node modules is being tracked

```Bash
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        index.js
        node_modules/
        package-lock.json
        package.json
        set-up.md
```

- Create a .gitignore file

```JavaScript
/*.gitignore file*/
node_modules
```

- Add _node_modules_ **to avoid tracking** _node_modules_
- git status

```Bash
$ git status
On branch part3

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .gitignore
        index.js
        package-lock.json
        package.json
        set-up.md
```

Now git is not tracking _node modules folder anymore_

## Now add and commit your files:

- Add all files (except those in .gitignore)

```Bash
  git add .
```

- Check what will be committed

```Bash
  git status
```

- Commit them

```Bash
  git commit -m "Initialize phonebook backend with Express"
```

- Push to GitHub

```Bash
  git push -u origin part3
```

# REST

Let's expand our application so that it provides the same RESTful HTTP API as json-server.

Representational State Transfer, aka REST, was introduced in 2000 in Roy Fielding's dissertation. REST is an architectural style meant for building scalable web applications.

In some places you will see our model for a straightforward CRUD API, being referred to as an example of resource-oriented architecture instead of REST.

# Fetching a single resource

We can define parameters for **routes in Express** by using the **colon syntax** - example _'/api/notes/**:id'**_

```bash
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

Now app.get('/api/notes/:**id**', ...) will handle all HTTP GET requests that are of the form /api/notes/**SOMETHING**, where SOMETHING is an arbitrary string.

The id parameter in the route of a request can be accessed through the request object:

```JavaScript
const id = request.params.id
```

## Debugging tip

If you're ever unsure what Express is receiving, add:

```JavaScript
console.log(request.params);
```

Then visit:

```bash
http://localhost:3001/api/persons/1
```

You’ll see something like:

```JavaScript
{ id: '1' }
```

Extract the id correctly from **request.params.id**

## handle situation when no data is found

If no note is found, the server should respond with the status code 404 not found instead of 200.

```JavaScript
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return response.status(404).end();
  }

  response.json(person);
});
```

This part handles the situation when there is no data.
You could simplify the route slightly by returning early:

```JavaScript
  if (!person) {
    return response.status(404).end();
  }

  response.json(person);
```

Since no data is attached to the response, we use the status method for setting the [status](https://expressjs.com/en/4x/api.html#res.status) and the end method for responding to the request without sending any data.

# Deleting resources

Let's implement a route for deleting resources.
Deletion happens by making an HTTP DELETE request to the URL of the resource:

```JavaScript
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const person = persons.find((person) => person.id === id);
  if (!person) {
    return response.status(404).end();
  }

  const filteredPersons = persons.filter((person) => person.id !== id);
  persons = filteredPersons;
  response.status(204).end();
});
```

If deleting the resource is successful, meaning that the note exists and is removed, we **respond to the request with the status code 204 no content** and return no data with the response.

There's no consensus on what status code should be returned to a DELETE request if the resource does not exist. _The only two options are 204 and 404._ For the sake of simplicity, our application will respond with **204** in both cases.

# Postman

Install the Postman desktop client and try it out.

Postman is also available on VS Code which can be downloaded from the

- Extension tab on the left -> search for Postman -> First result (Verified Publisher) -> Install [Link](https://marketplace.visualstudio.com/items?itemName=Postman.postman-for-vscode)

You will then see an extra icon added on the activity bar below the extensions tab. Once you log in, you can follow the steps below

# The Visual Studio Code REST client

Install this extension in Visual Studio Code [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

🚀 How to Use

- Save the file with a .http or .rest extension

- Start your server: Make sure your backend is running on port 3001

- Click "Send Request" above each request, or use Ctrl+Alt+R

- View responses in the side panel that opens

```bash
### Get root endpoint
Send Request
GET http://localhost:3001/

### Get all persons
Send Request
GET http://localhost:3001/api/persons

### Get info page
Send Request
GET http://localhost:3001/info

### Get person with ID 1
Send Request
GET http://localhost:3001/api/persons/1

### Get person with ID 10 (likely non-existent)
Send Request
GET http://localhost:3001/api/persons/10
```

# Run as a script or as a development

- Run as a script with 'npm start'
- Add development mode with 'npm run dev'

```bash
PS D:\HelsinkiUniversityFullStack\part3\E3.1PhonebookBackend> npm start

> e3.1phonebookbackend@1.0.0 start
> node index.js

Server running on port 3001
PS D:\HelsinkiUniversityFullStack\part3\E3.1PhonebookBackend> npm run dev

> e3.1phonebookbackend@1.0.0 dev
> node --watch index.js

Server running on port 3001
```
