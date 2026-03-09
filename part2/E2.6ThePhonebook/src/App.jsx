import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import {
  getAll,
  createPerson,
  deletePerson,
  updatePerson,
} from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    getAll()
      .then((data) => setPersons(data))
      .catch((err) => {
        console.error("Failed to fetch persons:", err);
        alert("Could not fetch persons from server");
      });
  }, []);

  const handleNameChange = ({ target }) => setNewName(target.value);
  const handleNumberChange = ({ target }) => setNewNumber(target.value);
  const handleFilterChange = ({ target }) => setFilter(target.value);

  const personsToShow =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase()),
        );

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id);
    if (!person) return;

    if (window.confirm(`Delete ${person.name}?`)) {
      deletePerson(id)
        .then(() => {
          setPersons((prev) => prev.filter((p) => p.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
          alert("Failed to delete person from server");
        });
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timeoutId = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      // The Cleanup Function:
      // This runs if successMessage changes OR the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [successMessage]);

  const resetInputs = () => {
    setNewName("");
    setNewNumber("");
  };

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (newName.trim() === "" || newNumber.trim() === "") {
      alert("Name and number cannot be empty");
      resetInputs();
      return;
    }

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    );

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`,
      );
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        updatePerson(existingPerson.id, updatedPerson)
          .then((data) => {
            setPersons((prev) =>
              prev.map((person) =>
                person.id !== existingPerson.id ? person : data,
              ),
            );
            setSuccessMessage(
              `The number of ${data.name} is updated to ${data.number}`,
            );
            // No timer logic here! The useEffect above sees the message change and starts the timer automatically.
          })
          .catch((error) => {
            console.error("Failed to update person:", error);
            alert("Could not update person on server");
          })
          .finally(() => resetInputs());
      }
      return;
    }

    createPerson(personObject)
      .then((data) => {
        setPersons((prev) => prev.concat(data));
        setSuccessMessage(`'${data.name}' added to the phonebook`);
        // No timer logic here! The useEffect above sees the message change and starts the timer automatically.
      })
      .catch((error) => {
        console.error("Failed to create person:", error);
        alert("Could not add person to server");
      })
      .finally(() => resetInputs());
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <Filter handleFilterChange={handleFilterChange} filter={filter} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        newName={newName}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
