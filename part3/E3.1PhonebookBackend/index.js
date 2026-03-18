//imports
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

//app initialization
const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.static("dist"));
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

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

/*
app.get("/info", (request, response) => {
  response.send(utils.getInfoMessage(persons));
});
*/

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (!person) {
      return response.status(404).end();
    }
    response.json(person);
  });
});
/*
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
*/
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body?.name || !body?.number) {
    return response.status(400).json({ error: "Name or number missing" });
  }
  /*
  if (
    persons.find(
      (person) => person.name.toLowerCase() === body.name.toLowerCase(),
    )
  ) {
    return response.status(400).json({ error: "Name must be unique" });
  }
  */
  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

//app.listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
