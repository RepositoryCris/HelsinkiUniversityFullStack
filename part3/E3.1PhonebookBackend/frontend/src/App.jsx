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
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    getAll()
      .then((data) => {
        setPersons(data);
      })
      .catch((err) => {
        console.error("Failed to fetch persons:", err);
        setNotification({
          message: "Could not fetch persons from server",
          type: "error",
        });
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
          setNotification({
            message: `${person.name} deleted from the phonebook`,
            type: "info",
          });
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
          setNotification({
            message: `Could not delete ${person.name}, it may not be in the server, try reloading`,
            type: "warning",
          });
        });
    }
  };

  useEffect(() => {
    if (notification) {
      const timeoutId = setTimeout(() => {
        setNotification(null);
      }, 5000);

      // The Cleanup Function:
      // This runs if notification changes OR the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [notification]);

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
      setNotification({
        message: "Name and number cannot be empty",
        type: "warning",
      });
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
              prev.map((person) => (person.id === data.id ? data : person)),
            );
            setNotification({
              message: `The number of ${data.name} is updated to ${data.number}`,
              type: "success",
            });
            // No timer logic here! The useEffect above sees the message change and starts the timer automatically.
            resetInputs();
          })
          .catch((error) => {
            let message = "Server is unavailable";

            if (error.response) {
              // The server responded
              if (error.response.status === 404) {
                message = `Information of '${existingPerson.name}' has already been removed from the server`;
                // Optionally remove them from state:
                setPersons((prev) =>
                  prev.filter((person) => person.id !== existingPerson.id),
                );
              } else if (error.response.data?.error) {
                message = error.response.data.error; // backend validation message
              }
            }

            setNotification({
              message: message,
              type: "error",
            });
            console.error("Failed to update person:", error);
          });
      }
      return;
    }

    createPerson(personObject)
      .then((data) => {
        setPersons((prev) => prev.concat(data));
        setNotification({
          message: `'${data.name}' added to the phonebook`,
          type: "success",
        });
        // No timer logic here! The useEffect above sees the message change and starts the timer automatically.
        resetInputs();
      })
      .catch((error) => {
        setNotification({
          message: error.response?.data?.error || "Server is unavailable",
          type: "error",
        });
        /*console.log("FULL ERROR:", error);
        console.log("RESPONSE:", error.response);
        console.log("DATA:", error.response?.data); //real error data*/
      });
  };

  return (
    <div>
      <Notification notification={notification} />
      <h2>Phonebook</h2>
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
