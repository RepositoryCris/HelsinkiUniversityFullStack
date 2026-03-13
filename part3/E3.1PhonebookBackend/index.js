const express = require("express");
const app = express();
const PORT = 3001;
let persons = require("./persons");
const utils = require("./utils/helpers");

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/info", (request, response) => {
  response.send(utils.getInfoMessage(persons));
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person) {
    return response.status(404).end();
  }

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const person = persons.find((person) => person.id === id);
  if (!person) {
    return response.status(404).end();
  }

  const filteredPersons = persons.filter((person) => person.id !== id);
  persons = filteredPersons;
  console.log(`Person with id ${id} deleted successfully`);
  response.status(204).end();
});
