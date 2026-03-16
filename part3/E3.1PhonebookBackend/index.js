//imports
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
let persons = require("./persons");
const utils = require("./utils/helpers");

//app initialization
const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(cors());
app.use(express.json()); //json-parser

morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(
  morgan(":method :url :status :res[content-length] :response-time ms :body"),
);

//routes-----------------------------
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
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

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

app.post("/api/persons", (request, response) => {
  if (!request.body?.name || !request.body?.number) {
    return response.status(400).json({ error: "Name or number missing" });
  }

  if (
    persons.find(
      (person) => person.name.toLowerCase() === request.body.name.toLowerCase(),
    )
  ) {
    return response.status(400).json({ error: "Name must be unique" });
  }

  const maxId = getRandomInt(100, 10000);

  // There is no mutation of the data
  const newPerson = {
    id: String(maxId),
    name: request.body.name,
    number: String(request.body.number),
  };

  persons = [...persons, newPerson];

  response.json(newPerson);
});

//app.listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
