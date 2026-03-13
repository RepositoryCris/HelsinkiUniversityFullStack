const express = require("express");
const app = express();
const PORT = 3001;
const persons = require("./persons");
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
