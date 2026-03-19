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

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then((result) => {
      return response.send(`
      <p>Phone has info for ${result} people</p>
      <p>${new Date()}</p>
      `);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        return response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then((result) => {
      if (result === null) {
        return response.status(404).end();
      } else {
        return response.status(204).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body?.name || !body?.number) {
    return response.status(400).json({ error: "Name or number missing" });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const { number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { number: number },
    { new: true, runValidators: true },
  )
    .then((updatePerson) => {
      if (!updatePerson) {
        return response.status(404).end();
      }
      response.json(updatePerson);
    })
    .catch((error) => next(error));
});

// Error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
app.use(errorHandler);

//app.listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
